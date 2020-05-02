import React, { PureComponent } from 'react';
import BN from 'bignumber.js';
import config from 'common/config';
import { connect } from 'react-redux';
import { getLocale } from 'common/locale/selectors';
import { getWallet } from 'common/wallet/selectors';
import { pricesSelectors } from 'common/prices';
import { Popup, InputTitle } from '../../common';
import { tokensSelectors } from 'common/tokens';
import { getTokens } from 'common/wallet-tokens/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { tokenSwapOperations, tokenSwapSelectors } from 'common/token-swap';
import { transactionOperations } from 'common/transaction';
import { MenuItem, Grid, Select, Input, Typography, Button, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { KeyboardArrowDown } from '@material-ui/icons';
import { NumberFormat, TransferIcon } from 'selfkey-ui';

const styles = theme => ({
	body: {
		color: '#FFFFFF',
		fontFamily: 'Proxima Nova',
		fontSize: '18px',
		lineHeight: '30px',
		width: '100%'
	},
	formField: {
		marginBottom: '30px'
	},
	cryptoSelect: {
		width: '100%'
	},
	selectItem: {
		border: 0,
		backgroundColor: '#1E262E',
		color: '#FFFFFF'
	},
	tokenMaxContainer: {
		display: 'flex'
	},
	tokenMax: {
		display: 'flex',
		flexWrap: 'wrap',
		width: '100%',
		'& svg': {
			height: '0.7em !important',
			width: '0.7em !important'
		}
	},
	tokenMaxSubsection: {
		flexBasis: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		marginTop: '0.25em'
	},
	amountInput: {
		borderTopRightRadius: '0',
		borderBottomRightRadius: '0',
		width: '420px'
	},
	maxSourceInput: {
		border: '1px solid #384656',
		marginRight: '20px',
		fontWeight: 'normal',
		color: '#93B0C1',
		background: '#1E262E',
		borderTopLeftRadius: '0',
		borderBottomLeftRadius: '0',
		display: 'flex',
		justifyContent: 'space-around'
	},
	divider: {
		margin: '40px 0'
	},
	availableAmountUsd: {
		color: '#FFF',
		'& div': {
			display: 'inline-block',
			marginRight: '0.25em'
		},
		'& p': {
			color: '#FFF',
			fontWeight: 'bold'
		}
	},
	errorText: {
		color: theme.palette.error.main,
		fontFamily: 'Lato',
		textAlign: 'center'
	},
	actionButtonsContainer: {
		width: '100%',
		paddingTop: '50px'
	},
	feesContainer: {
		width: '100%'
	},
	fees: {
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: '20px'
	},
	feesValues: {
		textAlign: 'right',
		'& p': {
			fontWeight: 'bold'
		}
	},
	smallFeesValues: {
		textAlign: 'right',
		marginTop: '0.5em',
		'& p': {
			fontWeight: 'bold',
			fontSize: '0.7em',
			lineHeight: '1',
			marginTop: '1em'
		},
		'& h6': {
			fontSize: '0.6em'
		}
	},
	fiatFee: {
		fontWeight: 'bold',
		'& div': {
			display: 'inline-block',
			textAlign: 'right'
		}
	},
	ethFee: {
		textAlign: 'right'
	},
	rate: {
		fontSize: '0.7em',
		'& div': {
			display: 'inline-block',
			marginRight: '.5em'
		}
	},
	valueDisplay: {
		'& div': {
			display: 'inline-block',
			marginRight: '.5em'
		}
	},
	maxSwapDisplay: {
		marginRight: '60px'
	},
	separator: {
		marginRight: '.5em'
	},
	buttonRightSpace: {
		marginRight: '20px'
	}
});

const TokenValue = withStyles(styles)(
	({
		classes,
		prefix,
		value = 0,
		locale,
		token,
		separator = false,
		variant = 'subtitle2',
		color = 'secondary',
		fractionDigits = 8
	}) => (
		<Typography variant={variant} color={color} className={classes.valueDisplay}>
			{separator && <span className={classes.separator}>|</span>}
			{prefix && <span>{prefix}</span>}
			<NumberFormat
				locale={locale}
				priceStyle="decimal"
				currency={token}
				value={value}
				fractionDigits={fractionDigits}
				className="token-value"
			/>
			{token}
		</Typography>
	)
);

const FiatValue = withStyles(styles)(
	({
		classes,
		value,
		currency,
		separator = false,
		locale,
		variant = 'subtitle2',
		color = 'secondary',
		fractionDigits = 2
	}) => (
		<Typography variant={variant} color={color} className={classes.valueDisplay}>
			{separator && <span className={classes.separator}>|</span>}
			<NumberFormat
				locale={locale}
				priceStyle="currency"
				currency={currency}
				value={value}
				fractionDigits={fractionDigits}
				className="fiat-value"
			/>
			{currency}
		</Typography>
	)
);

export class TokenSwapComponent extends PureComponent {
	state = {
		sourceCurrency: 'USD',
		amount: 0
	};

	async componentWillMount() {
		this.props.dispatch(tokenSwapOperations.clearOperation());
	}

	async componentDidMount() {
		const { tokens, walletTokens } = this.props;
		const defaultToken =
			walletTokens && tokens ? tokens.find(t => t.symbol === walletTokens[0].symbol) : false;
		const keyToken = walletTokens && tokens ? tokens.find(t => t.symbol === 'KEY') : false;

		const defaultSource = defaultToken ? defaultToken.address : 'ETH';
		const defaultTarget = keyToken ? keyToken.address : '';

		this.props.dispatch(tokenSwapOperations.setSourceOperation(defaultSource));
		this.props.dispatch(tokenSwapOperations.setTargetOperation(defaultTarget));
		await this.props.dispatch(tokenSwapOperations.loadTokensOperation());
	}

	isValid = () => this.state.amount && this.props.sourceToken && this.props.targetToken;

	findTokenSymbol = tokenString => {
		const token = this.props.tokens.find(t => t.address === tokenString);
		return token && token.symbol ? token.symbol : tokenString;
	};

	getTokenFiatBalance = token => {
		const symb = this.findTokenSymbol(token);
		const t = this.props.walletTokens.find(t => t.symbol === symb);
		return t ? BN(t.balanceInFiat).toFixed(18) : 0;
	};

	getTokenBalance = token => {
		const symb = this.findTokenSymbol(token);
		const t = this.props.walletTokens.find(t => t.symbol === symb);
		return t ? BN(t.balance).toFixed(18) : 0;
	};

	getFiatValue = (amount, token) => {
		const symb = this.findTokenSymbol(token);
		const t = this.props.walletTokens.find(t => t.symbol === symb);
		return t && t.price > 0 ? BN(amount * t.price).toFixed(18) : 0;
	};

	getCryptoValue = (amount, token) => {
		const symb = this.findTokenSymbol(token);
		const t = this.props.walletTokens.find(t => t.symbol === symb);
		return t && t.price > 0 ? BN(amount / t.price).toFixed(18) : 0;
	};

	getAmount = () => {
		const { sourceCurrency, amount } = this.state;
		const { fiatCurrency, sourceToken } = this.props;
		let filteredAmount = amount;
		if (sourceCurrency === fiatCurrency) {
			filteredAmount = Math.min(filteredAmount, config.totleMaxSwap);
			filteredAmount = this.getCryptoValue(filteredAmount, sourceToken);
		} else {
			filteredAmount = Math.min(
				amount,
				this.getCryptoValue(config.totleMaxSwap, sourceToken)
			);
		}
		return filteredAmount;
	};

	setSourceToken = sourceToken => {
		this.setState({ amount: 0 });
		// Use token address if we have it
		const token = this.props.tokens.find(t => t.symbol === sourceToken);
		const source = token && token.address ? token.address : sourceToken;
		this.props.dispatch(tokenSwapOperations.setSourceOperation(source));
	};

	setTargetToken = targetToken => {
		this.setState({ amount: 0 });
		// Use token address if we have it
		const token = this.props.tokens.find(t => t.symbol === targetToken);
		const target = token && token.address ? token.address : targetToken;
		this.props.dispatch(tokenSwapOperations.setTargetOperation(target));
	};

	handleSourceTokenChange = event => this.setSourceToken(event.target.value);

	handleTargetTokenChange = event => this.setTargetToken(event.target.value);

	handleAmountChange = event => {
		const { fiatCurrency, sourceToken } = this.props;
		let value = event.target.value;
		let maxAmount = 0;
		if (this.state.sourceCurrency === fiatCurrency) {
			maxAmount = this.getTokenFiatBalance(sourceToken);
			maxAmount = Math.min(maxAmount, config.totleMaxSwap);
		} else {
			maxAmount = this.getTokenBalance(sourceToken);
			maxAmount = Math.min(maxAmount, this.getCryptoValue(config.totleMaxSwap, sourceToken));
		}
		if (isNaN(Number(maxAmount))) {
			maxAmount = 0;
		}
		if (isNaN(Number(value))) {
			value = 0;
		}
		// Do not allow to enter values above the balance
		if (Number(value) > maxAmount) {
			value = String(maxAmount);
		}
		this.setState({ amount: value });
		this.props.dispatch(tokenSwapOperations.clearOperation());
	};

	handleAllAmountClick = () => {
		const { fiatCurrency, sourceToken } = this.props;
		let maxAmount = 0;
		if (this.state.sourceCurrency === fiatCurrency) {
			maxAmount = this.getTokenFiatBalance(sourceToken);
			maxAmount = Math.min(maxAmount, config.totleMaxSwap);
			this.setState({ amount: maxAmount });
		} else {
			maxAmount = this.getTokenBalance(sourceToken);
			maxAmount = Math.min(maxAmount, this.getCryptoValue(config.totleMaxSwap, sourceToken));
			this.setState({ amount: maxAmount });
		}
		this.props.dispatch(tokenSwapOperations.clearOperation());
	};

	handleSourceCurrencyClick = () => {
		const { fiatCurrency, sourceToken } = this.props;
		let { amount } = this.state;
		const sourceCurrency =
			this.state.sourceCurrency === fiatCurrency ? sourceToken : fiatCurrency;

		if (sourceCurrency === fiatCurrency) {
			amount = this.getFiatValue(amount, sourceToken);
		} else {
			amount = this.getCryptoValue(amount, sourceToken);
		}
		this.setState({ sourceCurrency, amount });
	};

	renderSelectSourceTokenItems = () => {
		const { walletTokens, classes } = this.props;
		const activeTokens = walletTokens.filter(token => token.recordState === 1);

		return activeTokens.map(token => (
			<MenuItem
				key={`${token.symbol}-${token.createdAt}`}
				value={token.symbol}
				className={classes.selectItem}
			>
				{`${token.symbol} - ${token.name}`}
			</MenuItem>
		));
	};

	renderSelectTargetTokenItems = () => {
		const { swapTokens, classes } = this.props;
		const { sourceToken } = this.props;

		// Show only active tokens and hide source token
		const activeTokens = swapTokens
			.filter(t => t.tradable)
			.filter(t => t.symbol !== sourceToken || t.address !== sourceToken);

		return activeTokens.map(token => (
			<MenuItem
				key={`${token.symbol}-${token.name}`}
				value={token.symbol}
				className={classes.selectItem}
			>
				{`${token.symbol} - ${token.name}`}
			</MenuItem>
		));
	};

	handleCalculateFees = async () => {
		const { sourceToken, wallet, walletTokens } = this.props;

		const token = walletTokens.find(t => t.symbol === sourceToken);
		const amount = this.getAmount();

		await this.props.dispatch(
			tokenSwapOperations.swapTokensOperation({
				address: wallet.address,
				amount: amount,
				decimal: token.decimal
			})
		);
	};

	handleSwap = async () => {
		const { dispatch, sourceToken, trezorAccountIndex } = this.props;
		const transactions = this.props.transaction.transactions;
		for (const t of transactions) {
			const transaction = t.tx;
			await dispatch(transactionOperations.init({ trezorAccountIndex, sourceToken }));
			await dispatch(transactionOperations.setAddress(transaction.to));
			await dispatch(transactionOperations.sendCustomTransaction({ transaction }));
		}
	};

	render() {
		const { classes, closeAction, sourceToken, targetToken, fiatCurrency, locale } = this.props;
		const { amount } = this.state;
		const gas = +this.props.gas;
		const fee = +this.props.fee;
		return (
			<Popup closeAction={closeAction} text="Swap your tokens">
				<Grid container direction="column" justify="flex-start" alignItems="flex-start">
					<Grid item id="body" className={classes.body}>
						<div className={classes.formField}>
							<InputTitle title="Token" />
							<Select
								className={classes.cryptoSelect}
								value={this.findTokenSymbol(sourceToken)}
								onChange={e => this.handleSourceTokenChange(e)}
								name="sourceToken"
								disableUnderline
								IconComponent={KeyboardArrowDown}
								input={<Input disableUnderline />}
							>
								{this.renderSelectSourceTokenItems()}
							</Select>
						</div>
						<div className={classes.formField}>
							<InputTitle title="Change to" />
							<Select
								className={classes.cryptoSelect}
								value={this.findTokenSymbol(targetToken)}
								onChange={e => this.handleTargetTokenChange(e)}
								name="targetToken"
								disableUnderline
								IconComponent={KeyboardArrowDown}
								input={<Input disableUnderline />}
							>
								{this.renderSelectTargetTokenItems()}
							</Select>
						</div>
						<div className={classes.formField}>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="center"
								spacing={1}
							>
								<Grid item>
									<Typography variant="body2" color="secondary">
										Available:
									</Typography>
								</Grid>
								<Grid item className={classes.availableAmountUsd}>
									<FiatValue
										variant="body2"
										locale={locale}
										currency={fiatCurrency}
										value={this.getTokenFiatBalance(sourceToken)}
									/>
								</Grid>
								<Grid item>
									<TokenValue
										value={this.getTokenBalance(sourceToken)}
										separator={true}
										locale={locale}
										token={this.findTokenSymbol(sourceToken)}
									/>
								</Grid>
							</Grid>
						</div>
						<div>
							<InputTitle title="Amount" />
							<div className={classes.tokenMaxContainer}>
								<div className={classes.tokenMax}>
									<Input
										type="text"
										onChange={this.handleAmountChange}
										value={amount.toString()}
										placeholder="0.00"
										className={classes.amountInput}
									/>
									<Button
										onClick={this.handleSourceCurrencyClick}
										variant="outlined"
										size="large"
										className={classes.maxSourceInput}
									>
										{this.state.sourceCurrency === sourceToken
											? this.findTokenSymbol(sourceToken)
											: fiatCurrency}
										<TransferIcon />
									</Button>
									<div className={classes.tokenMaxSubsection}>
										<div>
											{this.state.sourceCurrency === sourceToken &&
												amount > 0 && (
													<FiatValue
														value={this.getFiatValue(
															amount,
															sourceToken
														)}
														currency={fiatCurrency}
														locale={locale}
													/>
												)}
											{this.state.sourceCurrency !== sourceToken &&
												amount > 0 && (
													<TokenValue
														locale={locale}
														value={this.getCryptoValue(
															amount,
															sourceToken
														)}
														token={this.findTokenSymbol(sourceToken)}
													/>
												)}
										</div>
										<Typography
											variant="subtitle2"
											color="secondary"
											className={classes.maxSwapDisplay}
										>
											Max ${config.totleMaxSwap}/Swap
										</Typography>
									</div>
								</div>
								<Button
									onClick={this.handleAllAmountClick}
									variant="outlined"
									size="large"
								>
									Max
								</Button>
							</div>
						</div>

						<Divider className={classes.divider} />
						<Grid
							container
							direction="column"
							justify="center"
							alignItems="center"
							spacing={3}
						>
							{this.props.error && (
								<Grid item>
									<div className={classes.errorText}>{this.props.error}</div>
								</Grid>
							)}

							<Grid item className={classes.feesContainer}>
								<div className={classes.fees}>
									<Typography variant="body2" color="secondary">
										Swap Fee
									</Typography>
									{this.props.transaction && (
										<div className={classes.feesValues}>
											<FiatValue
												locale={locale}
												currency={fiatCurrency}
												value={fee * this.props.ethRate}
												variant="body2"
												color="primary"
											/>
											<div>
												<TokenValue
													locale={locale}
													token="ETH"
													value={fee}
												/>
											</div>
										</div>
									)}
								</div>
								<div className={classes.fees}>
									<Typography variant="body2" color="secondary">
										Network Transaction Fee
									</Typography>
									{this.props.transaction && (
										<div className={classes.feesValues}>
											<FiatValue
												locale={locale}
												currency={fiatCurrency}
												value={gas * this.props.ethRate}
												variant="body2"
												color="primary"
											/>
											<div>
												<TokenValue
													locale={locale}
													token="ETH"
													value={gas}
												/>
											</div>
										</div>
									)}
								</div>
								<div className={classes.fees}>
									<Typography variant="body1">Amount Total</Typography>
									{this.props.transaction && (
										<div>
											<div className={classes.feesValues}>
												<FiatValue
													locale={locale}
													currency={fiatCurrency}
													value={this.getFiatValue(
														this.getAmount(),
														sourceToken
													)}
													variant="body2"
													color="primary"
												/>
												<div>
													<TokenValue
														locale={locale}
														token={this.findTokenSymbol(sourceToken)}
														value={this.getAmount()}
													/>
												</div>
											</div>

											<div className={classes.smallFeesValues}>
												<FiatValue
													locale={locale}
													currency={fiatCurrency}
													value={(gas + fee) * this.props.ethRate}
													variant="body2"
													color="primary"
												/>
												<div>
													<TokenValue
														locale={locale}
														token="ETH"
														value={gas + fee}
													/>
												</div>
											</div>
										</div>
									)}
								</div>

								<Grid
									container
									direction="row"
									justify="center"
									alignItems="center"
									className={classes.actionButtonsContainer}
									spacing={2}
								>
									<Grid item>
										{this.props.loading && (
											<Button variant="outlined" size="large" disabled="1">
												Loading ...
											</Button>
										)}
										{!this.props.loading && (
											<Button
												variant="outlined"
												size="large"
												onClick={this.handleCalculateFees}
												disabled={!this.isValid()}
												className={classes.buttonRightSpace}
											>
												Calculate Fees
											</Button>
										)}
									</Grid>
									<Grid item>
										<Button
											variant="contained"
											size="large"
											onClick={this.handleSwap}
											disabled={!this.props.transaction}
										>
											Exchange
										</Button>
									</Grid>
								</Grid>
							</Grid>
							{this.props.rate && (
								<Typography
									variant="body2"
									color="secondary"
									className={classes.rate}
								>
									<TokenValue
										prefix={`Exchange Rate: 1 ${this.findTokenSymbol(
											sourceToken
										)} = `}
										locale={locale}
										value={this.props.rate}
										token={this.findTokenSymbol(targetToken)}
									/>
								</Typography>
							)}
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	}
}

const mapStateToProps = state => {
	const currency = getFiatCurrency(state);

	return {
		...getLocale(state),
		wallet: getWallet(state),
		fiatCurrency: currency.fiatCurrency,
		tokens: tokensSelectors.allTokens(state),
		walletTokens: getTokens(state),
		swapTokens: tokenSwapSelectors.selectTokens(state),
		error: tokenSwapSelectors.selectError(state),
		sourceToken: tokenSwapSelectors.selectSource(state),
		targetToken: tokenSwapSelectors.selectTarget(state),
		loading: tokenSwapSelectors.selectLoading(state),
		transaction: tokenSwapSelectors.selectTransaction(state),
		fee: tokenSwapSelectors.selectFee(state),
		gas: tokenSwapSelectors.selectGas(state),
		ethRate: pricesSelectors.getRate(state, 'ETH', 'USD'),
		rate: tokenSwapSelectors.selectRate(state)
	};
};

const TokenSwap = connect(mapStateToProps)(withStyles(styles)(TokenSwapComponent));
export default TokenSwap;
export { TokenSwap };
