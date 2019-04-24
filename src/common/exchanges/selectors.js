import { getTokens } from 'common/wallet-tokens/selectors';
import CONFIG from 'common/config.js';

export const getExchanges = ({ exchanges }) => {
	return exchanges.allIds.map(item => {
		let { data } = exchanges.byId[item];
		return {
			name: data.name,
			status: data.status,
			description: data.description,
			logoUrl: data.logo[0].url,
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
	});
};

export const getExchangeLinks = ({ exchanges }) => {
	return exchanges.allIds.map(item => {
		return {
			name: exchanges.byId[item].data.name,
			url: exchanges.byId[item].data.URL
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
	const kycTemplate = details.kyc_template.map(template => {
		return {
			name: template,
			type: getType(template),
			isEntered: false
		};
	});

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
