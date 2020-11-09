import React from 'react';
import { connect } from 'react-redux';
import { getWallet } from 'common/wallet/selectors';
import {
	transactionHistoryOperations,
	transactionHistorySelectors
} from 'common/transaction-history';
import { Grid, Typography, Divider, Button } from '@material-ui/core';
import { SelfkeyIcon, EthereumIcon, CustomIcon, SentIcon, Copy } from 'selfkey-ui';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import TokenPrice from '../../common/token-price';
import { push } from 'connected-react-router';
import TransactionsHistory from '../transactions-history';
import { Popup } from '../../common';

const styles = theme => ({
	cryptoIcon: {
		marginRight: theme.spacing(2)
	},
	cryptoSymbol: {
		fontSize: '14px',
		fontWeight: 'normal'
	},
	tokenPrice: {
		padding: theme.spacing(2, 0)
	},
	tokenAddress: {
		padding: theme.spacing(2, 0)
	},
	actionButtons: {
		padding: theme.spacing(4, 0, 1),
		'& button': {
			marginRight: theme.spacing(2)
		},
		'& svg': {
			width: '0.9em !important',
			height: '0.9em !important',
			marginRight: theme.spacing(1)
		},
		'& svg path': {
			fill: '#09a8ba'
		}
	},
	tokenPublicKey: {
		'& > p': {
			display: 'inline'
		},
		'& > button': {
			display: 'inline'
		}
	}
});

const goBackDashboard = React.forwardRef((props, ref) => (
	<Link to="/main/dashboard" {...props} ref={ref} />
));

const getIconForToken = token => {
	let icon = null;
	switch (token) {
		case 'KEY':
			icon = <SelfkeyIcon />;
			break;
		case 'ETH':
			icon = <EthereumIcon />;
			break;
		default:
			icon = <CustomIcon />;
	}
	return icon;
};

const getNameForToken = token => {
	let name = '';
	switch (token) {
		case 'KEY':
			name = 'Selfkey';
			break;
		case 'ETH':
			name = 'Ethereum';
			break;
		default:
			name = 'Custom Tokens';
	}
	return name;
};

export class Transfer extends React.Component {
	componentDidMount() {
		this.props.dispatch(transactionHistoryOperations.loadTransactionsOperation());
	}

	handleSend = () => {
		this.props.dispatch(push(`/main/advancedTransaction/${this.props.cryptoCurrency}`));
	};

	handleReceive = _ => {
		this.props.dispatch(push(`/main/transfer/receive/${this.props.cryptoCurrency}`));
	};

	render() {
		const { classes, cryptoCurrency, address } = this.props;

		return (
			<Popup closeComponent={goBackDashboard} open>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					spacing={2}
				>
					<div className={classes.cryptoIcon}>{getIconForToken(cryptoCurrency)}</div>
					<div>
						<Typography variant="h5">{getNameForToken(cryptoCurrency)}</Typography>
						<Typography variant="h2" className={classes.cryptoSymbol}>
							{cryptoCurrency}
						</Typography>
					</div>
				</Grid>
				<div className={classes.tokenPrice}>
					<TokenPrice cryptoCurrency={cryptoCurrency} />
				</div>
				<Divider />
				<div className={classes.tokenAddress}>
					<Typography variant="body2" gutterBottom>
						Your Address
					</Typography>
					<div className={classes.tokenPublicKey}>
						<Typography variant="body2" color="secondary" gutterBottom>
							{address}
						</Typography>
						<Copy text={address} />
					</div>
				</div>
				<Divider />
				<div className={classes.actionButtons}>
					<Grid
						container
						direction="row"
						justify="flex-start"
						alignItems="flex-start"
						spacing={0}
					>
						<Button variant="outlined" size="large" onClick={this.handleReceive}>
							<CustomIcon /> Receive
						</Button>
						<Button variant="outlined" size="large" onClick={this.handleSend}>
							<SentIcon /> Send
						</Button>
					</Grid>
				</div>

				<TransactionsHistory cryptoCurrency={cryptoCurrency} />
			</Popup>
		);
	}
}

const mapStateToProps = state => {
	return {
		address: getWallet(state).address,
		transactions: transactionHistorySelectors.selectTransactionHistory(state).transactions
	};
};

export default connect(mapStateToProps)(withStyles(styles)(Transfer));
