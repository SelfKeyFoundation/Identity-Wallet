import * as serviceSelectors from '../exchanges/selectors';
import * as walletSelectors from '../wallet/selectors';
import { identitySelectors } from '../identity';
import { getGlobalContext } from '../context';
import { push } from 'connected-react-router';
import { createAliasedAction } from 'electron-redux';

export const RP_UPDATE_INTERVAL = 1000 * 60 * 60 * 3; // 3h

export const initialState = {
	relyingParties: [],
	relyingPartiesByName: {},
	currentApplication: null
};

export const kycTypes = {
	KYC_RP_LOAD: 'kyx/rp/load',
	KYC_RP_UPDATE: 'kyc/rp/update',
	KYC_RP_APPLICATION_ADD: 'kyc/rp/application/add',
	KYC_RP_APPLICATION_CREATE: 'kyc/rp/application/create',
	KYC_RP_APPLICATION_PAYMENT_UPDATE: 'kyc/rp/application/payment/update',
	KYC_APPLICATION_CURRENT_START: 'kyc/application/current/start',
	KYC_APPLICATION_CURRENT_SET: 'kyc/application/current/set',
	KYC_APPLICATION_CURRENT_CLEAR: 'kyc/application/current/clear',
	KYC_APPLICATION_CURRENT_CENCEL: 'kyc/application/current/cancel',
	KYC_APPLICATION_CURRENT_SUBMIT: 'kyc/application/current/submit'
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
		const service = serviceSelectors.getServiceDetails(state, rpName);
		const config = service.relying_party_config;

		return service.status === 'Active' && config;
	},
	relyingPartyShouldUpdateSelector(state, rpName) {
		if (!this.relyingPartyIsActiveSelector(state, rpName)) return false;
		const rp = this.relyingPartySelector(state, rpName);
		if (!rp) return true;
		if (Date.now() - rp.lastUpdated > RP_UPDATE_INTERVAL) return true;
		if (!rp.session || !rp.session.ctx || !rp.session.ctx.token) return true;
		if (rp.session.ctx.token.data.exp > Date.now()) return true;

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
		const attributesBySchema = template.identity_attributes.reduce((acc, curr) => {
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

		return template.identity_attributes.map(tplAttr => {
			if (typeof tplAttr === 'string') {
				tplAttr = { schemaId: tplAttr };
			}
			return {
				id: tplAttr.id,
				schemaId: tplAttr.schemaId,
				options: walletAttributes[tplAttr.schemaId],
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
	setCurrentApplication(relyingPartyName, templateId, returnRoute) {
		return {
			type: kycTypes.KYC_APPLICATION_CURRENT_SET,
			payload: { relyingPartyName, templateId, returnRoute }
		};
	},
	clearCurrentApplication() {
		return {
			type: kycTypes.KYC_APPLICATION_CURRENT_SET
		};
	}
};

const loadRelyingPartyOperation = rpName => async (dispatch, getState) => {
	let mpService = (getGlobalContext() || {}).marketplaceService;
	const ts = Date.now();
	const rp = serviceSelectors.getServiceDetails(getState(), rpName);
	const config = rp.relying_party_config;

	try {
		const session = mpService.createRelyingPartySession(config);
		await session.establish();

		const templates = await Promise.all(
			(await session.listKYCTemplates()).map(tpl => session.getKYCTemplate(tpl.id))
		);

		const applications = await session.listKYCApplications();
		await dispatch(
			kycActions.updateRelyingParty({
				name: rpName,
				templates,
				applications,
				session,
				lastUpdated: ts
			})
		);
	} catch (error) {
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
	if (!rp.templates[templateId]) throw new Error('template does not exist');

	const wallet = walletSelectors.getWallet(getState());
	if (!wallet) return;

	if (!rp.session.isActive()) {
		await rp.session.establish();
	}

	attributes = kycSelectors.selectKYCAttributes(getState(), wallet.id, attributes);
	const application = await rp.session.createKYCApplication(templateId, attributes);
	await dispatch(kycActions.addKYCApplication(rpName, application));
};

const updateRelyingPartyKYCApplicationPayment = (rpName, applicationId, transactionHash) => async (
	dispatch,
	getState
) => {
	const rp = kycSelectors.relyingPartySelector(getState(), rpName);
	if (!rp || !rp.session) throw new Error('relying party does not exist');
	if (!rp.applications[applicationId]) throw new Error('application does not exist');

	if (!rp.session.isActive()) {
		await rp.session.establish();
	}

	await rp.session.updateRelyingPartyKYCApplicationPayment(applicationId, transactionHash);

	rp.applications = await rp.session.listKYCApplications();

	await dispatch(kycActions.updateRelyingParty(rp));
};

const startCurrentApplicationOperation = (rpName, templateId, returnRoute) => async (
	dispatch,
	getState
) => {
	await dispatch(kycActions.setCurrentApplication(rpName, templateId, returnRoute));
	await dispatch(push('/main/kyc/current-application'));
};

const cancelCurrentApplicationOperation = () => async (dispatch, getState) => {
	const currentApplication = kycSelectors.selectCurrentApplication(getState());
	dispatch(kycActions.clearCurrentApplication());
	await dispatch(push(currentApplication.returnRoute));
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
	)
};

export const updateRelyingPartyReducer = (state, { error, payload }) => {
	let relyingParties = [state.relyingParties];
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

export const reducers = {
	updateRelyingPartyReducer,
	addKYCApplicationReducer,
	setCurrentApplicationReducer,
	clearCurrentApplicationReducer
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
	}
	return state;
};

export default reducer;
