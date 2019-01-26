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
	KYC_RP_APPLICATION_ADD: 'kyc/rp/application/add'
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
		const templates = await session.listKYCTemplates();
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

export const createRelyingPartyKYCApplication = (rpName, templateId, attributeIds) => async (
	dispatch,
	getState
) => {
	const rp = kycSelectors.relyingPartySelector(getState(), rpName);
	if (!rp || !rp.session) throw new Error('relying party does not exist');
	if (!rp.templates[templateId]) throw new Error('template does not exist');

	const wallet = walletSelectors.getWallet(getState());
	if (!wallet) return;
	const attributes = identitySelectors.selectFullIdAttributesByIds(
		getState(),
		wallet.id,
		attributeIds
	);
	const application = await rp.session.createKYCApplication(rpName, templateId, attributes);
	await dispatch(kycActions.addKYCApplication(rpName, application));
};

export const kycOperations = {
	...kycActions,
	loadRelyingParty: createAliasedAction(kycTypes.KYC_RP_LOAD, loadRelyingPartyOperation)
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
