import { getPrices } from 'common/prices/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';

const getAmountUsd = (amount, state, cryptoCurrency) => {
	const price = getPrices(state).prices.filter(price => price.symbol === cryptoCurrency)[0];
	if (price) {
		return amount * price.priceUSD;
	}
	return 0;
};

export const getTransaction = (state, cryptoCurrency) => {
	const transaction = state.transaction;
	transaction.amountUsd = getAmountUsd(transaction.amount, state, cryptoCurrency);
	transaction.usdFee = getAmountUsd(transaction.ethFee, state, cryptoCurrency);
	const token = getTokens(state).filter(token => {
		return token.symbol === cryptoCurrency;
	});
	transaction.balance = token.length && token[0] ? token[0].balance : 0;
	return transaction;
};
