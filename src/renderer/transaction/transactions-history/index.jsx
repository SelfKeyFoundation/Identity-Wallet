import React, { Component } from 'react';
import config from 'common/config';
import {
	transactionHistoryOperations,
	transactionHistorySelectors
} from 'common/transaction-history';
import { TX_HISTORY_API_ENDPOINT } from 'main/blockchain/tx-history-service';
import { connect } from 'react-redux';
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

const getCryptoType = transaction => {
	if (transaction.tokenSymbol === config.constants.primaryToken) {
		return 'KEY';
	} else if (transaction.contractAddress === null) {
		return 'ETH';
	} else {
		return 'CUSTOM';
	}
};

const getCustomStatusText = transaction => {
	let cryptoType = getCryptoType(transaction);
	if (transaction.sending) {
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
	return { year, month, day };
};

const paginate = (array, pageSize, pageNumber) => {
	return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
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

	renderDate(timestamp) {
		const { year, month, day } = getAbrDateFromTimestamp(timestamp);
		return (
			<div>
				{day} {month} {year}
			</div>
		);
	}

	render() {
		const { transactions, classes } = this.props;
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
											transaction.sending
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
												getCustomStatusText(transaction)}
										</Typography>
									</TableCell>
									<TableCell align="right">
										<Typography component="span" variant="body2" gutterBottom>
											{transaction.sending ? '- ' : '+ '}
											{transaction.value
												? transaction.value.toLocaleString()
												: ''}
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
		transactions: transactionHistorySelectors.selectTransactionHistory(state).transactions
	};
};

export default connect(mapStateToProps)(withStyles(styles)(TransactionsHistory));
