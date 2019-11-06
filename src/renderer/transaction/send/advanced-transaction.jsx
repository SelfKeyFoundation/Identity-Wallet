import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { TransactionFeeBox } from 'renderer/transaction/send/containers/transaction-fee-box';
import { NumberFormat } from 'selfkey-ui';
import { TransactionBox } from '../common/transaction-box';
import { ethGasStationInfoOperations, ethGasStationInfoSelectors } from 'common/eth-gas-station';
import { transactionOperations, transactionSelectors } from 'common/transaction';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Divider } from '@material-ui/core';
import { appOperations, appSelectors } from 'common/app';
import { push } from 'connected-react-router';
import { debounce, over } from 'lodash';

const styles = theme => ({
	container: {
		fontFamily: 'Lato, arial, sans-serif'
	},

	button: {
		boxSizing: 'border-box',
		height: '45px',
		width: '201px',
		border: '1px solid #0FB8D0',
		borderRadius: '4px',
		background: 'linear-gradient(0deg, #09A8BA 0%, #0ABBD0 100%)',
		color: '#FFFFFF',
		fontSize: '16px',
		fontWeight: 600,
		letterSpacing: '0.67px',
		lineHeight: '20px',
		textAlign: 'center',
		cursor: 'pointer',
		'&:disabled': {
			cursor: 'default',
			opacity: 0.7
		}
	},

	selectAllAmountBtn: {
		cursor: 'pointer',
		fontSize: '13px',
		fontWeight: 500,
		lineHeight: '16px',
		color: '#A9C5D6',
		boxSizing: 'border-box',
		height: '37px',
		width: '37px',
		border: '1px solid #303C49',
		borderRadius: '4px',
		backgroundColor: '#202932'
	},
	actionButtonsContainer: {
		paddingTop: '50px'
	},
	input: {
		outlineWidth: 0,
		backgroundColor: '#262f39',
		paddingBottom: '20px',
		marginBottom: '20px',
		width: '100%',
		border: 'none',
		borderBottom: '2px solid #93b0c1',
		fontSize: '20px',
		color: '#a9c5d6',
		'&::-webkit-input-placeholder': {
			fontSize: '20px',
			color: '#a9c5d6'
		}
	},
	inputError: {
		borderBottom: '2px solid #FE4B61 !important'
	},
	amountContainer: {
		paddingTop: '25px',
		position: 'relative'
	},
	cryptoCurrencyText: {
		position: 'absolute',
		fontSize: '20px',
		color: '#ffffff',
		right: 0,
		fontWeight: 600
	},
	usdAmoutContainer: {
		paddingBottom: '65px',
		color: '#ffffff',
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
		width: 'calc(100% - 45px)',
		border: 'none',
		margin: '0px',
		padding: '0px'
	},

	addressErrorText: {
		height: '19px',
		width: '242px',
		color: '#FE4B61',
		fontFamily: 'Lato',
		fontSize: '13px',
		lineHeight: '19px'
	},

	addressErrorColor: {
		color: '#FE4B61',
		borderBottom: '2px solid #FE4B61'
	},

	divider: {
		backgroundColor: 'transparent',
		borderBottom: '2px solid #93b0c1',
		paddingTop: '10px'
	},

	cryptoSelect: {
		height: '40px',
		width: '300px',
		color: '#FFFFFF',
		fontFamily: 'Lato',
		fontSize: '20px',
		lineHeight: '36px',
		backgroundColor: '#1E262E',
		border: '1px solid #384656',
		borderRadius: '30px',
		paddingLeft: '10px',
		paddingBottom: '10px'
	},

	selectItem: {
		border: 0,
		backgroundColor: '#1E262E',
		color: '#FFFFFF'
	}
});

class TransactionSendBoxContainer extends PureComponent {
	static UPDATE_DELAY = 1000;

	state = {
		amount: '',
		address: '',
		isCustomView: this.props.match.params.cryptoCurrency === 'custom',
		cryptoCurrency: this.props.match.params.cryptoCurrency,
		sending: false
	};

	componentDidMount() {
		this.loadData();

		let { trezorAccountIndex, cryptoCurrency } = this.props;
		this.props.dispatch(transactionOperations.init({ trezorAccountIndex, cryptoCurrency }));
	}

	loadData = () => {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
	};

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
	renderFeeBox() {
		return (
			<TransactionFeeBox
				{...this.props}
				changeGasLimitAction={this.withLock(this.handleGasLimitChange)}
				changeGasPriceAction={this.withLock(this.handleGasPriceChange)}
				reloadEthGasStationInfoAction={this.loadData}
			/>
		);
	}

	handleAllAmountClick() {
		const value = String(this.props.balance);
		this.setState({
			...this.state,
			amount: value
		});
		this.props.dispatch(transactionOperations.setAmount(value));
	}

	handleAddressChange(event) {
		const value = event.target.value;
		this.setState({
			...this.state,
			address: value
		});
		this.props.dispatch(transactionOperations.setAddress(value));
	}

	handleAmountChange(event) {
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
	}

	handleCryptoCurrencyChange(event) {
		const value = event.target.value;
		this.setState({
			...this.state,
			cryptoCurrency: value
		});
		this.props.dispatch(transactionOperations.setCryptoCurrency(value));
	}

	renderSelectTokenItems() {
		const { tokens, classes } = this.props;

		let activeTokens = tokens.filter(token => {
			return token.recordState === 1;
		});

		return activeTokens.map(token => {
			return (
				<option key={token.symbol} value={token.symbol} className={classes.selectItem}>{`${
					token.name
				} - ${token.balance} ${token.symbol}`}</option>
			);
		});
	}

	renderButtons() {
		const { classes, addressError, ethFee, locked } = this.props;
		const sendBtnIsEnabled =
			this.state.address && +this.state.amount && !addressError && ethFee && !locked;

		if (this.state.sending) {
			return (
				<Grid
					container
					direction="row"
					justify="center"
					alignItems="center"
					className={classes.actionButtonsContainer}
					spacing={24}
				>
					<Grid item>
						<button className={classes.button} onClick={this.handleConfirm}>
							CONFIRM
						</button>
					</Grid>
					<Grid item>
						<button className={classes.button} onClick={this.handleCancel}>
							CANCEL
						</button>
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
						<button
							disabled={!sendBtnIsEnabled}
							className={classes.button}
							onClick={this.handleSend}
						>
							SEND
						</button>
					</Grid>
				</Grid>
			);
		}
	}
	// TransactionSendBox - End

	getTitle = cryptoCurrency => {
		return cryptoCurrency !== 'custom' ? `Send ${cryptoCurrency}` : 'Send Custom Token';
	};

	render() {
		const { classes, addressError, amountUsd, locale, fiatCurrency } = this.props;
		let { cryptoCurrency } = this.state;
		let sendAmountClass = `${classes.input} ${classes.amountInput}`;
		let addressInputClass = `${classes.input} ${addressError ? classes.addressErrorColor : ''}`;
		const title = this.getTitle(cryptoCurrency);
		return (
			<TransactionBox
				cryptoCurrency={cryptoCurrency}
				closeAction={this.handleCancelAction}
				title={title}
			>
				<input
					type="text"
					onChange={e => this.handleAddressChange(e)}
					value={this.state.address}
					className={addressInputClass}
					placeholder="Send to Address"
				/>
				{addressError && (
					<span className={classes.addressErrorText}>
						Invalid address. Please check and try again.
					</span>
				)}
				<Grid
					container
					direction="row"
					className={classes.amountContainer}
					alignItems="center"
					justify="space-between"
				>
					<Grid item xs>
						<Grid
							container
							direction="row"
							justify="flex-start"
							alignItems="center"
							spacing={16}
						>
							<Grid item>
								<button
									onClick={() => this.handleAllAmountClick()}
									className={classes.selectAllAmountBtn}
								>
									ALL
								</button>
							</Grid>
							<Grid item xs>
								<input
									type="text"
									onChange={e => this.handleAmountChange(e)}
									value={this.state.amount}
									className={sendAmountClass}
									placeholder="0.00"
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						{this.state.isCustomView && (
							<select
								value={this.state.cryptoCurrency}
								onChange={e => this.handleCryptoCurrencyChange(e)}
								name="cryptoCurrency"
								className={classes.cryptoSelect}
							>
								<option
									value="custom"
									disabled
									selected
									className={classes.selectItem}
								>
									Custom Token
								</option>
								{this.renderSelectTokenItems()}
							</select>
						)}
					</Grid>
				</Grid>
				<Divider className={classes.divider} />
				<Grid
					container
					direction="row"
					justify="space-between"
					alignItems="center"
					className={classes.usdAmoutContainer}
				>
					<span>
						<NumberFormat
							locale={locale}
							style="currency"
							currency={fiatCurrency}
							value={amountUsd}
							fractionDigits={15}
						/>
					</span>
					<span> USD </span>
				</Grid>
				{this.renderFeeBox()}
				{this.renderButtons()}
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
		tokens: getTokens(state).splice(1), // remove ETH
		cryptoCurrency: props.match.params.cryptoCurrency,
		confirmation: props.match.params.confirmation,
		walletType: appSelectors.selectWalletType(state)
	};
};

const styledComponent = withStyles(styles)(TransactionSendBoxContainer);
export default connect(mapStateToProps)(styledComponent);
