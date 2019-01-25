import { getPrices } from 'common/prices/selectors';

export const getWallet = state => {
	const { wallet } = state;
	const ethereumPrice =
		((getPrices(state) || {}).prices || []).filter(price => price.symbol === 'ETH')[0] || {};
	wallet.balanceInFiat = wallet.balance * (ethereumPrice.priceUSD || 0);
	wallet.name = 'Ethereum';
	wallet.symbol = 'ETH';
	wallet.price = ethereumPrice.priceUSD;
	wallet.hidden = 0;
	wallet.isHardwareWallet = wallet.profile === 'ledger' || wallet.profile === 'trezor';
	return wallet;
};
