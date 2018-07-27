import { getWallet } from 'common/wallet/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';

const getCryptoEntity = (state, props) => {
	if (props.cryptoCurrency === 'ETH') {
		return getWallet(state);
	}

	return getTokens(state).filter(token => token.symbol === props.cryptoCurrency)[0];
};

export const getCryptoValue = (state, props) => {
	return getCryptoEntity(state, props).balance;
};

export const getToValue = (state, props) => {
	return getCryptoEntity(state, props).balanceInFiat;
};
