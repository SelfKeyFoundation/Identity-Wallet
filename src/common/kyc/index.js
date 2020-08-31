import { marketplaceSelectors } from '../marketplace';
import { appSelectors } from '../app';
import { identitySelectors } from '../identity';
import { getGlobalContext } from '../context';
import { push } from 'connected-react-router';
import config from 'common/config';
import { createAliasedAction } from 'electron-redux';
import _ from 'lodash';
import uuidv1 from 'uuid/v1';
import { Logger } from 'common/logger';
import {
	EMAIL_ATTRIBUTE,
	ENTITY_NAME_ATTRIBUTE,
	FIRST_NAME_ATTRIBUTE,
	LAST_NAME_ATTRIBUTE,
	ENTITY_TYPE_ATTRIBUTE
} from '../identity/constants';
import { APPLICATION_CANCELLED } from './status_codes';

export const RP_UPDATE_INTERVAL = 1000 * 60 * 60 * 3; // 3h
const log = new Logger('kyc-duck');
let hardwalletConfirmationTimeout = null;

export const initialState = {
	relyingParties: [],
	relyingPartiesByName: {},
	currentApplication: null,
	cancelRoute: '',
	applications: [],
	applicationsById: {},
	processing: false
};

export const kycTypes = {
	KYC_RP_LOAD: 'kyx/rp/load',
	KYC_RP_UPDATE: 'kyc/rp/update',
	KYC_RP_CLEAR: 'kyc/rp/clear',
	KYC_RP_LOAD_FOR_VENDORS: 'kyc/rp/vendors/load',
	KYC_RP_APPLICATION_ADD: 'kyc/rp/application/add',
	KYC_RP_APPLICATION_DELETE: 'kyc/rp/application/delete',
	KYC_RP_APPLICATION_CREATE: 'kyc/rp/application/create',
	KYC_RP_APPLICATION_CANCEL: 'kyc/rp/application/cancel',
	KYC_RP_APPLICATION_UPDATE: 'kyc/rp/application/update',
	KYC_RP_APPLICATION_PAYMENT_UPDATE: 'kyc/rp/application/payment/update',
	KYC_APPLICATION_CURRENT_START: 'kyc/application/current/start',
	KYC_APPLICATION_CURRENT_SET: 'kyc/application/current/set',
	KYC_APPLICATION_CANCEL_ROUTE_SET: 'kyc/application/cancel/route/set',
	KYC_APPLICATION_CURRENT_CLEAR: 'kyc/application/current/clear',
	KYC_APPLICATION_CURRENT_CANCEL: 'kyc/application/current/cancel',
	KYC_APPLICATION_CURRENT_SUBMIT: 'kyc/application/current/submit',
	KYC_APPLICATION_CURRENT_MEMBERS_SUBMIT: 'kyc/application/current/members/submit',
	KYC_RP_MEMBER_APPLICATION_CREATE: 'kyc/applications/current/members/create',
	KYC_APPLICATIONS_LOAD: 'kyc/applications/load',
	KYC_APPLICATIONS_SET: 'kyc/applications/set',
	KYC_APPLICATIONS_UPDATE: 'kyc/applications/update',
	KYC_APPLICATIONS_DELETE: 'kyc/applications/delete',
	KYC_APPLICATIONS_PROCESSING: 'kyc/applications/processing',
	KYC_APPLICATIONS_PROCESSING_SET: 'kyc/applications/set/processing',
	KYC_APPLICATIONS_RESET: 'kyc/applications/reset',
	KYC_APPLICATIONS_REFRESH: 'kyc/applications/refresh',
	KYC_ADD_ADDITIONAL_REQUIREMENTS: 'kyc/applications/requirements/add',
	KYC_UPLOAD_ADDITIONAL_FILES: 'kyc/applications/upload/files',
	KYC_APPLICATION_MESSAGE_SET: 'kyc/application/messages/set',
	KYC_APPLICATION_MESSAGE_CLEAR: 'kyc/application/messages/clear',
	KYC_POST_CHAT_MESSAGE: 'kyc/application/chat/post'
};

const devRPDetails = {
	name: 'Dev',
	status: config.kyccUrlOverride ? 'active' : 'inactive',
	description: 'Dev',
	relyingPartyConfig: {
		rootEndpoint: config.kyccUrlOverride,
		did: true,
		endpoints: {
			'/templates/:id': `${config.kyccUrlOverride}templates/:id?format=minimum`
		}
	}
};

export const kycSelectors = {
	kycSelector(state) {
		return state.kyc;
	},
	relyingPartiesSelector(state) {
		return this.kycSelector(state).relyingPartiesByName;
	},
	relyingPartySelector(state, rpName) {
		if (!rpName) return null;
		return this.kycSelector(state).relyingPartiesByName[rpName];
	},
	relyingPartyIsActiveSelector(state, rpName) {
		if (!rpName) return false;
		const rp = this.relyingPartySelector(state, rpName);
		if (rp && !rp.disabled) {
			return true;
		}
		let service = marketplaceSelectors.selectRPDetails(state, rpName);

		if (devRPDetails.status === 'active') {
			service = { ...devRPDetails };
		}

		const rpConfig = service.relyingPartyConfig;
		return service.status === 'active' && rpConfig;
	},
	relyingPartyShouldUpdateSelector(state, rpName, authenticate = true) {
		if (!this.relyingPartyIsActiveSelector(state, rpName)) return false;
		const rp = this.relyingPartySelector(state, rpName);
		if (!rp) return true;
		if (Date.now() - rp.lastUpdated > RP_UPDATE_INTERVAL) return true;
		// RP should update if current session is not authenticated
		// and we are asking for authenticated access
		if (authenticate) {
			if (!rp.authenticated) return true;
			if (!rp.session || !rp.session.ctx || !rp.session.ctx.token) return true;
			if (rp.session.ctx.token.data.exp > Date.now()) return true;
		}
		return false;
	},
	templatesSelector(state, rpName) {
		const rp = this.relyingPartySelector(state, rpName);
		if (!rp) return null;
		return rp.templates || [];
	},
	oneTemplateSelector(state, rpName, templateId) {
		const templates = this.templatesSelector(state, rpName);
		if (!templates) return null;
		return templates.find(tpl => tpl.id === templateId);
	},

	selectMemberRequirementsForTemplate(
		state,
		rpName,
		templateId,
		identityId = null,
		maxDepth = 3
	) {
		const template = this.oneTemplateSelector(state, rpName, templateId);
		const identity = identitySelectors.selectIdentity(
			state,
			identityId ? { identityId } : null
		);
		if (
			!identity ||
			identity.type !== 'corporate' ||
			!template ||
			!template.memberTemplates ||
			maxDepth <= 0
		) {
			return null;
		}

		let members =
			identitySelectors.selectChildrenIdentities(state, {
				identityId: identity.id
			}) || [];

		// select entity type for all members
		members = members.map(m => {
			const userData = this.selectKYCUserData(state, m.id);
			return { ...m, userData };
		});

		const mainUserData = this.selectKYCUserData(state, identity.id);
		const mainEntityType = mainUserData.entityType;

		const { memberTemplates } = template;

		const corporateDefaultTemplate = memberTemplates.find(
			m => m.isDefault && m.memberType === 'corporate' && m.template !== null
		);
		const individualDefaultTemplate = memberTemplates.find(
			m => m.isDefault && m.memberType === 'individual' && m.template !== null
		);
		const nonDefaultMemberTemplates = memberTemplates.filter(
			m => !m.isDefault && m.template !== null
		);

		// build kyc requirements tree for all members
		const requirements = members.reduce((acc, m) => {
			const { positions, equity } = m;
			const defaultTemplate =
				m.type === 'corporate' ? corporateDefaultTemplate : individualDefaultTemplate;
			const coveredPositions = positions.reduce((acc, curr) => {
				acc[curr] = false;
				return acc;
			}, {});

			const isTemplateMatched = (m, t, mainEntityType, coveredPositions = {}) => {
				const { positions, type } = m;
				const { memberType, template, legalEntityTypes = [], memberRoles = [] } = t || {};
				if (
					!t ||
					!template ||
					memberType !== type ||
					!legalEntityTypes.includes(mainEntityType)
				) {
					return false;
				}
				return positions.reduce((acc, curr) => {
					if (coveredPositions[curr]) return acc;
					const includes = memberRoles.includes((curr || '').replace(/-/, '_'));
					if (includes) {
						// track covered positions
						coveredPositions[curr] = true;
					}
					return includes || acc;
				}, false);
			};
			// match all possible member templates to current member
			const matchedTemplates = nonDefaultMemberTemplates.filter(t =>
				isTemplateMatched(m, t, mainEntityType, coveredPositions)
			);

			// try to assign default templates for positions not covered by non default templates
			const notCoveredPositions = positions
				.filter(p => !coveredPositions[p])
				.map(p => p.replace(/-/, '_'));
			if (
				defaultTemplate &&
				notCoveredPositions.length &&
				isTemplateMatched(m, defaultTemplate, mainEntityType, coveredPositions)
			) {
				matchedTemplates.push({ ...defaultTemplate, memberRoles: notCoveredPositions });
			}

			const seenTemplate = {};
			const uniqueMatchedTemplates = matchedTemplates.reduce((acc, curr) => {
				const { template, memberRoles } = curr;
				if (seenTemplate[template]) {
					seenTemplate[template].memberRoles = seenTemplate[template].memberRoles.concat(
						memberRoles
					);
					return acc;
				}
				const tplCopy = { ...curr, memberRoles: [...memberRoles] };
				seenTemplate[template] = tplCopy;
				acc.push(tplCopy);
				return acc;
			}, []);

			const buildMemberRequirementsForTemplate = (
				state,
				rpName,
				member,
				requirements,
				template,
				positions,
				equity
			) => {
				const selectedRequirements = this.selectRequirementsForTemplate(
					state,
					rpName,
					template.template,
					member.id
				);
				const memberRequirements =
					this.selectMemberRequirementsForTemplate(
						state,
						rpName,
						template.template,
						member.id,
						maxDepth - 1
					) || [];
				const memberTemplate = template;
				const requirementPositions = positions.reduce((acc, curr) => {
					if (template.memberRoles.includes((curr || '').replace(/-/, '_'))) {
						acc.push(curr);
					}
					return acc;
				}, []);
				return requirements.concat([
					{
						...member,
						requirements: selectedRequirements,
						memberTemplate,
						positions: requirementPositions,
						shares: equity,
						parentTemplate: templateId,
						uiId: `${identity.id}_${member.id}_${templateId}`
					},
					...memberRequirements
				]);
			};
			// fetch member requirements based on member templates
			let memberRequirements = uniqueMatchedTemplates.reduce(
				(acc, t) =>
					buildMemberRequirementsForTemplate(state, rpName, m, acc, t, positions, equity),
				[]
			);

			return acc.concat(memberRequirements);
		}, []);
		requirements.sort((a, b) => {
			if (a.parentId === null || a.id === b.parentId) return -1;
			if (b.parentId === null || b.id === a.parentId) return 1;
			return b.parentId - a.parentId;
		});
		return requirements;
	},
	selectMemberApplicationAttributes(state, rpName, templateId, selected) {
		const memberRequirements = kycSelectors.selectMemberRequirementsForTemplate(
			state,
			rpName,
			templateId
		);
		const selectedMemberRequirements = memberRequirements.map(m => ({
			...m,
			requirements: m.requirements.map(r => {
				const attributeName = m.uiId;
				const sel =
					!r.options || !r.options.length
						? null
						: selected[attributeName] || r.options[0];
				return {
					id: r.id,
					attributeId: sel ? sel.id : undefined,
					schemaId: r.schemaId,
					schema: r.schema || (r.type ? r.type.content : undefined),
					required: r.required,
					type: r.tType || 'individual'
				};
			})
		}));
		return selectedMemberRequirements;
	},
	selectRequirementsForTemplate(state, rpName, templateId, identityId) {
		const template = this.oneTemplateSelector(state, rpName, templateId);
		if (!template) {
			if (config.dev) {
				log.warn(
					`Unable to select template ${templateId} for ${rpName}, it's either loading or this template ID is not available in the instance`
				);
			}
			return null;
		}
		const templateAttributes = template.attributes || [];
		const attributesBySchema = templateAttributes.reduce((acc, curr) => {
			if (typeof curr === 'string') {
				curr = { schemaId: curr };
			}
			acc[curr.schemaId] = [];
			return acc;
		}, {});

		const identity = identitySelectors.selectIdentity(
			state,
			identityId ? { identityId } : null
		);

		const walletAttributes = identitySelectors
			.selectFullIdAttributesByIds(state, { identityId: identity.id })
			.reduce((acc, curr) => {
				if (!curr || !curr.type || !curr.type.url) return acc;
				if (!acc.hasOwnProperty(curr.type.url)) return acc;

				acc[curr.type.url].push(curr);
				return acc;
			}, attributesBySchema);

		const tplOccurrence = templateAttributes.reduce((acc, curr) => {
			const schemaId = curr.schemaId || curr;
			acc[schemaId] = (acc[curr.schemaId] || 0) + 1;
			return acc;
		}, {});

		const requirements = templateAttributes.map(tplAttr => {
			if (typeof tplAttr === 'string') {
				tplAttr = { schemaId: tplAttr };
			}
			return {
				uiId: tplAttr.id || uuidv1(),
				id: tplAttr.id,
				required: !!tplAttr.required,
				schemaId: tplAttr.schemaId,
				options: walletAttributes[tplAttr.schemaId],
				title: tplAttr.title,
				description: tplAttr.description,
				tType: tplAttr.type,
				type:
					walletAttributes[tplAttr.schemaId] && walletAttributes[tplAttr.schemaId].length
						? walletAttributes[tplAttr.schemaId][0].type
						: identitySelectors.selectIdAttributeTypeByUrl(state, {
								attributeTypeUrl: tplAttr.schemaId
						  }),
				duplicateType: tplOccurrence[tplAttr.schemaId] > 1
			};
		});

		return requirements;
	},

	selectKYCAttributes(state, identityId, attributes = []) {
		const kycAttributes = identitySelectors
			.selectFullIdAttributesByIds(state, {
				identityId,
				attributesIds: attributes.map(attr => attr.attributeId)
			})
			.reduce((acc, curr) => {
				acc[curr.id] = curr;
				return acc;
			}, {});

		return attributes.map(attr => {
			const { id, attributeId, schemaId, schema, required } = attr;
			const loadedAttr = kycAttributes[attributeId];
			const finalAttr = {
				id,
				schemaId,
				schema,
				required
			};
			if (loadedAttr) {
				finalAttr.data = { ...loadedAttr.data };
				finalAttr.documents = [...loadedAttr.documents];
			}
			return finalAttr;
		});
	},
	selectKYCUserData(state, identityId, kycAttributes = []) {
		const attributes = [
			EMAIL_ATTRIBUTE,
			FIRST_NAME_ATTRIBUTE,
			LAST_NAME_ATTRIBUTE,
			ENTITY_NAME_ATTRIBUTE,
			ENTITY_TYPE_ATTRIBUTE
		].map(url => {
			let attr = kycAttributes.find(attr => attr.schemaId === url);
			if (!attr) {
				attr = (identitySelectors.selectAttributesByUrl(state, {
					identityId,
					attributeTypeUrls: [url]
				}) || [])[0];
			}
			return {
				url,
				value: attr && attr.data ? attr.data.value : null
			};
		});

		const attrData = attributes.reduce((acc, curr) => {
			const { url, value } = curr;
			if (acc[url]) return acc;
			acc[url] = value;
			return acc;
		}, {});

		const data = {
			email: attrData[EMAIL_ATTRIBUTE],
			name: attrData[ENTITY_NAME_ATTRIBUTE],
			entityType: attrData[ENTITY_TYPE_ATTRIBUTE]
		};

		if (!data.name) {
			data.name = `${attrData[FIRST_NAME_ATTRIBUTE]} ${attrData[LAST_NAME_ATTRIBUTE]}`;
		}
		return data;
	},
	selectCurrentApplication(state) {
		return this.kycSelector(state).currentApplication;
	},
	selectCancelRoute(state) {
		return this.kycSelector(state).cancelRoute;
	},
	selectApplications(state) {
		return this.kycSelector(state).applications.map(
			id => this.kycSelector(state).applicationsById[id]
		);
	},
	selectProcessing(state) {
		return this.kycSelector(state).processing;
	},
	selectMessages(state) {
		return this.kycSelector(state).messages;
	}
};

export const kycActions = {
	updateRelyingParty(payload, error) {
		if (error) {
			payload = { ...payload, error: error.message };
			error = true;
		}
		return { type: kycTypes.KYC_RP_UPDATE, payload, error };
	},
	addKYCApplication(rpName, application) {
		return {
			type: kycTypes.KYC_RP_APPLICATION_ADD,
			payload: { name: rpName, application }
		};
	},
	deleteKYCApplication(rpName, applicationId) {
		return {
			type: kycTypes.KYC_RP_APPLICATION_DELETE,
			payload: { name: rpName, applicationId }
		};
	},
	setCancelRoute(route) {
		return {
			type: kycTypes.KYC_APPLICATION_CANCEL_ROUTE_SET,
			payload: route
		};
	},
	setCurrentApplication(
		relyingPartyName,
		templateId,
		returnRoute,
		cancelRoute,
		title,
		description,
		agreement,
		vendor,
		privacyPolicy,
		termsOfService,
		attributes = [],
		error
	) {
		return {
			type: kycTypes.KYC_APPLICATION_CURRENT_SET,
			payload: {
				relyingPartyName,
				templateId,
				returnRoute,
				cancelRoute,
				title,
				description,
				agreement,
				vendor,
				privacyPolicy,
				termsOfService,
				attributes,
				error
			}
		};
	},
	clearCurrentApplication() {
		return {
			type: kycTypes.KYC_APPLICATION_CURRENT_SET
		};
	},
	setApplicationsAction(applications) {
		return {
			type: kycTypes.KYC_APPLICATIONS_SET,
			payload: applications
		};
	},
	setProcessingAction(processing) {
		return {
			type: kycTypes.KYC_APPLICATIONS_PROCESSING,
			payload: processing
		};
	},
	setMessages(message) {
		return {
			type: kycTypes.KYC_APPLICATION_MESSAGE_SET,
			payload: message
		};
	},
	clearMessages() {
		return {
			type: kycTypes.KYC_APPLICATION_MESSAGE_CLEAR
		};
	}
};

/**
 * If loadInBackground is true, failure to load RP will not trigger an application UI error
 */
const getSession = async (config, authenticate, dispatch, walletType, loadInBackground = false) => {
	let mpService = (getGlobalContext() || {}).marketplaceService;
	let session;
	try {
		session = mpService.createRelyingPartySession(config);
	} catch (error) {
		log.error('getSession createRelyingPartySession %s', error);
		if (!loadInBackground) {
			throw error;
		}
	}

	if (authenticate) {
		try {
			if (walletType === 'ledger' || walletType === 'trezor') {
				const hardwalletConfirmationTime = '30000';
				hardwalletConfirmationTimeout = setTimeout(async () => {
					clearTimeout(hardwalletConfirmationTimeout);
					await dispatch(push('/main/hd-timeout'));
				}, hardwalletConfirmationTime);
				await dispatch(push('/main/hd-timer'));
			}
			await session.establish();
		} catch (error) {
			log.error('getSession HD %s', error);
			if (walletType === 'ledger' || walletType === 'trezor') {
				clearTimeout(hardwalletConfirmationTimeout);
				if (error.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
					await dispatch(push('/main/hd-declined'));
				} else if (error.code === 'Failure_ActionCancelled') {
					await dispatch(push('/main/hd-declined'));
				} else if (error.statusText === 'UNKNOWN_ERROR') {
					await dispatch(push('/main/hd-unlock'));
				} else {
					await dispatch(push('/main/hd-error'));
				}
			} else {
				if (!loadInBackground) {
					await dispatch(push('/main/auth-error'));
				}
			}
			if (!loadInBackground) {
				throw error;
			}
		}
	}
	return session;
};

/**
 * If loadInBackground is true, failure to load RP will not trigger an application UI error
 */
const loadRelyingPartyOperation = (
	rpName,
	authenticate = true,
	afterAuthRoute,
	cancelRoute,
	loadInBackground = false
) => async (dispatch, getState) => {
	const state = getState();
	const walletType = appSelectors.selectApp(state).walletType;
	if (!rpName) return null;

	const identity = identitySelectors.selectIdentity(state);
	if (!identity) return;

	const ts = Date.now();

	let rp = marketplaceSelectors.selectRPDetails(state, rpName);

	if (devRPDetails.status === 'active') {
		log.debug('Selecting dev RP');
		rp = { ...devRPDetails };
	}

	const config = rp.relyingPartyConfig;
	if (!config.rootEndpoint) {
		log.warn('Empty RP config object');
		return;
	}

	try {
		await dispatch(kycActions.setCancelRoute(cancelRoute));
		const session = await getSession(
			config,
			authenticate,
			dispatch,
			walletType,
			loadInBackground
		);
		let templates = await Promise.all(
			(await session.listKYCTemplates()).map(async tpl => {
				const id = tpl.id || tpl.templateId;
				tpl = await session.getKYCTemplate(id);
				tpl.id = id;
				return tpl;
			})
		);

		let applications = [];
		if (authenticate) {
			applications = await session.listKYCApplications();
			for (const application of applications) {
				application.messages = await session.getKYCApplicationChat(application.id);
				const formattedMessages = messageFilter(application.messages);
				const template = templates.find(t => t.id === application.template);
				await dispatch(
					kycOperations.updateApplicationsOperation({
						id: application.id,
						identityId: identity.id,
						rpName: rpName,
						currentStatus: application.currentStatus,
						currentStatusName: application.statusName,
						owner: application.owner,
						scope: application.scope,
						applicationDate: application.createdAt,
						title: template ? template.name : rpName,
						messages: formattedMessages
					})
				);
			}

			// Access Token only exists for existing KYCC users
			if (applications.length) session.access_token = await session.getAccessToken();
		}

		await dispatch(
			kycActions.updateRelyingParty({
				name: rpName,
				description: rp.description,
				templates,
				applications,
				session,
				authenticated: authenticate,
				lastUpdated: ts
			})
		);

		if (authenticate && afterAuthRoute) {
			if (walletType === 'ledger' || walletType === 'trezor') {
				clearTimeout(hardwalletConfirmationTimeout);
			}
			await dispatch(push(afterAuthRoute));
		}
	} catch (error) {
		log.error('Error loadRelyingParty %s', error);
		await dispatch(
			kycActions.updateRelyingParty(
				{
					name: rpName,
					lastUpdated: ts
				},
				error
			)
		);
	}
};

const loadRelyingPartiesForVendors = (
	vendors,
	afterAuthRoute,
	cancelRoute,
	inBackground = false,
	hasLoader = false
) => async (dispatch, getState) => {
	const authenticated = true;
	const state = getState();
	try {
		hasLoader && (await dispatch(kycActions.setProcessingAction(true)));
		vendors = vendors.filter(
			v =>
				!_.isEmpty(v.relyingPartyConfig) &&
				kycSelectors.relyingPartyShouldUpdateSelector(state, v.vendorId)
		);
		await Promise.all(
			vendors.map(async v => {
				try {
					await dispatch(
						kycOperations.loadRelyingParty(
							v.vendorId,
							authenticated,
							afterAuthRoute,
							cancelRoute,
							inBackground
						)
					);
				} catch (error) {
					log.error(error);
				}
			})
		);
	} catch (error) {
		log.error(error);
	} finally {
		hasLoader && (await dispatch(kycActions.setProcessingAction(false)));
	}
};

const postChatMessage = ({ rpName, application, message }) => async (dispatch, getState) => {
	const rp = kycSelectors.relyingPartySelector(getState(), rpName);
	if (!rp || !rp.session) throw new Error(`relying party ${rpName} does not exist`);

	if (!application || !application.id) {
		throw new Error('application does not exist');
	}
	/*
	if (!rp.templates.find(tpl => tpl.id === templateId)) {
		throw new Error('template does not exist');
	}
	*/
	const identity = identitySelectors.selectIdentity(getState());
	if (!identity) {
		return;
	}

	if (!rp.session.isActive()) {
		await rp.session.establish();
	}

	await rp.session.postKYCApplicationChat(application.id, message);
};

const createRelyingPartyKYCApplication = (rpName, templateId, attributes, title) => async (
	dispatch,
	getState
) => {
	try {
		const rp = kycSelectors.relyingPartySelector(getState(), rpName);
		if (!rp || !rp.session) throw new Error('relying party does not exist');
		if (!rp.templates.find(tpl => tpl.id === templateId)) {
			throw new Error('template does not exist');
		}

		const identity = identitySelectors.selectIdentity(getState());
		if (!identity) return;

		if (!rp.session.isActive()) {
			await rp.session.establish();
		}

		attributes = kycSelectors.selectKYCAttributes(getState(), identity.id, attributes);

		if (rp.session.ctx.hasKYCUserEndpoint() && !rp.session.ctx.user) {
			const userData = kycSelectors.selectKYCUserData(getState(), identity.id, attributes);
			await rp.session.createKYCUser(userData);
		}
		let application = await rp.session.createKYCApplication(templateId, attributes);
		application = await rp.session.getKYCApplication(application.id);
		await dispatch(kycActions.addKYCApplication(rpName, application));
		// application.messages = await rp.session.getKYCApplicationChat(application.id);
		application.messages = [];
		const formattedMessages = messageFilter(application.messages);
		await dispatch(
			kycOperations.updateApplicationsOperation({
				id: application.id,
				identityId: identity.id,
				rpName: rpName,
				currentStatus: application.currentStatus,
				currentStatusName: application.statusName,
				owner: application.owner,
				scope: application.scope,
				applicationDate: application.createdAt,
				title: title || rpName,
				messages: formattedMessages
			})
		);
		return application;
	} catch (error) {
		log.error('createKycApplication %s', error);
		throw error;
	}
};

const cancelRelyingPartyKYCApplication = (rpName, applicationId, note) => async (
	dispatch,
	getState
) => {
	const rp = kycSelectors.relyingPartySelector(getState(), rpName);
	if (!rp || !rp.session) throw new Error('relying party does not exist');

	if (!rp.session.isActive()) {
		await rp.session.establish();
	}

	try {
		await rp.session.updateKYCApplicationStatus(applicationId, APPLICATION_CANCELLED, note);
		await dispatch(kycActions.deleteKYCApplication(rpName, applicationId));
		await dispatch(kycOperations.deleteApplicationOperation(applicationId));
	} catch (error) {
		log.error(error);
		throw new Error('Could not cancel application %s', applicationId);
	}
};

const createMemberKYCApplication = (
	applicationId,
	identityId,
	rpName,
	templateId,
	attributes,
	positions,
	shares,
	title
) => async (dispatch, getState) => {
	const rp = kycSelectors.relyingPartySelector(getState(), rpName);
	if (!rp || !rp.session) throw new Error('relying party does not exist');
	if (!rp.templates.find(tpl => tpl.id === templateId)) {
		throw new Error('template does not exist');
	}
	const identity = identitySelectors.selectIdentity(getState(), { identityId });
	if (!identity) return;

	if (!rp.session.isActive()) {
		await rp.session.establish();
	}

	attributes = kycSelectors.selectKYCAttributes(getState(), identity.id, attributes);
	try {
		let application = await rp.session.createKYCMemberApplication(
			applicationId,
			positions,
			templateId,
			attributes,
			shares
		);
		application = await rp.session.getKYCApplication(application.id);
		// TODO: track member applications
		// await dispatch(kycActions.addKYCApplication(rpName, application, identity.id));

		// await dispatch(
		// 	kycOperations.updateApplicationsOperation({
		// 		id: application.id,
		// 		identityId: identity.id,
		// 		rpName: rpName,
		// 		currentStatus: application.currentStatus,
		// 		currentStatusName: application.statusName,
		// 		owner: application.owner,
		// 		scope: application.scope,
		// 		applicationDate: application.createdAt,
		// 		title: title || rpName
		// 	})
		// );
		return application;
	} catch (error) {
		log.error('createMemberKycApplication %s', error);
		throw error;
	}
};

const refreshRelyingPartyForKycApplication = (application, afterAuthRoute, cancelRoute) => async (
	dispatch,
	getState
) => {
	await dispatch(
		kycOperations.loadRelyingParty(application.rpName, true, afterAuthRoute, cancelRoute)
	);

	const rp = kycSelectors.relyingPartySelector(getState(), application.rpName);
	const kycApplication = rp.applications.find(app => app.id === application.id);
	await dispatch(
		kycOperations.updateApplicationsOperation({
			id: application.id,
			currentStatus: kycApplication.currentStatus,
			currentStatusName: kycApplication.statusName,
			updatedAt: kycApplication.updatedAt
		})
	);
};

const updateRelyingPartyKYCApplication = (
	rpName,
	templateId,
	applicationId,
	attributes = false,
	questions = false
) => async (dispatch, getState) => {
	const rp = kycSelectors.relyingPartySelector(getState(), rpName);
	if (!rp || !rp.session) throw new Error('relying party does not exist');
	if (!rp.templates.find(tpl => tpl.id === templateId)) {
		throw new Error('template does not exist');
	}

	const identity = identitySelectors.selectIdentity(getState());
	if (!identity) return;

	if (!rp.session.isActive()) {
		await rp.session.establish();
	}

	const updatedApplication = { id: applicationId, templateId };

	if (attributes) {
		attributes = kycSelectors.selectKYCAttributes(getState(), identity.id, attributes);
		updatedApplication.attributes = attributes;
	}
	if (questions) {
		updatedApplication.questions = questions;
	}

	try {
		let application = await rp.session.updateKYCApplication(updatedApplication);
		application = await rp.session.getKYCApplication(application.id);
		await dispatch(kycActions.addKYCApplication(rpName, application));

		application.messages = await rp.session.getKYCApplicationChat(application.id);
		const formattedMessages = messageFilter(application.messages);

		await dispatch(
			kycOperations.updateApplicationsOperation({
				id: application.id,
				identityId: identity.id,
				rpName: rpName,
				currentStatus: application.currentStatus,
				currentStatusName: application.statusName,
				owner: application.owner,
				scope: application.scope,
				applicationDate: application.createdAt,
				messages: formattedMessages
			})
		);
	} catch (error) {
		log.error('updatedKycApplication %s', error);
		throw error;
	}
};

const updateRelyingPartyKYCApplicationPayment = (rpName, applicationId, transactionHash) => async (
	dispatch,
	getState
) => {
	const rp = kycSelectors.relyingPartySelector(getState(), rpName);
	if (!rp || !rp.session) throw new Error('relying party does not exist');

	if (!rp.session.isActive()) {
		await rp.session.establish();
	}

	await rp.session.updateKYCApplicationPayment(applicationId, transactionHash);

	rp.applications = await rp.session.listKYCApplications();
	await dispatch(kycActions.updateRelyingParty(rp));
};

const addAdditionalTemplateRequirements = ({ rpName, application, attributes }) => async (
	dispatch,
	getState
) => {
	const rp = kycSelectors.relyingPartySelector(getState(), rpName);
	if (!rp || !rp.session) throw new Error('relying party does not exist');

	if (!application || !application.id) {
		throw new Error('application does not exist');
	}

	const identity = identitySelectors.selectIdentity(getState());
	if (!identity) return;

	if (!rp.session.isActive()) {
		await rp.session.establish();
	}

	await rp.session.addAdditionalTemplateRequirements(application.id, attributes);
};

const uploadAdditionalFiles = ({ rpName, application, files }) => async (dispatch, getState) => {
	const rp = kycSelectors.relyingPartySelector(getState(), rpName);
	if (!rp || !rp.session) throw new Error('relying party does not exist');

	if (!application || !application.id) {
		throw new Error('application does not exist');
	}

	const identity = identitySelectors.selectIdentity(getState());
	if (!identity) return;

	if (!rp.session.isActive()) {
		await rp.session.establish();
	}

	await rp.session.uploadAdditionalFiles(application.id, files);
};

const startCurrentApplicationOperation = (
	rpName,
	templateId,
	returnRoute,
	cancelRoute,
	title,
	description,
	agreement,
	vendor,
	privacyPolicy,
	termsOfService,
	userMessage
) => async (dispatch, getState) => {
	await dispatch(
		kycActions.setCurrentApplication(
			rpName,
			templateId,
			returnRoute,
			cancelRoute,
			title,
			description,
			agreement,
			vendor,
			privacyPolicy,
			termsOfService
		)
	);
	if (userMessage) {
		await dispatch(kycActions.setMessages(userMessage));
	}
	await dispatch(push(`/main/kyc/current-application/${rpName}`));
};

const submitCurrentApplicationOperation = selected => async (dispatch, getState) => {
	const state = getState();
	const currentApplication = kycSelectors.selectCurrentApplication(state);
	const {
		relyingPartyName,
		templateId,
		returnRoute,
		cancelRoute,
		title,
		description,
		agreement,
		vendor,
		privacyPolicy,
		termsOfService,
		attributes
	} = currentApplication;
	const identity = identitySelectors.selectIdentity(state);
	const requirements = kycSelectors.selectRequirementsForTemplate(
		state,
		relyingPartyName,
		templateId
	);

	const requiredAttributes = requirements.map(r => {
		const attributeName = `_${r.uiId}`;
		const sel =
			!r.options || !r.options.length ? null : selected[attributeName] || r.options[0];
		return {
			id: r.id,
			attributeId: sel ? sel.id : undefined,
			schemaId: r.schemaId,
			schema: r.schema || (r.type ? r.type.content : undefined),
			required: r.required,
			type: r.tType || 'individual'
		};
	});

	try {
		await dispatch(
			kycActions.setCurrentApplication(
				relyingPartyName,
				templateId,
				returnRoute,
				cancelRoute,
				title,
				description,
				agreement,
				vendor,
				privacyPolicy,
				termsOfService,
				attributes
			)
		);
		const application = await dispatch(
			kycOperations.createRelyingPartyKYCApplication(
				relyingPartyName,
				templateId,
				requiredAttributes,
				title
			)
		);

		try {
			if (identity.type === 'corporate') {
				await dispatch(
					kycOperations.submitCurrentApplicationMembers(
						selected,
						application,
						identity.id
					)
				);
			}
		} catch (error) {
			log.error('failed to submit member applications %s', error);
			// TODO: kycc internal api does not support status changes
			// await dispatch(
			// 	kycOperations.cancelRelyingPartyKYCApplication(
			// 		relyingPartyName,
			// 		application.id,
			// 		'Member submission error'
			// 	)
			// );
			throw new Error('Failed to submit member applications');
		}

		await dispatch(push(currentApplication.returnRoute));

		return application;
	} catch (error) {
		let applicationError = error;
		if (error.error) {
			applicationError = error.error;
		}
		log.error('submit application error %2j', applicationError);
		await dispatch(
			kycActions.setCurrentApplication(
				relyingPartyName,
				templateId,
				returnRoute,
				cancelRoute,
				title,
				description,
				agreement,
				vendor,
				privacyPolicy,
				termsOfService,
				attributes,
				applicationError
			)
		);
	} finally {
		if (kycSelectors.relyingPartyShouldUpdateSelector(state, relyingPartyName)) {
			await dispatch(kycOperations.loadRelyingParty(relyingPartyName));
		}
	}
};

const _submitOneMemberApplication = async (
	dispatch,
	title,
	currentMember,
	parentApplicationId,
	parentIdentityId,
	relyingPartyName,
	membersByParentId
) => {
	const currMemberTemplate = currentMember.memberTemplate.template;
	const members = membersByParentId[`${currMemberTemplate}-${currentMember.id}`];

	const application = await dispatch(
		kycOperations.createMemberKYCApplication(
			parentApplicationId,
			currentMember.id,
			relyingPartyName,
			currentMember.memberTemplate.template,
			currentMember.requirements,
			currentMember.positions,
			currentMember.shares,
			title || relyingPartyName
		)
	);

	if (!members) return;

	await Promise.all(
		members.map(member =>
			_submitOneMemberApplication(
				dispatch,
				title,
				member,
				application.id,
				parentIdentityId,
				relyingPartyName,
				membersByParentId
			)
		)
	);
};

const submitCurrentApplicationMembers = (selected, parentApplication, mainIdentityId) => async (
	dispatch,
	getState
) => {
	const state = getState();
	const currentApplication = kycSelectors.selectCurrentApplication(state);
	const { relyingPartyName, templateId, title } = currentApplication;
	const memberRequirements = kycSelectors.selectMemberApplicationAttributes(
		state,
		relyingPartyName,
		templateId,
		selected
	);
	const membersByParent = memberRequirements.reduce((acc, curr) => {
		let key = `${curr.parentTemplate}-${curr.parentId}`;
		acc[key] = acc[key] || [];
		acc[key].push(curr);
		return acc;
	}, {});
	const currMembers = membersByParent[`${templateId}-${mainIdentityId}`];

	if (!currMembers) {
		return;
	}
	await Promise.all(
		currMembers.map(member =>
			_submitOneMemberApplication(
				dispatch,
				title,
				member,
				parentApplication.id,
				mainIdentityId,
				relyingPartyName,
				membersByParent
			)
		)
	);
};

const cancelCurrentApplicationOperation = () => async (dispatch, getState) => {
	const currentApplication = kycSelectors.selectCurrentApplication(getState());
	dispatch(push(currentApplication.cancelRoute));
	await dispatch(kycActions.clearCurrentApplication());
};

const clearRelyingPartyOperation = () => async dispatch => {
	await dispatch(kycActions.updateRelyingParty({}));
};

const loadApplicationsOperation = (hasLoader = false) => async (dispatch, getState) => {
	const identity = identitySelectors.selectIdentity(getState());
	let kycApplicationService = getGlobalContext().kycApplicationService;
	try {
		hasLoader && (await dispatch(kycActions.setProcessingAction(true)));

		let applications = await kycApplicationService.load(identity.id);
		let sortedApplications = applications.sort((d1, d2) => {
			d1 = d1.createdAt ? new Date(d1.createdAt).getTime() : 0;
			d2 = d2.createdAt ? new Date(d2.createdAt).getTime() : 0;
			return d2 - d1; // descending order
		});
		await dispatch(kycActions.setApplicationsAction(sortedApplications));
	} catch (error) {
		log.error(error);
	} finally {
		hasLoader && (await dispatch(kycActions.setProcessingAction(false)));
	}
};

const updateApplicationsOperation = application => async (dispatch, getState) => {
	let kycApplicationService = getGlobalContext().kycApplicationService;
	await kycApplicationService.addEntry(application);
	await dispatch(kycOperations.loadApplicationsOperation());
};

const deleteApplicationOperation = applicationId => async (dispatch, getState) => {
	let kycApplicationService = getGlobalContext().kycApplicationService;
	await kycApplicationService.deleteEntryById(applicationId);
	await dispatch(kycOperations.loadApplicationsOperation());
};

const setProcessingOperation = processing => async dispatch => {
	await dispatch(kycActions.setProcessingAction(processing));
};

const resetApplicationsOperation = () => async dispatch => {
	await dispatch(kycActions.setProcessingAction(false));
	await dispatch(kycActions.setApplicationsAction([]));
};

export const kycOperations = {
	...kycActions,
	loadRelyingParty: createAliasedAction(kycTypes.KYC_RP_LOAD, loadRelyingPartyOperation),
	createRelyingPartyKYCApplication: createAliasedAction(
		kycTypes.KYC_RP_APPLICATION_CREATE,
		createRelyingPartyKYCApplication
	),
	cancelRelyingPartyKYCApplication: createAliasedAction(
		kycTypes.KYC_RP_APPLICATION_CANCEL,
		cancelRelyingPartyKYCApplication
	),
	createMemberKYCApplication: createAliasedAction(
		kycTypes.KYC_RP_MEMBER_APPLICATION_CREATE,
		createMemberKYCApplication
	),
	updateRelyingPartyKYCApplication: createAliasedAction(
		kycTypes.KYC_RP_APPLICATION_UPDATE,
		updateRelyingPartyKYCApplication
	),
	updateRelyingPartyKYCApplicationPayment: createAliasedAction(
		kycTypes.KYC_RP_APPLICATION_PAYMENT_UPDATE,
		updateRelyingPartyKYCApplicationPayment
	),
	cancelCurrentApplicationOperation: createAliasedAction(
		kycTypes.KYC_APPLICATION_CURRENT_CANCEL,
		cancelCurrentApplicationOperation
	),
	startCurrentApplicationOperation: createAliasedAction(
		kycTypes.KYC_APPLICATION_CURRENT_START,
		startCurrentApplicationOperation
	),
	submitCurrentApplicationOperation: createAliasedAction(
		kycTypes.KYC_APPLICATION_CURRENT_SUBMIT,
		submitCurrentApplicationOperation
	),
	submitCurrentApplicationMembers: createAliasedAction(
		kycTypes.KYC_APPLICATION_CURRENT_MEMBERS_SUBMIT,
		submitCurrentApplicationMembers
	),
	clearRelyingPartyOperation: createAliasedAction(
		kycTypes.KYC_RP_CLEAR,
		clearRelyingPartyOperation
	),
	loadApplicationsOperation: createAliasedAction(
		kycTypes.KYC_APPLICATIONS_LOAD,
		loadApplicationsOperation
	),
	updateApplicationsOperation: createAliasedAction(
		kycTypes.KYC_APPLICATIONS_UPDATE,
		updateApplicationsOperation
	),
	deleteApplicationOperation: createAliasedAction(
		kycTypes.KYC_APPLICATIONS_DELETE,
		deleteApplicationOperation
	),
	setProcessing: createAliasedAction(
		kycTypes.KYC_APPLICATIONS_PROCESSING_SET,
		setProcessingOperation
	),
	resetApplications: createAliasedAction(
		kycTypes.KYC_APPLICATIONS_RESET,
		resetApplicationsOperation
	),
	refreshRelyingPartyForKycApplication: createAliasedAction(
		kycTypes.KYC_APPLICATIONS_REFRESH,
		refreshRelyingPartyForKycApplication
	),
	loadRelyingPartiesForVendors: createAliasedAction(
		kycTypes.KYC_RP_LOAD_FOR_VENDORS,
		loadRelyingPartiesForVendors
	),
	addAdditionalTemplateRequirements: createAliasedAction(
		kycTypes.KYC_ADD_ADDITIONAL_REQUIREMENTS,
		addAdditionalTemplateRequirements
	),
	uploadAdditionalFiles: createAliasedAction(
		kycTypes.KYC_UPLOAD_ADDITIONAL_FILES,
		uploadAdditionalFiles
	),
	postKYCApplicationChat: createAliasedAction(kycTypes.KYC_POST_CHAT_MESSAGE, postChatMessage)
};

export const operations = {
	loadApplicationsOperation,
	updateApplicationsOperation
};

export const updateRelyingPartyReducer = (state, { error, payload }) => {
	if (Object.entries(payload).length === 0 && payload.constructor === Object) {
		return { ...state, relyingPartiesByName: {}, relyingParties: [] };
	}
	let relyingParties = [...state.relyingParties];
	let relyingPartiesByName = { ...state.relyingPartiesByName };
	if (!relyingPartiesByName[payload.name]) {
		relyingParties.push(payload.name);
	}
	relyingPartiesByName[payload.name] = { ...payload, error };
	return { ...state, relyingPartiesByName, relyingParties };
};

export const addKYCApplicationReducer = (state, { payload }) => {
	let rp = state.relyingPartiesByName[payload.name];
	rp = { ...rp, applications: [...rp.applications, payload.application] };
	return { ...state, relyingPartiesByName: { ...state.relyingPartiesByName, [rp.name]: rp } };
};

export const deleteKYCApplicationReducer = (state, { payload }) => {
	let rp = state.relyingPartiesByName[payload.name];
	rp = {
		...rp,
		applications: (rp.applications || []).filter(a => a.id !== payload.applicationId)
	};
	return { ...state, relyingPartiesByName: { ...state.relyingPartiesByName, [rp.name]: rp } };
};

export const setCurrentApplicationReducer = (state, { payload }) => {
	let currentApplication = { ...payload };
	return { ...state, currentApplication };
};

export const clearCurrentApplicationReducer = state => {
	return { ...state, currentApplication: null };
};

export const setMessagesReducer = (state, { payload }) => {
	let messages = payload;
	return { ...state, messages };
};

export const clearMessagesReducer = state => {
	return { ...state, messages: null };
};

export const setCancelRoute = (state, { payload }) => {
	return { ...state, cancelRoute: payload };
};

export const setApplicationsReducer = (state, { payload }) => {
	let applications = payload || [];
	let applicationsById = applications.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	applications = _.uniq(applications.map(app => app.id));
	return { ...state, applications, applicationsById };
};

export const setProcessingReducer = (state, { payload }) => {
	return { ...state, processing: payload };
};

export const reducers = {
	updateRelyingPartyReducer,
	addKYCApplicationReducer,
	deleteKYCApplicationReducer,
	setCurrentApplicationReducer,
	clearCurrentApplicationReducer,
	setMessagesReducer,
	clearMessagesReducer,
	setCancelRoute,
	setApplicationsReducer,
	setProcessingReducer
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case kycTypes.KYC_RP_UPDATE:
			return reducers.updateRelyingPartyReducer(state, action);
		case kycTypes.KYC_RP_APPLICATION_ADD:
			return reducers.addKYCApplicationReducer(state, action);
		case kycTypes.KYC_RP_APPLICATION_DELETE:
			return reducers.deleteKYCApplicationReducer(state, action);
		case kycTypes.KYC_APPLICATION_CURRENT_SET:
			return reducers.setCurrentApplicationReducer(state, action);
		case kycTypes.KYC_APPLICATION_CURRENT_CLEAR:
			return reducers.clearCurrentApplicationReducer(state, action);
		case kycTypes.KYC_APPLICATION_CANCEL_ROUTE_SET:
			return reducers.setCancelRoute(state, action);
		case kycTypes.KYC_APPLICATIONS_SET:
			return reducers.setApplicationsReducer(state, action);
		case kycTypes.KYC_APPLICATIONS_PROCESSING:
			return reducers.setProcessingReducer(state, action);
		case kycTypes.KYC_APPLICATION_MESSAGE_SET:
			return reducers.setMessagesReducer(state, action);
		case kycTypes.KYC_APPLICATION_MESSAGE_CLEAR:
			return reducers.createMessagesReducer(state, action);
	}
	return state;
};

export const messageFilter = (messages = []) => {
	let result = [];
	for (let m of messages) {
		let fm = {};
		fm.id = m.id;
		m.user.name ? (fm.name = m.user.name) : (fm.name = 'Certifier');
		m.roles === undefined || m.roles.length === 0
			? (fm.type = 'person')
			: (fm.type = 'certifier');
		fm.date = parseInt((new Date(m.createdAt).getTime() / 1000).toFixed(0));
		fm.message = m.message;
		result.push(fm);
	}
	return result;
};

export default reducer;

export const testExports = { operations };
