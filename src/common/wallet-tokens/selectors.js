import { createSelector } from 'reselect';
import { getViewAll } from 'common/view-all-tokens/selectors';
import { getPrices } from 'common/prices/selectors';
import { getWallet } from 'common/wallet/selectors';

export const getTopTokenListSize = state => state.walletTokens.topTokenListSize;

export const getTokens = state => {
	const tokens = state.walletTokens.tokens.slice(0);
	const wallet = { decimal: 18, ...getWallet(state) };
	tokens.forEach(token => {
		const price = getPrices(state).prices.filter(price => price.symbol === token.symbol)[0];
		const priceUSD = price ? price.priceUSD : 0;
		token.balanceInFiat = token.balance * priceUSD;
		token.price = priceUSD;
		// Workaround for Tokens with different Symbols than the ones in price table
		token.name = token.name ? token.name : 'Token';
	});
	delete wallet.address;
	return [wallet, ...tokens];
};

const getTokensForDisplay = state => {
	return getTokens(state).filter(token => token.recordState);
};

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
