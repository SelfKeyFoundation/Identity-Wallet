import { getPrices } from 'common/prices/selectors';

export const getWallet = state => {
	let { wallet } = state;
	wallet = { ...wallet };
	const ethereumPrice =
		((getPrices(state) || {}).prices || []).filter(price => price.symbol === 'ETH')[0] || {};
	wallet.balanceInFiat = wallet.balance * (ethereumPrice.priceUSD || 0);
	wallet.name = 'Ethereum';
	wallet.symbol = 'ETH';
	wallet.price = ethereumPrice.priceUSD;
	wallet.recordState = 1;
	wallet.isHardwareWallet = wallet.type === 'ledger' || wallet.type === 'trezor';
	return wallet;
};

export const getAssociateError = state => {
	return state.wallet.associateError;
};

export const getDidOriginUrl = state => {
	return state.wallet.didOriginUrl;
};
