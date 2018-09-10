import { getTokens } from 'common/wallet-tokens/selectors';

export const getExchanges = ({ exchanges }) => {
	return exchanges.list.map(item => {
		return {
			name: item.name,
			status: item.data.status,
			description: item.data.description,
			logoUrl: item.data.logo[0].url
		};
	});
};

export const getExchangeLinks = ({ exchanges }) => {
	return exchanges.list.map(item => {
		return {
			name: item.name,
			url: item.data.URL
		};
	});
};

export const getItemDetails = ({ exchanges }, name) => {
	return exchanges.list.find(item => {
		return item.name === name;
	});
};

export const hasBalance = (state, name) => {
	const exchange = state.exchanges.list.find(item => {
		return item.name === name;
	});
	const keyToken = getTokens(state).find(token => {
		return token.symbol === 'KEY';
	});
	const requiredBalance = exchange.data.requiredBalance;

	return keyToken.balance >= requiredBalance;
};
