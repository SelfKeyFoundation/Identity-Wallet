import React from 'react';
import { Grid } from '@material-ui/core';
import { SelfkeyIcon, EthereumIcon, CustomIcon, CustomTokenText } from 'selfkey-ui';
import TokenBox from './token-box';
import TokenPrice from '../common/token-price';
import config from 'common/config';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

const TokenList = props => {
	return (
		<Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={16}>
			<Grid item>
				<TokenBox
					cryptoCurrencyShort={config.constants.primaryToken}
					cryptoCurrencyName="Selfkey"
					CryptoCurrencyIconComponent={SelfkeyIcon}
					transferAction={() => props.dispatch(push('/main/transfer/key'))}
				>
					<TokenPrice cryptoCurrency={config.constants.primaryToken} />
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
