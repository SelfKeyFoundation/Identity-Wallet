import React from 'react';
import { Grid } from '@material-ui/core';
import { SelfkeyIcon, EthereumIcon, CustomIcon, CustomTokenText } from 'selfkey-ui';
import TokenBox from './token-box';
import TokenPrice from '../common/token-price';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

const TokenList = props => {
	return (
		<Grid container spacing={16}>
			<Grid item>
				<TokenBox
					cryptoCurrencyShort="KEY"
					cryptoCurrencyName="Selfkey"
					CryptoCurrencyIconComponent={SelfkeyIcon}
					transferAction={() => props.dispatch(push('/main/transfer/key'))}
				>
					<TokenPrice cryptoCurrency="KEY" />
				</TokenBox>
			</Grid>
			<Grid item>
				<TokenBox
					cryptoCurrencyShort="ETH"
					cryptoCurrencyName="Ethereum"
					CryptoCurrencyIconComponent={EthereumIcon}
					transferAction={() => props.dispatch(push('/main/transfer/eth'))}
				>
					<TokenPrice cryptoCurrency="ETH" />
				</TokenBox>
			</Grid>
			<Grid item>
				<TokenBox
					cryptoCurrencyShort=""
					cryptoCurrencyName="Custom Tokens"
					CryptoCurrencyIconComponent={CustomIcon}
					transferAction={() => props.dispatch(push('/main/transfer/custom'))}
				>
					<CustomTokenText>Send or receive any custom ERC-20 token.</CustomTokenText>
				</TokenBox>
			</Grid>
		</Grid>
	);
};

const mapStateToProps = state => {
	return {};
};

export default connect(mapStateToProps)(TokenList);
