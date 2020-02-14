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
import { Grid, MenuItem, Select, Input, Button, Typography, Divider } from '@material-ui/core';
import { appOperations, appSelectors } from 'common/app';
import { push } from 'connected-react-router';
import { debounce, over } from 'lodash';
import { KeyboardArrowDown } from '@material-ui/icons';
import { InputTitle } from '../../common/input-title';

const styles = theme => ({
	container: {
		fontFamily: 'Lato, arial, sans-serif'
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
	errorColor: {
		backgroundColor: 'rgba(255,46,99,0.09) !important',
		border: '2px solid #FE4B61 !important',
		boxShadow: 'none !important',
		color: '#FE4B61 !important'
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
		margin: '40px 0'
	},
	cryptoSelect: {
		width: '100%'
	},
	selectItem: {
		border: 0,
		backgroundColor: '#1E262E',
		color: '#FFFFFF'
	},
	tokenBottomSpace: {
		marginBottom: '30px'
	},
	flexColumn: {
		flexDirection: 'column'
	},
	tokenMax: {
		display: 'flex',
		flexWrap: 'nowrap',
		marginBottom: '5px'
	},
	bottomSpace: {
		marginBottom: '20px'
	},
	fiatPrice: {
		display: 'flex'
	},
	amount: {
		marginRight: '20px'
	},
	errorText: {
		height: '19px',
		width: '242px',
		color: '#FE4B61',
		fontFamily: 'Lato',
		fontSize: '13px',
		lineHeight: '19px'
	},
	lofasz: {
		padding: '28px 100px'
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
				<MenuItem
					key={token.symbol}
					value={token.symbol}
					className={classes.selectItem}
				>{`${token.symbol} - ${token.name}`}</MenuItem>
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
	// TransactionSendBox - End

	getTitle = cryptoCurrency => {
		return cryptoCurrency !== 'custom'
			? `Send ${cryptoCurrency}`
			: 'Send/Receive ERC-20 Tokens';
	};

	render() {
		const { classes, addressError, amountUsd, locale, fiatCurrency } = this.props;
		const labelInputClass = `${addressError ? classes.errorColor : ''}`;
		let { cryptoCurrency } = this.state;
		const title = this.getTitle(cryptoCurrency);
		return (
			<TransactionBox
				cryptoCurrency={cryptoCurrency}
				closeAction={this.handleCancelAction}
				title={title}
			>
				<div className={classes.tokenBottomSpace}>
					<InputTitle title="Token" />
					{this.state.isCustomView && (
						<Select
							className={classes.cryptoSelect}
							value={this.state.cryptoCurrency}
							onChange={e => this.handleCryptoCurrencyChange(e)}
							name="cryptoCurrency"
							disableUnderline
							IconComponent={KeyboardArrowDown}
							input={<Input disableUnderline />}
						>
							{this.renderSelectTokenItems()}
						</Select>
					)}
				</div>
				<div className={classes.bottomSpace}>Available: {this.state.amount}</div>
				<div className={classes.tokenBottomSpace}>
					<InputTitle title="Amount" />
					<div className={classes.tokenMax}>
						<Input
							type="text"
							onChange={e => this.handleAmountChange(e)}
							value={this.state.amount}
							placeholder="0.00"
							className={classes.amount}
							fullWidth
						/>
						<Button
							onClick={() => this.handleAllAmountClick()}
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
							onChange={e => this.handleAddressChange(e)}
							value={this.state.address}
							placeholder="0x"
							className={labelInputClass}
							fullWidth
						/>
						{addressError && (
							<span id="labelError" className={classes.errorText}>
								Invalid address. Please check and try again.
							</span>
						)}
					</div>
				</div>

				<Divider className={classes.divider} />

				{addressError && (
					<span className={classes.addressErrorText}>
						Invalid address. Please check and try again.
					</span>
				)}
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
