import { featureIsEnabled } from 'common/feature-flags';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import EthUnits from 'common/utils/eth-units';
import { TransactionBox } from '../common/transaction-box';
import { ethGasStationInfoOperations, ethGasStationInfoSelectors } from 'common/eth-gas-station';
import { transactionOperations, transactionSelectors } from 'common/transaction';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/styles';
import { MenuItem, Select, Input, Tabs, Tab, Typography, FormControl } from '@material-ui/core';
import { appOperations, appSelectors } from 'common/app';
import { push } from 'connected-react-router';
import { debounce, over } from 'lodash';
import { InputTitle } from '../../common/input-title';
import { getWallet } from 'common/wallet/selectors';
import ReceiveTokenTab from './components/receive-token-tab';
import SendTokenTab from './components/send-token-tab';
import { SelectDropdownIcon } from 'selfkey-ui';

const styles = theme => ({
	errorColor: {
		backgroundColor: 'rgba(255,46,99,0.09) !important',
		border: '2px solid #FE4B61 !important',
		boxShadow: 'none !important',
		color: '#FE4B61 !important'
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
	cryptoSelect: {
		width: '100%'
	},
	selectItem: {
		border: 0,
		backgroundColor: '#1E262E',
		color: '#FFFFFF'
	},
	tokenBottomSpace: {
		marginBottom: '20px'
	},
	tabs: {
		marginBottom: '20px'
	},
	cryptoIcon: {
		marginRight: '20px'
	},
	cryptoSymbol: {
		fontSize: '14px',
		fontWeight: 'normal'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent'
	},
	modalContentWrapper: {
		boxShadow: 'none',
		marginBottom: '20px'
	},
	closeIcon: {
		'& svg': {
			position: 'relative',
			top: '20px'
		}
	},
	tabsWrap: {
		'& .feeTitle': {
			display: 'table',
			marginBottom: '5px'
		}
	}
});

class TransactionSendBoxContainer extends PureComponent {
	static UPDATE_DELAY = 100;

	state = {
		amount: '',
		address: '',
		cryptoCurrency: this.props.match.params.cryptoCurrency,
		sending: false,
		sendingAddress: this.props.match.params.sendingAddress,
		tab: 'send'
	};

	async componentDidMount() {
		this.loadData();

		let { trezorAccountIndex, cryptoCurrency } = this.props;
		await this.props.dispatch(
			transactionOperations.init({ trezorAccountIndex, cryptoCurrency })
		);
	}

	componentDidUpdate(prevProps) {
		if (
			prevProps.gasLimit !== this.props.gasLimit ||
			prevProps.gasPrice !== this.props.gasPrice ||
			prevProps.ethFee !== this.props.ethFee
		) {
			this.adjustMaxAmount();
		}
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

	handleNonceChange = debounce(
		value => this.props.dispatch(transactionOperations.setNonce(value)),
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

	handleAllAmountClick = () => {
		let value = String(this.props.balance);

		if (this.state.cryptoCurrency === 'ETH') {
			value =
				this.props.balance -
				EthUnits.toEther(this.props.gasPrice * this.props.gasLimit, 'gwei');
			value = String(value);
		}
		value = value < 0 ? 0 : value;
		this.setState({ amount: value });
		this.props.dispatch(transactionOperations.setAmount(value));
	};

	adjustMaxAmount = () => {
		if (this.state.cryptoCurrency === 'ETH') {
			const max =
				this.props.balance -
				EthUnits.toEther(this.props.gasPrice * this.props.gasLimit, 'gwei');
			if (this.state.amount > max && max >= 0) {
				this.setState({ amount: max });
				this.props.dispatch(transactionOperations.setAmount(max));
			}
		}
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
		value = value < 0 ? 0 : value;
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

	render() {
		const { classes, sendingAddress } = this.props;
		const { cryptoCurrency, sending, tab } = this.state;
		const title = 'Send/Receive ERC-20 Tokens';
		return (
			<TransactionBox closeAction={this.handleCancelAction} title={title}>
				<div className={classes.tokenBottomSpace}>
					<FormControl variant="filled" fullWidth>
						<InputTitle title="Token" />
						<Select
							className={classes.cryptoSelect}
							value={cryptoCurrency}
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
				{cryptoCurrency !== 'custom' ? (
					<div className={classes.tabsWrap}>
						<Tabs
							value={tab}
							onChange={(evt, value) => this.onTabChange(value)}
							className={classes.tabs}
						>
							<Tab id="send" value="send" label="Send" />
							<Tab id="receive" value="receive" label="Receive" />
						</Tabs>

						{this.state.tab === 'send' && (
							<SendTokenTab
								{...this.props}
								sending={sending}
								address={this.state.address}
								amount={this.state.amount}
								handleAddressChange={this.handleAddressChange}
								handleAmountChange={this.handleAmountChange}
								handleGasLimitChange={this.withLock(this.handleGasLimitChange)}
								handleGasPriceChange={this.withLock(this.handleGasPriceChange)}
								handleNonceChange={this.withLock(this.handleNonceChange)}
								reloadEthGasStationInfoAction={this.loadData}
								handleAllAmountClick={this.handleAllAmountClick}
								handleConfirm={this.handleConfirm}
								handleCancel={this.handleCancel}
								handleSend={this.handleSend}
								eip1559={featureIsEnabled('eip_1559')}
							/>
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
	const { fiatCurrency = 'USD' } = getFiatCurrency(state);
	return {
		...getLocale(state),
		...ethGasStationInfoSelectors.getEthGasStationInfo(state),
		...transactionSelectors.getTransaction(state),
		fiatCurrency,
		sendingAddress: getWallet(state).address,
		tokens: getTokens(state),
		cryptoCurrency: props.match.params.cryptoCurrency,
		ethRate: pricesSelectors.getRate(state, 'ETH', fiatCurrency),
		confirmation: props.match.params.confirmation,
		walletType: appSelectors.selectWalletType(state)
	};
};

const styledComponent = withStyles(styles)(TransactionSendBoxContainer);
export default connect(mapStateToProps)(styledComponent);
