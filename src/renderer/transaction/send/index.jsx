import React from 'react';
import { connect } from 'react-redux';
import { getWallet } from 'common/wallet/selectors';
import {
	transactionHistoryOperations,
	transactionHistorySelectors
} from 'common/transaction-history';
import { Grid, Typography, Paper, Modal, Divider, Button } from '@material-ui/core';
import {
	SelfkeyIcon,
	EthereumIcon,
	CustomIcon,
	SentIcon,
	ModalWrap,
	ModalCloseButton,
	ModalCloseIcon,
	ModalBody,
	Copy
} from 'selfkey-ui';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import TokenPrice from '../../common/token-price';
import { push } from 'connected-react-router';
import TransactionsHistory from '../transactions-history';

const styles = theme => ({
	cryptoIcon: {
		marginRight: '20px'
	},
	cryptoSymbol: {
		fontSize: '14px',
		fontWeight: 'normal'
	},
	modal: {
		height: '100%',
		overflow: 'auto'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent',
		width: '850px',
		left: 'calc(50% - 425px)'
	},
	modalContentWrapper: {
		boxShadow: 'none',
		marginBottom: '20px'
	},
	closeIcon: {
		'& svg': {
			position: 'relative',
			top: '20px',
			left: '70px'
		}
	},
	tokenPrice: {
		padding: '20px 0'
	},
	tokenAddress: {
		padding: '20px 0'
	},
	actionButtons: {
		padding: '36px 0 12px 0',
		'& button': {
			marginRight: '20px'
		},
		'& svg': {
			width: '0.9em !important',
			height: '0.9em !important',
			marginRight: '0.5em'
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
	},
	transactionEntry: {
		display: 'flex',
		padding: '20px 0',
		justifyContent: 'space-between',
		alignItems: 'center',
		'& svg path': {
			fill: 'transparent',
			stroke: '#93B0C1'
		}
	},
	transactionEntryDate: {
		width: '50px',
		textAlign: 'center'
	},
	transactionEntryIcon: {
		width: '100px',
		textAlign: 'center'
	},
	transactionEntryStatus: {
		width: 'calc(100% - 200px)'
	},
	transactionEntryAmount: {
		width: '100px',
		textAlign: 'right'
	}
});

const goBackDashboard = props => <Link to="/main/dashboard" {...props} />;

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
			<Modal open={true} className={classes.modal}>
				<ModalWrap className={classes.modalWrap}>
					<Paper className={classes.modalContentWrapper}>
						<ModalCloseButton className={classes.closeIcon} component={goBackDashboard}>
							<ModalCloseIcon />
						</ModalCloseButton>

						<ModalBody style={{ boxShadow: 'none' }}>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="flex-start"
								spacing={16}
							>
								<div className={classes.cryptoIcon}>
									{getIconForToken(cryptoCurrency)}
								</div>
								<div>
									<Typography variant="h5">
										{getNameForToken(cryptoCurrency)}
									</Typography>
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
									<Button
										variant="outlined"
										size="large"
										onClick={this.handleReceive}
									>
										<CustomIcon /> Receive
									</Button>
									<Button
										variant="outlined"
										size="large"
										onClick={this.handleSend}
									>
										<SentIcon /> Send
									</Button>
								</Grid>
							</div>
						</ModalBody>
					</Paper>

					<TransactionsHistory cryptoCurrency={cryptoCurrency} />
				</ModalWrap>
			</Modal>
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
