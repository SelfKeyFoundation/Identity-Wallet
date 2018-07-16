import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import store from '../common/store';
import TokenBox from './containers/token-box';
import TokenPrice from './containers/token-price';
import { EthereumIcon, SelfkeyIcon, CustomIcon, CustomTokenText } from 'selfkey-ui';

export class TokenBoxWrapper extends React.Component {
	render() {
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
		} = this.props;
		console.log('PROPS', this.props);
		return (
			<Provider store={store}>
				<TokenBox
					cryptoCurrencyShort={cryptoCurrencyShort}
					cryptoCurrencyName={cryptoCurrencyName}
					publicKey={publicKey}
					CryptoCurrencyIconComponent={
						!cryptoCurrencyShort
							? CustomIcon
							: cryptoCurrencyShort === 'KEY'
								? SelfkeyIcon
								: EthereumIcon
					}
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
	}
}

TokenBoxWrapper.propTypes = {
	cryptoCurrencyShort: PropTypes.string,
	cryptoCurrencyName: PropTypes.string,
	publicKey: PropTypes.string,
	cryptoCurrency: PropTypes.string,
	cryptoValue: PropTypes.string,
	toCurrency: PropTypes.string,
	toValue: PropTypes.string,
	customTokenText: PropTypes.string,
	copyAction: PropTypes.string,
	transferAction: PropTypes.string
};

export default TokenBoxWrapper;
