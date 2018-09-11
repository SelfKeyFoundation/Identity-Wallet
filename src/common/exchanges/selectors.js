import { getTokens } from 'common/wallet-tokens/selectors';

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

export const getItemDetails = ({ exchanges }, name) => {
	return exchanges.byId[name];
};

export const hasBalance = (state, name) => {
	const exchange = getItemDetails(state, name);

	const keyToken = getTokens(state).find(token => {
		return token.symbol === 'KEY';
	});

	const requiredBalance = exchange.data.requiredBalance;

	return keyToken.balance >= requiredBalance;
};
