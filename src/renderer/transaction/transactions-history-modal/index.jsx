import React, { PureComponent } from 'react';
import {
	transactionHistoryOperations,
	transactionHistorySelectors
} from 'common/transaction-history';
import { walletSelectors } from 'common/wallet';
import { connect } from 'react-redux';
import config from 'common/config';
import { featureIsEnabled } from 'common/feature-flags';
import { TX_HISTORY_API_ENDPOINT } from 'main/blockchain/tx-history-service';
import {
	Grid,
	Table,
	Typography,
	TableBody,
	TableRow,
	TableCell,
	CircularProgress,
	TableHead,
	TableFooter,
	TablePagination,
	IconButton,
	Select,
	MenuItem,
	Input,
	FormControl
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
	HourGlassIcon,
	FailedIcon,
	ReceivedRoundedIcon,
	SentRoundedIcon,
	BackButton,
	LargeTableHeadRow,
	CopyIcon,
	ViewIcon,
	KeyPicker
} from 'selfkey-ui';
import { convertExponentialToDecimal } from 'common/utils/exponential-to-decimal';
import { push } from 'connected-react-router';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { KeyboardArrowDown } from '@material-ui/icons';

const styles = theme => ({
	iconSpacing: {
		marginRight: '7px'
	},
	toolbar: {
		justifyContent: 'space-between'
	},
	rightSpace: {
		marginRight: '20px'
	},
	narrowCell: {
		padding: 0,
		textAlign: 'center'
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
	lastCell: {
		marginRight: 0,
		maxWidth: '110px'
	},
	container: {
		border: '1px solid #384656',
		borderRadius: '4px',
		margin: '50px auto 0',
		maxWidth: '960px',
		width: '100%'
	},
	title: {
		background: '#2A3540',
		borderRadius: '4px 4px 0 0',
		padding: '22px 30px'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px'
	},
	content: {
		background: '#262F39',
		borderRadius: '0 0 4px 4px',
		boxSizing: 'border-box',
		justifyContent: 'flex-start',
		margin: 0,
		padding: '22px 30px',
		width: '100%'
	},
	tableRow: {
		'& td': {
			padding: '20px 10px'
		}
	},
	filterInput: {
		width: '290px'
	},
	iconButton: {
		transition: 'all 0.2s ease-out',
		'&:hover': {
			'& h6': {
				transition: 'all 0.2s ease-in-out',
				color: 'white'
			},
			'& svg': {
				transition: 'all 0.2s ease-out',
				fill: 'white'
			}
		}
	},
	dropdown: {
		width: '250px'
	}
});

const emptyTableStyle = theme => ({
	tableRow: {
		backgroundColor: 'transparent',
		'& .tableCell': {
			textAlign: 'center'
		}
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
		return `${sent ? (a !== '0' ? '-' : '') : '+'}${convertExponentialToDecimal(a)}`;
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

export const EmptyTableStatus = withStyles(emptyTableStyle)(({ classes }) => {
	return (
		<TableRow className={classes.tableRow}>
			<TableCell colSpan="6" className="tableCell">
				<Typography variant="body1" color="secondary">
					You`ll see here all your transactions.
				</Typography>
			</TableCell>
		</TableRow>
	);
});

class TransactionsHistoryModal extends PureComponent {
	state = {
		option: -1,
		rowsPerPage: 10,
		page: 0
	};

	componentDidMount() {
		this.loadData();
		window.scrollTo(0, 0);
	}

	loadData = () => {
		this.props.dispatch(transactionHistoryOperations.loadTransactionsOperation());
	};

	handleBackClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push('/main/dashboard'));
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

	handleOptionSelection = event => {
		this.setState({ option: event.target.value });
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
		const { rowsPerPage, page, option } = this.state;

		return (
			<Grid container>
				<Grid item>
					<BackButton onclick={this.handleBackClick} />
				</Grid>
				<Grid item className={classes.container}>
					<Grid
						container
						justify="flex-start"
						alignItems="flex-start"
						className={classes.title}
					>
						<Typography variant="body1">Transactions</Typography>
					</Grid>
					{featureIsEnabled('transactionsListFilter') ? (
						<Grid
							container
							justify="flex-start"
							alignItems="stretch"
							wrap="nowrap"
							spacing={40}
							className={classes.content}
						>
							<Grid
								container
								direction="column"
								style={{ width: '290px', marginRight: '30px' }}
							>
								<Typography
									variant="overline"
									className={classes.label}
									gutterBottom
								>
									Transaction Type
								</Typography>
								<FormControl variant="filled" fullWidth>
									<Select
										value={option}
										displayEmpty
										onChange={this.handleOptionSelection}
										disableUnderline
										IconComponent={KeyboardArrowDown}
										input={<Input disableUnderline fullWidth />}
										autoWidth
										className={classes.filterInput}
									>
										<MenuItem value={-1} className={classes.dropdown}>
											<em>Choose...</em>
										</MenuItem>
										{['sent', 'buy', 'receive'].map(option => (
											<MenuItem key={option} value={option}>
												{option}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>

							<Grid container direction="column" style={{ width: '290px' }}>
								<Typography
									variant="overline"
									className={classes.label}
									gutterBottom
								>
									Date
								</Typography>
								<KeyPicker id="creationDate" required />
							</Grid>
						</Grid>
					) : (
						''
					)}
					<Grid
						container
						direction="column"
						justify="flex-start"
						wrap="nowrap"
						alignItems="stretch"
						spacing={40}
						className={classes.content}
					>
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
							<Table>
								<TableHead>
									<LargeTableHeadRow>
										<TableCell />
										<TableCell className={classes.smallPadding}>
											<Typography variant="overline">Transaction</Typography>
										</TableCell>
										<TableCell className={classes.smallPadding}>
											<Typography variant="overline">Value</Typography>
										</TableCell>
										<TableCell className={classes.smallPadding}>
											<Typography variant="overline">Date</Typography>
										</TableCell>
										<TableCell className={classes.smallPadding}>
											<Typography variant="overline">Actions</Typography>
										</TableCell>
									</LargeTableHeadRow>
								</TableHead>
								<TableBody>
									{transactions.length > 0 ? (
										paginate(transactions, rowsPerPage, page).map(
											transaction => {
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
															<Typography variant="h6">
																{transaction.statusText ||
																	getCustomStatusText(
																		transaction,
																		this.hasSent(transaction)
																	)}
															</Typography>
														</TableCell>
														<TableCell>
															<Typography variant="h6">
																{getCustomValue(
																	transaction,
																	this.hasSent(transaction)
																)}{' '}
																{transaction.tokenSymbol}
															</Typography>
														</TableCell>
														<TableCell>
															<Typography variant="h6">
																{this.renderDate(
																	transaction.timeStamp
																)}
															</Typography>
														</TableCell>
														<TableCell className={classes.lastCell}>
															<IconButton
																className={`${classes.rightSpace} ${
																	classes.iconButton
																}`}
															>
																<CopyToClipboard
																	text={`${TX_HISTORY_API_ENDPOINT}/${
																		transaction.hash
																	}`}
																>
																	<Grid container>
																		<CopyIcon
																			className={
																				classes.iconSpacing
																			}
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
																className={classes.iconButton}
																onClick={e => {
																	window.openExternal(
																		e,
																		`${TX_HISTORY_API_ENDPOINT}/${
																			transaction.hash
																		}`
																	);
																}}
															>
																<ViewIcon
																	className={classes.iconSpacing}
																/>
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
											}
										)
									) : (
										<EmptyTableStatus />
									)}
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

export default connect(mapStateToProps)(withStyles(styles)(TransactionsHistoryModal));
