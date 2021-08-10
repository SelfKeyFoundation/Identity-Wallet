import { getPrices } from 'common/prices/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';

export const getAmountUsd = (state, amount, cryptoCurrency) => {
	const price = getPrices(state).prices.filter(price => price.symbol === cryptoCurrency)[0];
	if (price) {
		return amount * price.priceUSD;
	}
	return 0;
};

export const getTransaction = state => {
	const transaction = state.transaction;
	console.log(transaction);
	const { cryptoCurrency } = transaction;
	transaction.amountUsd = getAmountUsd(state, transaction.amount, cryptoCurrency);
	transaction.usdFee = getAmountUsd(state, transaction.ethFee, 'ETH');
	const token = getTokens(state).filter(token => {
		return token.symbol === cryptoCurrency;
	})[0];

	transaction.balance = token ? token.balance : 0;
	transaction.contractAddress = token ? token.address : '';
	transaction.tokenDecimal = token ? token.decimal : 18;
	return transaction;
};
