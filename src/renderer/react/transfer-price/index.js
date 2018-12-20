import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import store from '../common/store';
import TokenPrice from '../common/token-price';
import { EthereumIcon, SelfkeyIcon, TransferPrice } from 'selfkey-ui';
import CONFIG from 'common/config.js';

const renderIcon = shortName => {
	switch (shortName) {
		case CONFIG.constants.primaryToken.toUpperCase():
			return SelfkeyIcon;
		case 'ETH':
			return EthereumIcon;
	}
};

export const TransferPriceWrapper = props => {
	const { cryptoCurrencyShort, cryptoCurrencyName } = props;
	return (
		<Provider store={store}>
			<TransferPrice
				cryptoCurrencyShort={cryptoCurrencyShort}
				cryptoCurrencyName={cryptoCurrencyName}
				CryptoCurrencyIconComponent={renderIcon(cryptoCurrencyShort)}
			>
				<TokenPrice cryptoCurrency={cryptoCurrencyShort} />
			</TransferPrice>
		</Provider>
	);
};

TransferPriceWrapper.propTypes = {
	cryptoCurrencyShort: PropTypes.string,
	cryptoCurrencyName: PropTypes.string
};

export default TransferPriceWrapper;
