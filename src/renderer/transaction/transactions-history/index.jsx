import React, { Component } from 'react';
import {
	transactionHistoryOperations,
	transactionHistorySelectors
} from 'common/transaction-history';
import { walletSelectors } from 'common/wallet';
import { TX_HISTORY_API_ENDPOINT } from 'main/blockchain/tx-history-service';
import { connect } from 'react-redux';
import config from 'common/config';
import {
	Grid,
	Table,
	Typography,
	TableBody,
	IconButton,
	TableRow,
	TableCell,
	TableFooter,
	TablePagination,
	Paper,
	Divider,
	CircularProgress
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
	RefreshIcon,
	HourGlassIcon,
	HourGlassSmallIcon,
	ViewIcon,
	FailedIcon,
	ReceiveIcon,
	SentIcon,
	CopyIcon
} from 'selfkey-ui';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { convertExponentialToDecimal } from 'common/utils/exponential-to-decimal';

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

	paper: {
		backgroundColor: '#262F39',
		boxShadow: 'none',
		boxSizing: 'border-box',
		padding: '16px 30px'
	},

	tableRow: {
		backgroundColor: 'transparent !important',
		borderBottom: '1px solid #303C49'
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
		justifyContent: 'flex-end'
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
	}
});

const getIconForTransaction = (isError, sent) => {
	switch (isError) {
		case 1:
			return <FailedIcon />;
		case undefined:
			return <HourGlassIcon />;
		default:
			return sent ? <SentIcon /> : <ReceiveIcon />;
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
		return `${sent ? '-' : '+'}${convertExponentialToDecimal(transaction.value)}`;
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

class TransactionsHistory extends Component {
	state = {
		rowsPerPage: 10,
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

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = (event, rowsPerPage) => {
		this.setState({ rowsPerPage: rowsPerPage.props.value });
	};

	hasSent = transaction => {
		const address = this.props.wallet.address || '';
		return transaction.from.toLowerCase() === address.toLowerCase();
	};

	renderDate(timestamp) {
		const { year, month, day, hours, minutes } = getAbrDateFromTimestamp(timestamp);
		return (
			<div>
				{day} {month} {year} {hours}:{minutes}
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
			<Paper className={classes.paper}>
				<Grid container alignItems="center" spacing={16}>
					<Grid item xs={12}>
						<Grid container justify="space-between" alignItems="center">
							<Grid item xs={11}>
								<Typography variant="h1" className={classes.title}>
									Transactions
								</Typography>
							</Grid>
							<Grid item xs={1} className={classes.iconWrap}>
								<IconButton
									aria-label="Refresh"
									onClick={this.handleRefresh}
									disabled={processing}
								>
									{processing ? <HourGlassSmallIcon /> : <RefreshIcon />}
								</IconButton>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Divider />
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
						) : (
							<Table className={classes.bottomSpace}>
								<TableBody>
									{paginate(transactions, rowsPerPage, page).map(transaction => {
										return (
											<TableRow
												key={transaction.id}
												className={classes.tableRow}
											>
												<TableCell className={classes.narrowCell}>
													{getIconForTransaction(
														transaction.isError,
														this.hasSent(transaction)
													)}
												</TableCell>
												<TableCell className={classes.smallPadding}>
													<Typography component="span" variant="body2">
														{this.renderDate(transaction.timeStamp)}
													</Typography>
												</TableCell>
												<TableCell>
													<Typography component="span" variant="body2">
														{transaction.statusText ||
															getCustomStatusText(
																transaction,
																this.hasSent(transaction)
															)}
													</Typography>
												</TableCell>
												<TableCell align="right">
													<Typography component="span" variant="body2">
														{getCustomValue(
															transaction,
															this.hasSent(transaction)
														)}
													</Typography>
												</TableCell>
												<TableCell
													align="right"
													className={classes.zeroRightPadding}
												>
													<IconButton className={classes.rightSpace}>
														<CopyToClipboard
															text={`${TX_HISTORY_API_ENDPOINT}/${
																transaction.hash
															}`}
														>
															<Grid container>
																<CopyIcon
																	className={classes.iconSpacing}
																/>
																<Typography
																	variant="subtitle1"
																	color="secondary"
																>
																	Copy
																</Typography>
															</Grid>
														</CopyToClipboard>
													</IconButton>
													<IconButton
														onClick={e => {
															window.openExternal(
																e,
																`${TX_HISTORY_API_ENDPOINT}/${
																	transaction.hash
																}`
															);
														}}
													>
														<ViewIcon className={classes.iconSpacing} />
														<Typography
															variant="subtitle1"
															color="secondary"
														>
															View
														</Typography>
													</IconButton>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
								<TableFooter>
									<TableRow className={classes.transparent}>
										<TablePagination
											count={transactions.length}
											page={page}
											onChangePage={this.handleChangePage}
											rowsPerPage={rowsPerPage}
											onChangeRowsPerPage={this.handleChangeRowsPerPage}
											backIconButtonProps={{
												'aria-label': 'Previous Page'
											}}
											nextIconButtonProps={{
												'aria-label': 'Next Page'
											}}
										/>
									</TableRow>
								</TableFooter>
							</Table>
						)}
					</Grid>
				</Grid>
			</Paper>
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
