import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import store from '../common/store';
import TokenBox from './containers/token-box';
import TokenPrice from './containers/token-price';
import { EthereumIcon, SelfkeyIcon, CustomIcon, CustomTokenText } from 'selfkey-ui';

const renderIcon = shortName => {
	switch (shortName) {
		case 'KEY':
			return SelfkeyIcon;
		case 'ETH':
			return EthereumIcon;
		default:
			return CustomIcon;
	}
};

export const TokenBoxWrapper = props => {
	const {
		cryptoCurrencyShort,
		cryptoCurrencyName,
		publicKey,
		cryptoCurrency,
		cryptoValue,
		toCurrency,
		toValue,
		customTokenText,
		copyAction,
		transferAction
	} = props;

	return (
		<Provider store={store}>
			<TokenBox
				cryptoCurrencyShort={cryptoCurrencyShort}
				cryptoCurrencyName={cryptoCurrencyName}
				publicKey={publicKey}
				CryptoCurrencyIconComponent={renderIcon(cryptoCurrencyShort)}
				copyAction={copyAction}
				transferAction={transferAction}
			>
				{!cryptoCurrencyShort ? (
					<CustomTokenText>{customTokenText}</CustomTokenText>
				) : (
					<TokenPrice
						cryptoCurrency={cryptoCurrency}
						cryptoValue={cryptoValue}
						toCurrency={toCurrency}
						toValue={toValue}
					/>
				)}
			</TokenBox>
		</Provider>
	);
};

TokenBoxWrapper.propTypes = {
	cryptoCurrencyShort: PropTypes.string,
	cryptoCurrencyName: PropTypes.string,
	publicKey: PropTypes.string,
	cryptoCurrency: PropTypes.string,
	cryptoValue: PropTypes.number,
	toCurrency: PropTypes.string,
	toValue: PropTypes.number,
	customTokenText: PropTypes.string,
	copyAction: PropTypes.string,
	transferAction: PropTypes.function
};

export default TokenBoxWrapper;
