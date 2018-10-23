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
			serviceOwner: data.serviceOwner || '0x0',
			serviceId: data.serviceId || 'global',
			lockPeriod: data.lockPeriod || 2592000000, // 30 days
			amount: data.requiredBalance || 25
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

export const getItemDetails = ({ exchanges }, name) => {
	let details = {
		serviceOwner: '0x0',
		serviceId: 'global',
		lockPeriod: 2592000000,
		amount: 25,
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
	const exchange = getItemDetails(state, name);

	const keyToken = getTokens(state).find(token => {
		return token.symbol === CONFIG.constants.primaryToken.toUpperCase();
	});

	const requiredBalance = exchange.requiredBalance;

	return keyToken.balance >= requiredBalance;
};
