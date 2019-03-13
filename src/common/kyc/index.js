import * as serviceSelectors from '../exchanges/selectors';
import * as walletSelectors from '../wallet/selectors';
import { appSelectors } from '../app';
import { identitySelectors } from '../identity';
import { getGlobalContext } from '../context';
import { push } from 'connected-react-router';
import config from 'common/config';
import { createAliasedAction } from 'electron-redux';
import uuidv1 from 'uuid/v1';
import { Logger } from 'common/logger';

export const RP_UPDATE_INTERVAL = 1000 * 60 * 60 * 3; // 3h
const log = new Logger('kyc-duck');
let hardwalletConfirmationTimeout = null;

export const initialState = {
	relyingParties: [],
	relyingPartiesByName: {},
	currentApplication: null,
	cancelRoute: ''
};

export const kycTypes = {
	KYC_RP_LOAD: 'kyx/rp/load',
	KYC_RP_UPDATE: 'kyc/rp/update',
	KYC_RP_CLEAR: 'kyc/rp/clear',
	KYC_RP_APPLICATION_ADD: 'kyc/rp/application/add',
	KYC_RP_APPLICATION_CREATE: 'kyc/rp/application/create',
	KYC_RP_APPLICATION_PAYMENT_UPDATE: 'kyc/rp/application/payment/update',
	KYC_APPLICATION_CURRENT_START: 'kyc/application/current/start',
	KYC_APPLICATION_CURRENT_SET: 'kyc/application/current/set',
	KYC_APPLICATION_CANCEL_ROUTE_SET: 'kyc/application/cancel/route/set',
	KYC_APPLICATION_CURRENT_CLEAR: 'kyc/application/current/clear',
	KYC_APPLICATION_CURRENT_CENCEL: 'kyc/application/current/cancel',
	KYC_APPLICATION_CURRENT_SUBMIT: 'kyc/application/current/submit'
};

const incorporationsRPDetails = {
	name: 'Incorporations',
	status: 'Active',
	description: 'Incorporations',
	relying_party_config: {
		rootEndpoint: config.incorporationsInstance,
		endpoints: {
			'/templates/:id': `${config.incorporationsInstance}templates/:id?format=minimum`
		}
	}
};

export const kycSelectors = {
	kycSelector(state) {
		return state.kyc;
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
		let service;
		if (rpName === 'incorporations') {
			service = { ...incorporationsRPDetails };
		} else {
			service = serviceSelectors.getServiceDetails(state, rpName);
		}

		const rpConfig = service.relying_party_config;

		return service.status === 'Active' && rpConfig;
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

	selectRequirementsForTemplate(state, rpName, templateId) {
		const template = this.oneTemplateSelector(state, rpName, templateId);
		if (!template) return null;
		const templateAttributes = template.attributes || [];
		const attributesBySchema = templateAttributes.reduce((acc, curr) => {
			if (typeof curr === 'string') {
				curr = { schemaId: curr };
			}
			acc[curr.schemaId] = [];
			return acc;
		}, {});
		const wallet = walletSelectors.getWallet(state);
		const walletAttributes = identitySelectors
			.selectFullIdAttributesByIds(state, wallet.id)
			.reduce((acc, curr) => {
				if (!curr || !curr.type || !curr.type.url) return acc;
				if (!acc.hasOwnProperty(curr.type.url)) return acc;

				acc[curr.type.url].push(curr);
				return acc;
			}, attributesBySchema);

		return templateAttributes.map(tplAttr => {
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
						: identitySelectors.selectIdAttributeTypeByUrl(state, tplAttr.schemaId)
			};
		});
	},
	selectKYCAttributes(state, walletId, attributes = []) {
		const kycAttributes = identitySelectors
			.selectFullIdAttributesByIds(state, walletId, attributes.map(attr => attr.attributeId))
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
	selectCurrentApplication(state) {
		return this.kycSelector(state).currentApplication;
	},
	selectCancelRoute(state) {
		return this.kycSelector(state).cancelRoute;
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
				attributes,
				error
			}
		};
	},
	clearCurrentApplication() {
		return {
			type: kycTypes.KYC_APPLICATION_CURRENT_SET
		};
	}
};

const getSession = async (config, authenticate, dispatch, hardwareWalletType) => {
	let mpService = (getGlobalContext() || {}).marketplaceService;
	let session;
	try {
		session = mpService.createRelyingPartySession(config);
	} catch (error) {
		log.error('getSession createRelyingPartySession %s', error);
		throw error;
	}

	if (authenticate) {
		try {
			if (hardwareWalletType !== '') {
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
			if (hardwareWalletType !== '') {
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
				await dispatch(push('/main/auth-error'));
			}
			throw error;
		}
	}
	return session;
};

const loadRelyingPartyOperation = (
	rpName,
	authenticate = true,
	afterAuthRoute,
	cancelRoute
) => async (dispatch, getState) => {
	const hardwareWalletType = appSelectors.selectApp(getState()).hardwareWalletType;
	if (!rpName) return null;

	const ts = Date.now();
	let rp;
	if (rpName === 'incorporations') {
		rp = { ...incorporationsRPDetails };
	} else {
		rp = serviceSelectors.getServiceDetails(getState(), rpName);
	}
	const config = rp.relying_party_config;

	try {
		await dispatch(kycActions.setCancelRoute(cancelRoute));
		const session = await getSession(config, authenticate, dispatch, hardwareWalletType);

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
			if (hardwareWalletType !== '') {
				clearTimeout(hardwalletConfirmationTimeout);
			}
			await dispatch(push(afterAuthRoute));
		}
	} catch (error) {
		log.error('loadRelyingParty %s', error);
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

const createRelyingPartyKYCApplication = (rpName, templateId, attributes) => async (
	dispatch,
	getState
) => {
	const rp = kycSelectors.relyingPartySelector(getState(), rpName);
	if (!rp || !rp.session) throw new Error('relying party does not exist');
	if (!rp.templates.find(tpl => tpl.id === templateId)) {
		throw new Error('template does not exist');
	}

	const wallet = walletSelectors.getWallet(getState());
	if (!wallet) return;

	if (!rp.session.isActive()) {
		await rp.session.establish();
	}

	attributes = kycSelectors.selectKYCAttributes(getState(), wallet.id, attributes);
	try {
		const application = await rp.session.createKYCApplication(templateId, attributes);
		await dispatch(kycActions.addKYCApplication(rpName, application));
	} catch (error) {
		log.error('createKycApplication %s', error);
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

const startCurrentApplicationOperation = (
	rpName,
	templateId,
	returnRoute,
	cancelRoute,
	title,
	description,
	agreement
) => async (dispatch, getState) => {
	await dispatch(
		kycActions.setCurrentApplication(
			rpName,
			templateId,
			returnRoute,
			cancelRoute,
			title,
			description,
			agreement
		)
	);
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
		attributes
	} = currentApplication;
	const requirements = kycSelectors.selectRequirementsForTemplate(
		state,
		relyingPartyName,
		templateId
	);
	const requiredAttributes = requirements.map(r => {
		const sel = !r.options || !r.options.length ? null : selected[r.uiId] || r.options[0];
		return {
			id: r.id,
			attributeId: sel ? sel.id : undefined,
			schemaId: r.schemaId,
			schema: r.schema || r.type ? r.type.content : undefined,
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
				attributes
			)
		);
		await dispatch(
			kycOperations.createRelyingPartyKYCApplication(
				relyingPartyName,
				templateId,
				requiredAttributes
			)
		);
		await dispatch(push(currentApplication.returnRoute));
	} catch (error) {
		let applicationError = error;
		if (error.error) {
			applicationError = error.error;
		}
		await dispatch(
			kycActions.setCurrentApplication(
				relyingPartyName,
				templateId,
				returnRoute,
				cancelRoute,
				title,
				description,
				agreement,
				attributes,
				applicationError
			)
		);
	}

	if (kycSelectors.relyingPartyShouldUpdateSelector(state, relyingPartyName)) {
		await dispatch(kycOperations.loadRelyingParty(relyingPartyName));
	}
};

const cancelCurrentApplicationOperation = () => async (dispatch, getState) => {
	const currentApplication = kycSelectors.selectCurrentApplication(getState());
	dispatch(push(currentApplication.cancelRoute));
	await dispatch(kycActions.clearCurrentApplication());
};

const clearRelyingPartyOperation = () => async dispatch => {
	await dispatch(kycActions.updateRelyingParty({}));
};

export const kycOperations = {
	...kycActions,
	loadRelyingParty: createAliasedAction(kycTypes.KYC_RP_LOAD, loadRelyingPartyOperation),
	createRelyingPartyKYCApplication: createAliasedAction(
		kycTypes.KYC_RP_APPLICATION_CREATE,
		createRelyingPartyKYCApplication
	),
	updateRelyingPartyKYCApplicationPayment: createAliasedAction(
		kycTypes.KYC_RP_APPLICATION_PAYMENT_UPDATE,
		updateRelyingPartyKYCApplicationPayment
	),
	cancelCurrentApplicationOperation: createAliasedAction(
		kycTypes.KYC_APPLICATION_CURRENT_CENCEL,
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
	clearRelyingPartyOperation: createAliasedAction(
		kycTypes.KYC_RP_CLEAR,
		clearRelyingPartyOperation
	)
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

export const setCurrentApplicationReducer = (state, { payload }) => {
	let currentApplication = { ...payload };
	return { ...state, currentApplication };
};

export const clearCurrentApplicationReducer = state => {
	return { ...state, currentApplication: null };
};

export const setCancelRoute = (state, { payload }) => {
	return { ...state, cancelRoute: payload };
};

export const reducers = {
	updateRelyingPartyReducer,
	addKYCApplicationReducer,
	setCurrentApplicationReducer,
	clearCurrentApplicationReducer,
	setCancelRoute
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case kycTypes.KYC_RP_UPDATE:
			return reducers.updateRelyingPartyReducer(state, action);
		case kycTypes.KYC_RP_APPLICATION_ADD:
			return reducers.addKYCApplicationReducer(state, action);
		case kycTypes.KYC_APPLICATION_CURRENT_SET:
			return reducers.setCurrentApplicationReducer(state, action);
		case kycTypes.KYC_APPLICATION_CURRENT_CLEAR:
			return reducers.clearCurrentApplicationReducer(state, action);
		case kycTypes.KYC_APPLICATION_CANCEL_ROUTE_SET:
			return reducers.setCancelRoute(state, action);
	}
	return state;
};

export default reducer;
