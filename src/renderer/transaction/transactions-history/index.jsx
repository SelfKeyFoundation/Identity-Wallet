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
	Toolbar,
	Typography,
	TableBody,
	IconButton,
	TableRow,
	TableCell,
	TableFooter,
	TablePagination,
	Paper
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
	RefreshIcon,
	HourGlassIcon,
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
		boxShadow: 'none'
	}
});

const getIconForTransaction = (statusIconName, sent) => {
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
			return sent ? <SentIcon /> : <ReceiveIcon />;
	}
};

const getCryptoType = transaction => {
	if (transaction.contractAddress === null) {
		return 'ETH';
	} else {
		return transaction.tokenSymbol;
	}
};

const getCustomStatusText = (transaction, sent) => {
	let cryptoType = getCryptoType(transaction);
	if (sent) {
		return `Sent ${cryptoType}`;
	} else {
		return `Received ${cryptoType}`;
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
	const date = new Date(timestamp);
	const year = date.getFullYear();
	const month = monthNames[date.getMonth()];
	const day = date.getDate();
	const hours = date.getHours();
	const minutes = date.getMinutes();
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
		this.loadData();
	};

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = (event, rowsPerPage) => {
		this.setState({ rowsPerPage: rowsPerPage.props.value });
	};

	hasSent = transaction => {
		const publicKey = this.props.wallet.publicKey || '';
		return transaction.from.toLowerCase() === publicKey.toLowerCase();
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
		const { classes, cryptoCurrency } = this.props;
		const transactions = cryptoCurrency
			? this.props.transactions.filter(transaction =>
					filterTransactionByToken(transaction, cryptoCurrency)
			  )
			: this.props.transactions;
		const { rowsPerPage, page } = this.state;

		return (
			<Paper className={classes.paper}>
				<Toolbar className={classes.toolbar}>
					<Typography variant="h1">Transactions</Typography>
					<IconButton aria-label="Refresh" onClick={this.handleRefresh}>
						<RefreshIcon />
					</IconButton>
				</Toolbar>
				<Table>
					<TableBody>
						{paginate(transactions, rowsPerPage, page).map(transaction => {
							return (
								<TableRow key={transaction.id}>
									<TableCell>
										{getIconForTransaction(
											transaction.statusIconName,
											this.hasSent(transaction)
										)}
									</TableCell>
									<TableCell>
										<Typography
											component="span"
											variant="body2"
											color="secondary"
											gutterBottom
										>
											{this.renderDate(transaction.timeStamp)}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography component="span" variant="body2" gutterBottom>
											{transaction.statusText ||
												getCustomStatusText(
													transaction,
													this.hasSent(transaction)
												)}
										</Typography>
									</TableCell>
									<TableCell align="right">
										<Typography component="span" variant="body2" gutterBottom>
											{this.hasSent(transaction) ? '- ' : '+ '}
											{convertExponentialToDecimal(transaction.value)}
										</Typography>
									</TableCell>
									<TableCell align="right">
										<IconButton className={classes.rightSpace}>
											<CopyToClipboard
												text={`${TX_HISTORY_API_ENDPOINT}/${
													transaction.hash
												}`}
											>
												<Grid container>
													<CopyIcon className={classes.iconSpacing} />
													<Typography
														variant="subtitle1"
														color="secondary"
														gutterBottom
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
													`${TX_HISTORY_API_ENDPOINT}/${transaction.hash}`
												);
											}}
										>
											<ViewIcon className={classes.iconSpacing} />
											<Typography
												variant="subtitle1"
												color="secondary"
												gutterBottom
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
						<TableRow>
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
			</Paper>
		);
	}
}
const mapStateToProps = (state, props) => {
	return {
		transactions: transactionHistorySelectors.selectTransactionHistory(state).transactions,
		wallet: walletSelectors.getWallet(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(TransactionsHistory));
