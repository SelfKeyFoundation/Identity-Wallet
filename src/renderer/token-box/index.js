import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import store from '../common/store';
import TokenBox from './containers/token-box';
import TokenPrice from '../common/token-price';
import CONFIG from 'common/config.js';
import { EthereumIcon, SelfkeyIcon, CustomIcon, CustomTokenText } from 'selfkey-ui';

const renderIcon = shortName => {
	switch (shortName) {
		case CONFIG.constants.primaryToken.toUpperCase():
			return SelfkeyIcon;
		case 'ETH':
			return EthereumIcon;
		default:
			return CustomIcon;
	}
};

export const TokenBoxWrapper = props => {
	const { cryptoCurrencyShort, cryptoCurrencyName, customTokenText, transferAction } = props;
	return (
		<Provider store={store}>
			<TokenBox
				cryptoCurrencyShort={cryptoCurrencyShort}
				cryptoCurrencyName={cryptoCurrencyName}
				CryptoCurrencyIconComponent={renderIcon(cryptoCurrencyShort)}
				transferAction={transferAction}
			>
				{!cryptoCurrencyShort ? (
					<CustomTokenText>{customTokenText}</CustomTokenText>
				) : (
					<TokenPrice cryptoCurrency={cryptoCurrencyShort} />
				)}
			</TokenBox>
		</Provider>
	);
};

TokenBoxWrapper.propTypes = {
	cryptoCurrencyShort: PropTypes.string,
	cryptoCurrencyName: PropTypes.string,
	customTokenText: PropTypes.string,
	transferAction: PropTypes.function
};

export default TokenBoxWrapper;
