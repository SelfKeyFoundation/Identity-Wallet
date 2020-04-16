import React, { PureComponent } from 'react';
import BN from 'bignumber.js';
import { connect } from 'react-redux';
import { getLocale } from 'common/locale/selectors';
import { getWallet } from 'common/wallet/selectors';
import { pricesSelectors } from 'common/prices';
import { Popup, InputTitle } from '../../common';
import { tokensSelectors } from 'common/tokens';
import { getTokens } from 'common/wallet-tokens/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { tokenSwapOperations, tokenSwapSelectors } from 'common/token-swap';
import { convertExponentialToDecimal } from 'common/utils/exponential-to-decimal';
import { transactionOperations } from 'common/transaction';
import { MenuItem, Grid, Select, Input, Typography, Button, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { KeyboardArrowDown } from '@material-ui/icons';
import { NumberFormat, TransferIcon } from 'selfkey-ui';

const styles = theme => ({
	body: {
		color: '#FFFFFF',
		fontFamily: 'Proxima Nova',
		fontSize: '18px',
		lineHeight: '30px',
		width: '100%',
		'& > div': {
			marginBottom: '30px'
		}
	},
	cryptoSelect: {
		width: '100%'
	},
	selectItem: {
		border: 0,
		backgroundColor: '#1E262E',
		color: '#FFFFFF'
	},
	tokenMax: {
		display: 'flex',
		flexWrap: 'nowrap',
		'& svg': {
			height: '0.7em !important',
			width: '0.7em !important',
			marginRight: '0.5em'
		}
	},
	amountInput: {
		borderTopRightRadius: '0',
		borderBottomRightRadius: '0'
	},
	maxSourceInput: {
		border: '1px solid #384656',
		marginRight: '45px',
		fontWeight: 'normal',
		color: '#93B0C1',
		background: '#1E262E',
		borderTopLeftRadius: '0',
		borderBottomLeftRadius: '0'
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
	separator: {
		marginRight: '1em'
	},
	errorText: {
		color: theme.palette.error.main,
		fontFamily: 'Lato',
		textAlign: 'center'
	},
	actionButtonsContainer: {
		width: '100%'
	},
	fees: {
		display: 'inline-flex',
		color: '#FFF',
		marginLeft: '0.5em',
		'& > div': {
			margin: '0 0.25em'
		}
	},
	rate: {
		fontSize: '0.7em'
	}
});

const formatValue = value => {
	if (!value) {
		return '';
	}
	const v = value.toLocaleString('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 4
	});
	return `${convertExponentialToDecimal(v)}`;
};

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

	getTokenFiatBalance = token => {
		const t = this.props.walletTokens.find(t => t.symbol === token);
		return t ? BN(t.balanceInFiat).toFixed(18) : 0;
	};

	getTokenBalance = token => {
		const t = this.props.walletTokens.find(t => t.symbol === token);
		return t ? BN(t.balance).toFixed(18) : 0;
	};

	getFiatValue = (amount, token) => {
		const t = this.props.walletTokens.find(t => t.symbol === token);
		return t ? BN(amount * t.price).toFixed(18) : 0;
	};

	getCryptoValue = (amount, token) => {
		const t = this.props.walletTokens.find(t => t.symbol === token);
		return t ? BN(amount / t.price).toFixed(18) : 0;
	};

	getAmount = () => {
		const { sourceCurrency, amount } = this.state;
		const { fiatCurrency, sourceToken } = this.props;

		return sourceCurrency === fiatCurrency ? this.getCryptoValue(amount, sourceToken) : amount;
	};

	findTokenSymbol = tokenString => {
		const token = this.props.tokens.find(t => t.address === tokenString);
		return token && token.symbol ? token.symbol : tokenString;
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
		let value = event.target.value;
		let maxAmount = 0;
		if (this.state.sourceCurrency === this.props.fiatCurrency) {
			maxAmount = this.getTokenFiatBalance(this.props.sourceToken);
		} else {
			maxAmount = this.getTokenBalance(this.props.sourceToken);
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
	};

	handleAllAmountClick = () => {
		const { fiatCurrency, sourceToken } = this.props;
		let maxAmount = 0;
		if (this.state.sourceCurrency === fiatCurrency) {
			maxAmount = this.getTokenFiatBalance(sourceToken);
			this.setState({ amount: maxAmount });
		} else {
			maxAmount = this.getTokenBalance(sourceToken);
			this.setState({ amount: maxAmount });
		}
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
			<MenuItem key={token.symbol} value={token.symbol} className={classes.selectItem}>
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
			<MenuItem key={token.symbol} value={token.symbol} className={classes.selectItem}>
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
		const transaction = this.props.transaction.transactions[0].tx;
		await this.props.dispatch(transactionOperations.sendCustomTransaction({ transaction }));
	};

	render() {
		const { classes, closeAction } = this.props;
		return (
			<Popup closeAction={closeAction} text="Swap your tokens">
				<Grid container direction="column" justify="flex-start" alignItems="flex-start">
					<Grid item id="body" className={classes.body}>
						<div>
							<InputTitle title="Token" />
							<Select
								className={classes.cryptoSelect}
								value={this.findTokenSymbol(this.props.sourceToken)}
								onChange={e => this.handleSourceTokenChange(e)}
								name="sourceToken"
								disableUnderline
								IconComponent={KeyboardArrowDown}
								input={<Input disableUnderline />}
							>
								{this.renderSelectSourceTokenItems()}
							</Select>
						</div>
						<div>
							<InputTitle title="Change to" />
							<Select
								className={classes.cryptoSelect}
								value={this.findTokenSymbol(this.props.targetToken)}
								onChange={e => this.handleTargetTokenChange(e)}
								name="targetToken"
								disableUnderline
								IconComponent={KeyboardArrowDown}
								input={<Input disableUnderline />}
							>
								{this.renderSelectTargetTokenItems()}
							</Select>
						</div>
						<div>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="center"
								className={classes.actionButtonsContainer}
								spacing={8}
							>
								<Grid item>
									<Typography variant="body2" color="secondary">
										Available:
									</Typography>
								</Grid>
								<Grid item className={classes.availableAmountUsd}>
									<Typography variant="body2" color="secondary">
										<NumberFormat
											locale={this.props.locale}
											priceStyle="currency"
											currency={this.props.fiatCurrency}
											value={this.getTokenFiatBalance(this.props.sourceToken)}
											fractionDigits={2}
										/>
										{this.props.fiatCurrency}
									</Typography>
								</Grid>
								<Grid item style={{}}>
									<Typography variant="subtitle2" color="secondary">
										<span className={classes.separator}>|</span>
										{formatValue(
											this.getTokenBalance(this.props.sourceToken)
										)}{' '}
										{this.props.sourceToken}
									</Typography>
								</Grid>
							</Grid>
						</div>
						<div>
							<InputTitle title="Amount" />
							<div className={classes.tokenMax}>
								<Input
									type="text"
									onChange={this.handleAmountChange}
									value={this.state.amount.toString()}
									placeholder="0.00"
									className={classes.amountInput}
									fullWidth
								/>
								<Button
									onClick={this.handleSourceCurrencyClick}
									variant="outlined"
									size="large"
									className={classes.maxSourceInput}
								>
									<TransferIcon />
									{this.state.sourceCurrency === this.props.sourceToken
										? this.props.sourceToken
										: this.props.fiatCurrency}
								</Button>
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
							spacing={24}
						>
							{this.props.error && (
								<Grid item>
									<div className={classes.errorText}>{this.props.error}</div>
								</Grid>
							)}

							{!this.props.transaction && (
								<Grid item>
									{this.props.loading && (
										<Button variant="contained" size="large" disabled={true}>
											Loading ...
										</Button>
									)}
									{!this.props.loading && (
										<Button
											variant="contained"
											size="large"
											onClick={this.handleCalculateFees}
											disabled={!this.isValid()}
										>
											Calculate Fees
										</Button>
									)}
								</Grid>
							)}

							{this.props.transaction && (
								<Grid item style={{ width: '100%' }}>
									<div style={{ width: '100%', paddingBottom: '20px' }}>
										<Typography variant="body2" color="secondary">
											Network Transaction Fee:
											<div className={classes.fees}>
												{this.props.gas} ETH{' / '}
												<NumberFormat
													locale={this.props.locale}
													priceStyle="currency"
													currency={this.props.fiatCurrency}
													value={this.props.gas * this.props.ethRate}
													fractionDigits={15}
												/>{' '}
												{this.props.fiatCurrency}
											</div>
										</Typography>
										<Typography variant="body2" color="secondary">
											Swap Fee:
											<div className={classes.fees}>
												{this.props.fee} ETH{' / '}
												<NumberFormat
													locale={this.props.locale}
													priceStyle="currency"
													currency={this.props.fiatCurrency}
													value={this.props.fee * this.props.ethRate}
													fractionDigits={15}
												/>{' '}
												{this.props.fiatCurrency}
											</div>
										</Typography>
									</div>
									<Grid
										container
										direction="column"
										justify="center"
										alignItems="center"
										className={classes.actionButtonsContainer}
										spacing={24}
									>
										<Grid item>
											<Button
												variant="contained"
												size="large"
												onClick={this.handleSwap}
											>
												Swap
											</Button>
										</Grid>

										<Grid item>
											<Typography
												variant="body2"
												color="secondary"
												className={classes.rate}
											>
												Exchange Rate: 1 {this.props.sourceToken} ={' '}
												{formatValue(parseFloat(this.props.rate))}{' '}
												{this.props.targetToken}
											</Typography>
										</Grid>
									</Grid>
								</Grid>
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
