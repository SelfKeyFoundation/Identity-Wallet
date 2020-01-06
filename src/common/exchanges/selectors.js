import { getTokens } from 'common/wallet-tokens/selectors';
import CONFIG from 'common/config.js';

const getExchangesStore = state => {
	return state.exchanges.allIds;
};

const parseExchange = data => {
	return {
		name: data.name,
		status: data.status,
		description: data.description,
		logoUrl: data.logo && data.logo[0] ? data.logo[0].url : false,
		serviceOwner: data.serviceOwner || '0x0000000000000000000000000000000000000000',
		serviceId: data.serviceId || 'global',
		lockPeriod: data.lockPeriod || 2592000000, // 30 days
		amount: data.requiredBalance || CONFIG.depositPriceOverride || 25,
		location: data.location || '',
		fees: data['maker_fee'] || '',
		fiatSupported: data['fiat_supported'] || [],
		fiatPayments: data['fiat_payments'] || [],
		excludedResidents: data['excluded_residents'] || []
	};
};

export const getExchanges = state => {
	const exchanges = getExchangesStore(state);

	return exchanges.map(item => {
		let { data } = state.exchanges.byId[item];
		return parseExchange(data);
	});
};

export const getExchangeLinks = state => {
	const exchanges = getExchangesStore(state);
	return exchanges.map(item => {
		return {
			name: state.exchanges.byId[item].data.name,
			url: state.exchanges.byId[item].data.URL
		};
	});
};

const getType = template => {
	switch (template) {
		case 'national_id':
			return 'document';
		case 'id_selfie':
			return 'document';
		default:
			return 'metadata';
	}
};

export const getServiceDetails = ({ exchanges }, name) => {
	if (name === 'exchanges') {
		return {
			serviceOwner: '0x0000000000000000000000000000000000000000',
			serviceId: 'global',
			lockPeriod: 2592000000,
			amount: CONFIG.depositPriceOverride || 25,
			requiredBalance: CONFIG.depositPriceOverride || 25,
			status: 'Active'
		};
	}
	let details = {
		serviceOwner: '0x0000000000000000000000000000000000000000',
		serviceId: 'global',
		lockPeriod: 2592000000,
		amount: CONFIG.depositPriceOverride || 25,
		...exchanges.byId[name].data
	};
	if (details.requiredBalance) {
		details.amount = details.requiredBalance;
	}
	const kycTemplate = details.relying_party_config
		? (details.relying_party_config.templates || []).map(template => {
				return {
					name: template,
					type: getType(template),
					isEntered: false
				};
		  })
		: undefined;

	details = { ...details, kyc_template: kycTemplate };
	return details;
};

export const hasBalance = (state, name) => {
	const service = getServiceDetails(state, name);

	const keyToken = getTokens(state).find(token => {
		return token.symbol === CONFIG.constants.primaryToken.toUpperCase();
	}) || { balance: 0 };

	const requiredBalance = service.requiredBalance;

	return keyToken.balance >= requiredBalance;
};

export const selectListingExchanges = state => {
	const { exchangesListingById, exchangesListingAll } = state.exchanges;
	return exchangesListingAll.map(id => exchangesListingById[id]);
};
