import React, { PureComponent } from 'react';
import {
	transactionHistoryOperations,
	transactionHistorySelectors
} from 'common/transaction-history';
import { walletSelectors } from 'common/wallet';
import { connect } from 'react-redux';
import config from 'common/config';
import {
	Button,
	Grid,
	Table,
	Typography,
	TableBody,
	IconButton,
	TableRow,
	TableCell,
	TableFooter,
	CircularProgress
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import {
	RefreshIcon,
	HourGlassIcon,
	FailedIcon,
	ReceivedRoundedIcon,
	FilterIcon,
	DropdownIcon,
	SentRoundedIcon,
	typography
} from 'selfkey-ui';
import { convertExponentialToDecimal } from 'common/utils/exponential-to-decimal';
import { push } from 'connected-react-router';

const styles = theme => ({
	iconSpacing: {
		marginRight: '10px'
	},
	toolbar: {
		justifyContent: 'space-between'
	},
	rightSpace: {
		marginRight: '20px'
	},
	tableRow: {
		backgroundColor: 'transparent !important',
		borderBottom: '1px solid #303C49',
		'& td': {
			padding: '17px 0',
			'&:last-child': {
				paddingRight: 0
			}
		}
	},
	tableFooter: {
		'& td': {
			paddingBottom: 0
		}
	},
	title: {
		fontSize: '20px'
	},
	narrowCell: {
		padding: 0
	},
	smallPadding: {
		padding: '0 10px'
	},
	zeroRightPadding: {
		paddingRight: '0 !important'
	},
	iconWrap: {
		display: 'flex',
		justifyContent: 'flex-end',
		'& button:last-child': {
			paddingRight: 0
		}
	},
	bottomSpace: {
		marginBottom: '30px'
	},
	transparent: {
		'&:nth-of-type(odd)': {
			backgroundColor: 'transparent'
		}
	},
	loading: {
		position: 'relative',
		marginLeft: '10px',
		top: '5px'
	},
	searching: {
		height: '19px',
		width: '242px',
		color: '#00C0D9',
		fontFamily: 'Lato',
		fontSize: '13px',
		lineHeight: '19px',
		textTransform: 'none',
		marginLeft: '10px'
	},
	moreTransactions: {
		'& svg': {
			marginRight: '10px'
		},
		'& span': {
			fontWeight: '500',
			letterSpacing: 0
		}
	},
	iconDisabled: {
		color: typography,
		opacity: '0.2'
	}
});

const getIconForTransaction = (isError, sent) => {
	switch (isError) {
		case 1:
			return <FailedIcon />;
		case undefined:
			return <HourGlassIcon />;
		default:
			return sent ? <SentRoundedIcon /> : <ReceivedRoundedIcon />;
	}
};

const getCryptoType = transaction => {
	if (transaction.contractAddress === null) {
		return 'ETH';
	} else {
		if (transaction.contractAddress === config.ledgerAddress) {
			return 'for DID';
		} else {
			return transaction.tokenSymbol;
		}
	}
};

const getCustomStatusText = (transaction, sent) => {
	let cryptoType = getCryptoType(transaction);
	if (transaction.isError === 1) {
		if (sent) {
			return `Failed to send ${cryptoType}`;
		} else {
			return `Failed to receive ${cryptoType}`;
		}
	}

	const isPending = !transaction.blockHash;
	let label;

	if (sent) {
		label = isPending ? 'Sending' : 'Sent';
	} else {
		label = isPending ? 'Receiving' : 'Received';
	}

	return `${label} ${cryptoType}`;
};

const getCustomValue = (transaction, sent) => {
	if (transaction.isError !== 1) {
		const a = transaction.value.toLocaleString('en-US', {
			minimumFractionDigits: 0,
			maximumFractionDigits: 4
		});
		return `${sent ? '-' : '+'}${convertExponentialToDecimal(a)}`;
	}
};

const getAbrDateFromTimestamp = timestamp => {
	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	const leadingZero = num => `0${num}`.slice(-2);
	const date = new Date(timestamp);
	const year = date.getFullYear();
	const month = monthNames[date.getMonth()];
	const day = date.getDate();
	const hours = leadingZero(date.getHours());
	const minutes = leadingZero(date.getMinutes());
	return { year, month, day, hours, minutes };
};

const paginate = (array, pageSize, pageNumber) => {
	return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
};

const filterTransactionByToken = (transaction, token) => {
	let valid = false;
	switch (token) {
		case 'KI':
			valid = transaction.tokenSymbol === config.constants.primaryToken;
			break;
		case 'KEY':
			valid = transaction.tokenSymbol === config.constants.primaryToken;
			break;
		case 'ETH':
			valid = transaction.contractAddress === null;
			break;
		default:
			// Custom Tokens
			valid =
				transaction.tokenSymbol !== config.constants.primaryToken &&
				transaction.contractAddress !== null;
	}
	return valid;
};

class TransactionsHistory extends PureComponent {
	state = {
		rowsPerPage: 4,
		page: 0
	};

	componentDidMount() {
		this.loadData();
	}

	loadData = () => {
		this.props.dispatch(transactionHistoryOperations.loadTransactionsOperation());
	};

	handleRefresh = () => {
		this.setState({ page: 0 });
		this.props.dispatch(transactionHistoryOperations.reloadTransactionsOperation());
	};

	hasSent = transaction => {
		const address = this.props.wallet.address || '';
		return transaction.from.toLowerCase() === address.toLowerCase();
	};

	handleAllTransactions = () => {
		this.props.dispatch(push('/main/transactions-history'));
	};

	renderDate(timestamp) {
		const { year, month, day } = getAbrDateFromTimestamp(timestamp);
		return (
			<div>
				{day} {month} {year}
			</div>
		);
	}

	render() {
		const { classes, cryptoCurrency, processing } = this.props;
		const transactions = cryptoCurrency
			? this.props.transactions.filter(transaction =>
					filterTransactionByToken(transaction, cryptoCurrency)
			  )
			: this.props.transactions;
		const { rowsPerPage, page } = this.state;

		return (
			<Grid container alignItems="center" spacing={2}>
				<Grid item xs={12}>
					<Grid container justify="space-between" alignItems="center">
						<div>
							<Typography variant="h1" className={classes.title}>
								Transactions
							</Typography>
						</div>
						<div className={classes.iconWrap}>
							<IconButton
								label="Filter"
								title="Filter"
								disabled={processing}
								onClick={this.handleAllTransactions}
							>
								<FilterIcon />
							</IconButton>
							<IconButton
								aria-label="Refresh"
								title="Refresh"
								onClick={this.handleRefresh}
								disabled={processing}
							>
								<RefreshIcon className={processing ? classes.iconDisabled : null} />
							</IconButton>
						</div>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					{processing ? (
						<React.Fragment>
							<span className={classes.loading}>
								<CircularProgress size={20} />
							</span>
							<span id="searching" className={classes.searching}>
								Please wait. Checking the blockchain for transactions history
								information.
							</span>
						</React.Fragment>
					) : transactions.length > 0 ? (
						<Table>
							<TableBody>
								{paginate(transactions, rowsPerPage, page).map(transaction => {
									return (
										<TableRow key={transaction.id} className={classes.tableRow}>
											<TableCell className={classes.narrowCell}>
												{getIconForTransaction(
													transaction.isError,
													this.hasSent(transaction)
												)}
											</TableCell>
											<TableCell className={classes.smallPadding}>
												<Typography component="span" variant="h6">
													{transaction.statusText ||
														getCustomStatusText(
															transaction,
															this.hasSent(transaction)
														)}
												</Typography>
												<Typography
													component="span"
													variant="subtitle2"
													color="secondary"
												>
													{this.renderDate(transaction.timeStamp)}
												</Typography>
											</TableCell>
											<TableCell align="right">
												<Typography component="span" variant="h6">
													{getCustomValue(
														transaction,
														this.hasSent(transaction)
													)}
												</Typography>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
							{transactions.length > 4 ? (
								<TableFooter className={classes.tableFooter}>
									<TableRow className={classes.transparent}>
										<TableCell colSpan={3} align="center">
											<Button
												className={classes.moreTransactions}
												onClick={this.handleAllTransactions}
											>
												<DropdownIcon />
												<Typography variant="overline" color="secondary">
													View All Transactions
												</Typography>
											</Button>
										</TableCell>
									</TableRow>
								</TableFooter>
							) : (
								''
							)}
						</Table>
					) : (
						<Typography variant="body2">
							You {"don't"} have any transactions yet.
						</Typography>
					)}
				</Grid>
			</Grid>
		);
	}
}
const mapStateToProps = (state, props) => {
	return {
		transactions: transactionHistorySelectors.selectTransactionHistory(state).transactions,
		processing: transactionHistorySelectors.selectTransactionHistory(state).processing,
		wallet: walletSelectors.getWallet(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(TransactionsHistory));
