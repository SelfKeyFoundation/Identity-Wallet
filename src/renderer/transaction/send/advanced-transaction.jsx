import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { TransactionBox } from '../common/transaction-box';
import { ethGasStationInfoOperations, ethGasStationInfoSelectors } from 'common/eth-gas-station';
import { transactionOperations, transactionSelectors } from 'common/transaction';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { withStyles } from '@material-ui/styles';
import {
	MenuItem,
	Select,
	Input,
	Tabs,
	Tab,
	Grid,
	Button,
	Typography,
	Divider,
	FormControl
} from '@material-ui/core';
import { appOperations, appSelectors } from 'common/app';
import { push } from 'connected-react-router';
import { debounce, over } from 'lodash';
import { InputTitle } from '../../common/input-title';
import { getWallet } from 'common/wallet/selectors';
import ReceiveTokenTab from './containers/receive-token-tab';
// import SendTokenTab from './containers/send-token-tab';
import { NumberFormat, TransactionFeeBox, SelectDropdownIcon } from 'selfkey-ui';

const styles = theme => ({
	balance: {
		color: '#fff',
		fontWeight: 'bold'
	},
	selectAllAmountBtn: {
		backgroundColor: '#202932',
		border: '1px solid #303C49',
		borderRadius: '4px',
		boxSizing: 'border-box',
		color: '#A9C5D6',
		cursor: 'pointer',
		fontSize: '13px',
		fontWeight: 500,
		height: '37px',
		lineHeight: '16px',
		width: '37px'
	},
	actionButtonsContainer: {
		paddingTop: theme.spacing(6)
	},
	errorColor: {
		backgroundColor: 'rgba(255,46,99,0.09) !important',
		border: '2px solid #FE4B61 !important',
		boxShadow: 'none !important',
		color: '#FE4B61 !important'
	},
	amountContainer: {
		paddingTop: theme.spacing(3),
		position: 'relative'
	},
	cryptoCurrencyText: {
		color: '#ffffff',
		fontSize: '20px',
		fontWeight: 600,
		right: 0,
		position: 'absolute'
	},
	usdAmoutContainer: {
		color: '#ffffff',
		paddingBottom: theme.spacing(8),
		'&& span': {
			'&:first-of-type': {
				fontSize: '40px',
				fontWeight: 300
			},
			'&:last-of-type': {
				fontSize: '20px',
				fontWeight: 600
			}
		}
	},
	amountInput: {
		border: 'none',
		margin: theme.spacing(0),
		padding: theme.spacing(0),
		width: 'calc(100% - 45px)'
	},
	addressErrorText: {
		color: '#FE4B61',
		fontFamily: 'Lato',
		fontSize: '13px',
		height: '19px',
		lineHeight: '19px',
		width: '242px'
	},
	addressErrorColor: {
		borderBottom: '2px solid #FE4B61',
		color: '#FE4B61'
	},
	divider: {
		margin: theme.spacing(5, 0)
	},
	cryptoSelect: {
		width: '100%'
	},
	selectItem: {
		backgroundColor: '#1E262E',
		border: 0,
		color: '#fff'
	},
	amountBottomSpace: {
		marginBottom: theme.spacing(4)
	},
	tokenBottomSpace: {
		marginBottom: theme.spacing(3)
	},
	flexColumn: {
		flexDirection: 'column'
	},
	fiatPrice: {
		display: 'flex',
		marginTop: theme.spacing(1)
	},
	amount: {
		marginRight: theme.spacing(3)
	},
	errorText: {
		color: '#FE4B61',
		fontFamily: 'Lato',
		fontSize: '13px',
		height: '19px',
		lineHeight: '19px',
		width: '242px'
	},
	tabs: {
		marginBottom: theme.spacing(6)
	},

	cryptoIcon: {
		marginRight: theme.spacing(3)
	},
	cryptoSymbol: {
		fontSize: '14px',
		fontWeight: 'normal'
	},
	modalWrap: {
		backgroundColor: 'transparent',
		border: 'none'
	},
	modalContentWrapper: {
		boxShadow: 'none',
		marginBottom: theme.spacing(3)
	},
	closeIcon: {
		'& svg': {
			position: 'relative',
			top: '20px'
		}
	},
	bottomSpace: {
		marginBottom: theme.spacing(3)
	},
	tokenMax: {
		display: 'flex',
		flexWrap: 'nowrap'
	},
	tabsWrap: {
		'& .feeTitle': {
			display: 'table',
			marginBottom: theme.spacing(1)
		}
	}
});

class TransactionSendBoxContainer extends PureComponent {
	static UPDATE_DELAY = 1000;

	state = {
		amount: '',
		address: '',
		cryptoCurrency: this.props.match.params.cryptoCurrency,
		sending: false,
		sendingAddress: this.props.match.params.sendingAddress,
		tab: 'send'
	};

	componentDidMount() {
		this.loadData();

		let { trezorAccountIndex, cryptoCurrency } = this.props;
		this.props.dispatch(transactionOperations.init({ trezorAccountIndex, cryptoCurrency }));
	}

	loadData = () => {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
	};

	onTabChange = tab => this.setState({ tab });

	handleSend = async () => {
		this.setState({ sending: true });
	};

	handleCancelAction = () => {
		this.props.dispatch(push(`/main/dashboard`));
	};

	handleGasLimitChange = debounce(
		value => this.props.dispatch(transactionOperations.setLimitPrice(value)),
		TransactionSendBoxContainer.UPDATE_DELAY
	);

	handleGasPriceChange = debounce(
		value => this.props.dispatch(transactionOperations.setGasPrice(value)),
		TransactionSendBoxContainer.UPDATE_DELAY
	);

	lockTransaction = () => this.props.dispatch(transactionOperations.setLocked(true));

	withLock = targetFunction => over([this.lockTransaction, targetFunction]);

	handleConfirm = async () => {
		await this.props.dispatch(appOperations.setGoBackPath(this.props.location.pathname));
		await this.props.dispatch(transactionOperations.confirmSend());
		if (this.props.walletType === 'ledger' || this.props.walletType === 'trezor') {
			await this.props.dispatch(push('/main/hd-transaction-timer'));
			await this.props.dispatch(appOperations.setGoNextPath('/main/hd-transaction-timer'));
		}
	};

	handleCancel = () => {
		this.setState({ sending: false });
	};

	// TransactionSendBox - Start
	handleAllAmountClick = () => {
		const value = String(this.props.balance);
		this.setState({
			...this.state,
			amount: value
		});
		this.props.dispatch(transactionOperations.setAmount(value));
	};

	handleAddressChange = event => {
		const value = event.target.value;
		this.setState({
			...this.state,
			address: value
		});
		this.props.dispatch(transactionOperations.setAddress(value));
	};

	handleAmountChange = event => {
		let value = event.target.value;
		if (isNaN(Number(value))) {
			value = '';
		}
		// Do not allow to enter values above the balance
		if (Number(value) > this.props.balance) {
			value = String(this.props.balance);
		}
		this.setState({
			...this.state,
			amount: value
		});
		this.props.dispatch(transactionOperations.setAmount(value));
	};

	handleCryptoCurrencyChange = event => {
		const value = event.target.value;
		const nullAmount = 0;
		this.setState({
			...this.state,
			amount: nullAmount,
			cryptoCurrency: value
		});
		this.props.dispatch(transactionOperations.setCryptoCurrency(value));
		this.props.dispatch(transactionOperations.setAmount(nullAmount));
	};

	renderSelectTokenItems() {
		const { tokens, classes } = this.props;

		let activeTokens = tokens.filter(token => {
			return token.recordState === 1;
		});

		return activeTokens.map(token => {
			return (
				<MenuItem
					key={token.symbol}
					value={token.symbol}
					className={classes.selectItem}
				>{`${token.symbol} - ${token.name}`}</MenuItem>
			);
		});
	}

	renderButtons() {
		const { classes, addressError, address, ethFee, locked } = this.props;
		const { sending, amount } = this.state;
		const sendBtnIsEnabled = address && +amount && !addressError && ethFee && !locked;

		if (sending) {
			return (
				<Grid
					container
					direction="row"
					justify="center"
					alignItems="center"
					className={classes.actionButtonsContainer}
					spacing={3}
				>
					<Grid item>
						<Button variant="contained" size="large" onClick={this.handleConfirm}>
							CONFIRM
						</Button>
					</Grid>
					<Grid item>
						<Button variant="outlined" size="large" onClick={this.handleCancel}>
							CANCEL
						</Button>
					</Grid>
				</Grid>
			);
		} else {
			return (
				<Grid
					container
					direction="row"
					justify="center"
					alignItems="center"
					className={classes.actionButtonsContainer}
				>
					<Grid item>
						<Button
							disabled={!sendBtnIsEnabled}
							className={classes.button}
							onClick={this.handleSend}
							variant="contained"
							size="large"
						>
							SEND
						</Button>
					</Grid>
				</Grid>
			);
		}
	}

	render() {
		const {
			classes,
			sendingAddress,
			locale,
			fiatCurrency,
			amountUsd,
			addressError
		} = this.props;
		let { cryptoCurrency } = this.state;
		const title = 'Send/Receive ERC-20 Tokens';
		const labelInputClass = `${addressError ? classes.errorColor : ''}`;
		return (
			<TransactionBox closeAction={this.handleCancelAction} title={title}>
				<div className={classes.tokenBottomSpace}>
					<FormControl variant="filled" fullWidth>
						<InputTitle title="Token" />
						<Select
							className={classes.cryptoSelect}
							value={this.state.cryptoCurrency}
							onChange={e => this.handleCryptoCurrencyChange(e)}
							name="cryptoCurrency"
							disableUnderline
							displayEmpty
							IconComponent={SelectDropdownIcon}
							input={<Input disableUnderline />}
						>
							<MenuItem value="custom">
								<Typography
									className="choose"
									variant="subtitle1"
									color="textSecondary"
								>
									Choose...
								</Typography>
							</MenuItem>
							{this.renderSelectTokenItems()}
						</Select>
					</FormControl>
				</div>
				{this.state.cryptoCurrency !== 'custom' ? (
					<div className={classes.tabsWrap}>
						<Tabs
							value={this.state.tab}
							onChange={(evt, value) => this.onTabChange(value)}
							className={classes.tabs}
						>
							<Tab id="send" value="send" label="Send" />
							<Tab id="receive" value="receive" label="Receive" />
						</Tabs>
						{this.state.tab === 'send' && (
							<React.Fragment>
								<div className={classes.bottomSpace}>
									<Typography variant="body2" color="secondary">
										Available:{' '}
										<span className={classes.balance}>
											{this.props.balance}{' '}
											{cryptoCurrency !== 'custom' ? cryptoCurrency : ''}
										</span>
									</Typography>
								</div>
								<div className={classes.amountBottomSpace}>
									<InputTitle
										title={`Amount${
											cryptoCurrency !== 'custom'
												? ` (${cryptoCurrency})`
												: ''
										}`}
									/>
									<div className={classes.tokenMax}>
										<Input
											type="text"
											onChange={this.handleAmountChange}
											value={`${this.state.amount}`}
											placeholder="0.00"
											className={classes.amount}
											fullWidth
										/>
										<Button
											onClick={this.handleAllAmountClick}
											variant="outlined"
											size="large"
										>
											Max
										</Button>
									</div>
									<div className={classes.fiatPrice}>
										<Typography
											variant="subtitle2"
											color="secondary"
											style={{ marginRight: '3px' }}
										>
											<NumberFormat
												locale={locale}
												priceStyle="currency"
												currency={fiatCurrency}
												value={amountUsd}
												fractionDigits={15}
											/>
										</Typography>
										<Typography variant="subtitle2" color="secondary">
											USD
										</Typography>
									</div>
								</div>

								<div>
									<InputTitle title="Send to" />
									<div className={`${classes.tokenMax} ${classes.flexColumn}`}>
										<Input
											type="text"
											onChange={this.handleAddressChange}
											value={this.state.address}
											placeholder="0x"
											className={labelInputClass}
											fullWidth
										/>
									</div>
								</div>
								{addressError && (
									<span id="labelError" className={classes.errorText}>
										Invalid address. Please check and try again.
									</span>
								)}
								<Divider className={classes.divider} />

								<TransactionFeeBox
									changeGasLimitAction={this.withLock(this.handleGasLimitChange)}
									changeGasPriceAction={this.withLock(this.handleGasPriceChange)}
									reloadEthGasStationInfoAction={this.loadData}
									{...this.props}
								/>
								{this.renderButtons()}
							</React.Fragment>
						)}
						{this.state.tab === 'receive' && (
							<ReceiveTokenTab
								sendingAddress={sendingAddress}
								cryptoCurrency={cryptoCurrency}
							/>
						)}
					</div>
				) : (
					''
				)}
			</TransactionBox>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		...getLocale(state),
		...getFiatCurrency(state),
		...ethGasStationInfoSelectors.getEthGasStationInfo(state),
		...transactionSelectors.getTransaction(state),
		sendingAddress: getWallet(state).address,
		tokens: getTokens(state),
		cryptoCurrency: props.match.params.cryptoCurrency,
		confirmation: props.match.params.confirmation,
		walletType: appSelectors.selectWalletType(state)
	};
};

const styledComponent = withStyles(styles)(TransactionSendBoxContainer);
export default connect(mapStateToProps)(styledComponent);
