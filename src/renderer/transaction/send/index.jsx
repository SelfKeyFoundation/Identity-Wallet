import React from 'react';
import { Provider, connect } from 'react-redux';
import store from '../../common/store';
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
	FailedIcon,
	HourGlassIcon,
	ReceiveIcon,
	ModalWrap,
	ModalCloseButton,
	ModalCloseIcon,
	ModalBody,
	Copy
} from 'selfkey-ui';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import TokenPrice from '../../common/token-price';

const styles = theme => ({
	cryptoIcon: {
		marginRight: '20px'
	},
	cryptoSymbol: {
		fontSize: '14px',
		fontWeight: 'normal'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent'
	},
	modalContentWrapper: {
		boxShadow: 'none',
		marginBottom: '20px'
	},
	closeIcon: {
		'& svg': {
			position: 'relative',
			top: '20px'
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

const getIconForTransaction = (statusIconName, sending) => {
	switch (statusIconName) {
		case 'failed':
			return <FailedIcon />;
		case 'receive':
			return <ReceiveIcon />;
		case 'hourglass':
			return <HourGlassIcon />;
		case 'sent':
			return <SentIcon />;
		default:
			return sending ? <SentIcon /> : <ReceiveIcon />;
	}
};

const getCustomStatusText = transaction => {
	if (transaction.sending) {
		return `Sent to ${transaction.address}`;
	} else {
		return `Received from ${transaction.address}`;
	}
};

const getAbrDateFromTimestamp = timestamp => {
	const monthNames = [
		'JAN',
		'FEB',
		'MAR',
		'APR',
		'MAY',
		'JUN',
		'JUL',
		'AUG',
		'SEP',
		'OCT',
		'NOV',
		'DEC'
	];
	const date = new Date(timestamp);
	const month = monthNames[date.getMonth()];
	const day = date.getDate();

	return { month, day };
};

export class Transfer extends React.Component {
	componentDidMount() {
		this.props.dispatch(transactionHistoryOperations.loadTransactionsOperation());
	}

	_renderDate(timestamp) {
		const { day, month } = getAbrDateFromTimestamp(timestamp);
		return (
			<div>
				{month}
				<br />
				{day}
			</div>
		);
	}

	render() {
		const { classes, cryptoCurrency, publicKey, transactions } = this.props;
		const NUMBER_OF_LAST_TRANSACTIONS_TO_SHOW = 5;

		// Select only specific transactions
		const selectedCryptoTransactions = transactions.filter(
			t => t.cryptoCurrency === cryptoCurrency
		);
		// Filter only last 5
		const lastCryptoTransactions = selectedCryptoTransactions.slice(
			0,
			NUMBER_OF_LAST_TRANSACTIONS_TO_SHOW
		);

		return (
			<Provider store={store}>
				<Modal open={true}>
					<ModalWrap className={classes.modalWrap}>
						<Paper className={classes.modalContentWrapper}>
							<ModalCloseButton
								className={classes.closeIcon}
								component={goBackDashboard}
							>
								<ModalCloseIcon />
							</ModalCloseButton>

							<ModalBody>
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
											{publicKey}
										</Typography>
										<Copy text={publicKey} />
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
										<Button variant="outlined" size="large">
											<CustomIcon /> Receive
										</Button>
										<Button variant="outlined" size="large">
											<SentIcon /> Send
										</Button>
									</Grid>
								</div>
							</ModalBody>
						</Paper>

						<Paper className={classes.modalContentWrapper}>
							<ModalBody>
								<div>
									<Typography variant="h4">Activity</Typography>
									<div>
										{lastCryptoTransactions.map(transaction => (
											<div key={transaction.id}>
												<div className={classes.transactionEntry}>
													<div className={classes.transactionEntryDate}>
														<Typography
															variant="body2"
															color="secondary"
															gutterBottom
														>
															{this._renderDate(transaction.date)}
														</Typography>
													</div>
													<div className={classes.transactionEntryIcon}>
														{getIconForTransaction(
															transaction.statusIconName,
															transaction.sending
														)}
													</div>
													<div className={classes.transactionEntryStatus}>
														<Typography variant="body2" gutterBottom>
															{transaction.statusText ||
																getCustomStatusText(transaction)}
														</Typography>
													</div>
													<div className={classes.transactionEntryAmount}>
														<Typography variant="body2" gutterBottom>
															{transaction.sending ? '- ' : '+ '}
															{transaction.amount}
														</Typography>
													</div>
												</div>
												<Divider />
											</div>
										))}
									</div>
								</div>
							</ModalBody>
						</Paper>
					</ModalWrap>
				</Modal>
			</Provider>
		);
	}
}

const mapStateToProps = state => {
	return {
		publicKey: getWallet(state).publicKey,
		transactions: transactionHistorySelectors.selectTransactionHistory(state).transactions
	};
};

export default connect(mapStateToProps)(withStyles(styles)(Transfer));
