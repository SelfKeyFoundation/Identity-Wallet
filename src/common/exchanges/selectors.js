import { getTokens } from 'common/wallet-tokens/selectors';
import CONFIG from 'common/config.js';

export const getExchanges = ({ exchanges }) => {
	return exchanges.allIds.map(item => {
		return {
			name: exchanges.byId[item].data.name,
			status: exchanges.byId[item].data.status,
			description: exchanges.byId[item].data.description,
			logoUrl: exchanges.byId[item].data.logo[0].url
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
	let details = exchanges.byId[name].data;
	const kycTemplate = details.kyc_template.map(template => {
		return {
			name: template,
			type: getType(template),
			isEntered: false
		};
	});

	details = { ...details, kyc_template: kycTemplate, integration: 'UNLOCK MARKETPLACE' };
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
