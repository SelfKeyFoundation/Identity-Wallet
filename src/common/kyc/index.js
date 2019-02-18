import * as serviceSelectors from '../exchanges/selectors';
import * as walletSelectors from '../wallet/selectors';
import { identitySelectors } from '../identity';
import { getGlobalContext } from '../context';
import { createAliasedAction } from 'electron-redux';

export const RP_UPDATE_INTERVAL = 1000 * 60 * 60 * 3; // 3h

export const initialState = {
	relyingParties: [],
	relyingPartiesByName: {}
};

export const kycTypes = {
	KYC_RP_LOAD: 'kyx/rp/load',
	KYC_RP_UPDATE: 'kyc/rp/update',
	KYC_RP_APPLICATION_ADD: 'kyc/rp/application/add',
	KYC_RP_APPLICATION_CREATE: 'kyc/rp/application/create',
	KYC_RP_APPLICATION_PAYMENT_UPDATE: 'kyc/rp/application/payment/update'
};

export const kycSelectors = {
	kycSelector(state) {
		return state.kyc;
	},
	relyingPartySelector(state, rpName) {
		return this.kycSelector(state).relyingPartiesByName[rpName];
	},
	relyingPartyIsActiveSelector(state, rpName) {
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
	selectAttributesForTemplate(state, rpName, templateId) {
		const template = this.selectAttributesForTemplate(state, rpName, templateId);
		const attributesBySchema = template.identity_atrributes.reduce((acc, curr) => {
			if (typeof curr === 'string') {
				curr = { schemaId: curr };
			}
			acc[curr.schemaId] = [];
			return acc;
		}, {});
		const wallet = walletSelectors.getWallet(state);
		const walletAttributes = this.selectFullIdAttributesByIds(state, wallet.id).reduce(
			(acc, curr) => {
				if (!acc.hasOwnProperty(curr.type.url)) {
					return acc;
				}
				acc[curr.type.url].push(curr);
				return acc;
			},
			attributesBySchema
		);

		return template.identity_atrributes.map(tplAttr => ({
			id: tplAttr.id,
			schemaId: tplAttr.schemaId,
			options: walletAttributes[tplAttr.schemaId]
		}));
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
	}
};

export const loadRelyingPartyOperation = rpName => async (dispatch, getState) => {
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

export const createRelyingPartyKYCApplication = (rpName, templateId, attributes) => async (
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

export const updateRelyingPartyKYCApplicationPayment = (
	rpName,
	applicationId,
	transactionHash
) => async (dispatch, getState) => {
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

export const reducers = {
	updateRelyingPartyReducer
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case kycTypes.KYC_RP_UPDATE:
			return reducers.updateRelyingPartyReducer(state, action);
		case kycTypes.KYC_RP_APPLICATION_ADD:
			return reducers.addKYCApplicationReducer(state, action);
	}
	return state;
};

export default reducer;
