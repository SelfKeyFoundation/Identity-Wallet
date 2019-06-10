import { getPrices } from 'common/prices/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';

const getAmountUsd = (amount, state, cryptoCurrency) => {
	const price = getPrices(state).prices.filter(price => price.symbol === cryptoCurrency)[0];
	if (price) {
		return amount * price.priceUSD;
	}
	return 0;
};

export const getTransaction = state => {
	const transaction = state.transaction;
	const { cryptoCurrency } = transaction;
	transaction.amountUsd = getAmountUsd(transaction.amount, state, cryptoCurrency);
	transaction.usdFee = getAmountUsd(transaction.ethFee, state, 'ETH');
	const token = getTokens(state).filter(token => {
		return token.symbol === cryptoCurrency;
	})[0];

	transaction.balance = token ? token.balance : 0;
	transaction.contractAddress = token ? token.address : '';
	transaction.tokenDecimal = token ? token.decimal : 18;
	return transaction;
};
