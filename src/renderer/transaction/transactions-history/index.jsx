import React, { Component } from 'react';
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
	Button,
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

class TransactionsHistory extends Component {
	state = {
		page: 0,
		currentCopyValues: []
	};

	componentDidMount() {
		this.props.dispatch(transactionHistoryOperations.loadTransactionsOperation());
	}

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	renderIcon(statusIconName) {
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
		}
	}

	updateCopyText(index, text) {
		let currentCopyValuesClone = this.state.currentCopyValues.slice();
		currentCopyValuesClone[index] = text;
		this.setState({ currentCopyValues: currentCopyValuesClone });
	}

	handleOnCopy(itemIndex) {
		return () => {
			this.updateCopyText(itemIndex, this.copiedText);
			const bounceTime = setTimeout(() => {
				this.updateCopyText(itemIndex, this.copyText);
				clearTimeout(bounceTime);
			}, 1000);
		};
	}

	render() {
		const { transactions } = this.props;
		const { page, currentCopyValues } = this.state;
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
										{this.renderIcon(transaction.statusIconName)}
									</TableCell>
									<TableCell>{transaction.date}</TableCell>
									<TableCell>{transaction.statusText}</TableCell>
									<TableCell align="right">
										{transaction.cryptoCurrency}
									</TableCell>
									<TableCell align="right">
										<CopyToClipboard
											text={transaction.externalLink}
											onCopy={this.handleOnCopy(transaction.id)}
										>
											<div>
												<CopyIcon />
												<span>
													{' '}
													{currentCopyValues[transaction.id] ||
														this.copyText}{' '}
												</span>
											</div>
										</CopyToClipboard>
									</TableCell>
									<TableCell align="right">
										<Button size="small" disableRipple>
											<ViewIcon />
											View
										</Button>
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
