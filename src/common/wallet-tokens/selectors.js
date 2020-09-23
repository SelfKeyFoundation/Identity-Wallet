import { createSelector } from 'reselect';
import { getViewAll } from 'common/view-all-tokens/selectors';
import { getPrices } from 'common/prices/selectors';
import { getWallet } from 'common/wallet/selectors';

export const getTopTokenListSize = state => state.walletTokens.topTokenListSize;

export const getTokens = state => {
	let tokens = state.walletTokens.tokens.slice(0);
	const wallet = { decimal: 18, ...getWallet(state) };
	tokens = tokens.map(token => {
		token = { ...token };
		const symbol = (token.symbol || '').toUpperCase();
		const price = getPrices(state).prices.filter(
			price => price.symbol.toUpperCase() === symbol
		)[0];
		const priceUSD = price ? price.priceUSD : 0;
		token.balanceInFiat = token.balance * priceUSD;
		token.price = priceUSD;
		token.symbol = symbol;
		// Workaround for Tokens with different Symbols than the ones in price table
		if (token.name) {
			return token;
		}
		if (['KEY', 'KI'].includes(symbol)) {
			token.name = 'Selfkey';
		}
		if (!token.name) {
			token.name = token.symbol;
		}
		return token;
	});
	delete wallet.address;
	return [wallet, ...tokens];
};

const getTokensForDisplay = state => getTokens(state).filter(token => token.recordState);

const getFilteredTokens = state => {
	const tokens = getTokensForDisplay(state);
	const topTokenListSize = getTopTokenListSize(state);
	const topTokens = tokens.slice(0, topTokenListSize);
	const otherTokens = tokens.slice(topTokenListSize, tokens.length);
	if (otherTokens.length) {
		const othersToken = getOthersToken(otherTokens);
		return [...topTokens, othersToken];
	} else {
		return topTokens;
	}
};

const getOthersToken = otherTokens => {
	return {
		name: 'Others',
		symbol: 'OTHERS',
		balance: getOthersTokenBalance(otherTokens, 'balance'),
		balanceInFiat: getOthersTokenBalance(otherTokens, 'balanceInFiat')
	};
};

const getOthersTokenBalance = (otherTokens, balanceType) => {
	return otherTokens.reduce((a, b) => {
		return a + b[balanceType];
	}, 0);
};

export const getVisibleTokens = createSelector(
	[getViewAll, getTokensForDisplay, getFilteredTokens],
	(viewAll, tokensForDisplay, filteredTokens) => {
		if (viewAll.viewAll) {
			return tokensForDisplay;
		} else {
			return filteredTokens;
		}
	}
);

export const getERC20Tokens = state => {
	return getTokens(state).slice(1);
};

export const getTokenBySymbol = (state, symbol) => {
	return getTokens(state).find(t => t.symbol === symbol);
};
