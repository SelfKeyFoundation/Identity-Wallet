import React, { Component } from 'react';
import config from 'common/config';
import {
	transactionHistoryOperations,
	transactionHistorySelectors
} from 'common/transaction-history';
import { connect } from 'react-redux';
import {
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

class TransactionsHistory extends Component {
	state = {
		page: 0
	};

	componentDidMount() {
		this.props.dispatch(transactionHistoryOperations.loadTransactionsOperation());
	}

	handleChangePage = (event, page) => {
		this.setState({ page });
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
		const { transactions } = this.props;
		const { page } = this.state;
		return (
			<Paper>
				<Toolbar>
					<Typography variant="h6">Transactions</Typography>
					<IconButton aria-label="Refresh">
						<RefreshIcon />
					</IconButton>
				</Toolbar>
				<Table>
					<TableBody>
						{transactions.slice(page).map(transaction => {
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
										<IconButton>
											<CopyToClipboard
												text={`https://ropsten.etherscan.io/tx/${
													transaction.hash
												}`}
											>
												<div>
													<CopyIcon />
													<Typography
														variant="subtitle1"
														color="secondary"
														gutterBottom
													>
														Copy
													</Typography>
												</div>
											</CopyToClipboard>
										</IconButton>
									</TableCell>
									<TableCell align="right">
										<IconButton
											onClick={e => {
												window.openExternal(
													e,
													`https://ropsten.etherscan.io/tx/${
														transaction.hash
													}`
												);
											}}
										>
											<ViewIcon />
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
								backIconButtonProps={{
									'aria-label': 'Previous Page'
								}}
								nextIconButtonProps={{
									'aria-label': 'Next Page'
								}}
								onChangePage={this.handleChangePage}
								rowsPerPage={10}
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

export default connect(mapStateToProps)(TransactionsHistory);
