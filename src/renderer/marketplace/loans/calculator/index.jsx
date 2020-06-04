import React from 'react';
import {
	Typography,
	Grid,
	Select,
	Input,
	MenuItem,
	Slider,
	Button,
	IconButton
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { withStyles } from '@material-ui/styles';
import { KeyboardArrowDown } from '@material-ui/icons';
import { TransferIcon, InfoTooltip, KeyTooltip, TooltipArrow } from 'selfkey-ui';
import { MarketplaceLoansComponent } from '../common/marketplace-loans-component';
import { LoansCalculatorBorrowTable } from './borrow-table';
import { LoansCalculatorLendTable } from './lend-table';

const styles = theme => ({
	container: {
		padding: '30px',
		border: '1px solid #303C49'
	},
	gridCell: {
		width: '470px',
		'& .MuiSlider-markLabel': {
			fontSize: '12px !important',
			marginTop: '3px'
		},
		'& .MuiSlider-mark': {
			display: 'none'
		},
		'& .MuiSlider-markLabelActive': {
			top: '26px',
			background: '#262f39',
			zIndex: '1'
		}
	},
	selectTokens: {
		minWidth: '11em',
		float: 'right'
	},
	resultsTableContainer: {
		marginTop: '20px',
		width: '100%'
	},
	sourceInput: {
		border: '1px solid #384656',
		fontWeight: 'normal',
		color: '#93B0C1',
		background: '#1E262E',
		borderTopLeftRadius: '0',
		borderBottomLeftRadius: '0',
		display: 'flex-inline',
		fontSize: '12px',
		minWidth: 'initial',
		justifyContent: 'space-around',
		'& svg': {
			height: '0.7em !important',
			width: '0.7em !important',
			marginLeft: '0.7em'
		}
	},
	loanAmount: {
		display: 'flex',
		alignItems: 'center'
	},
	amountInput: {
		borderTopRightRadius: '0',
		borderBottomRightRadius: '0',
		borderRight: '0'
	},
	slider: {
		marginLeft: '5px',
		width: 'calc(100% - 10px)'
	}
});

const FIXED_TOKENS = ['BTC', 'ETH', 'KEY'];
const CURRENCIES = ['USD', 'EUR', 'GBP'];

export const convertToUSD = (amount, currency, rates) => {
	if (currency && rates[currency]) {
		return amount / rates[currency];
	} else {
		return amount;
	}
};

const convertToCurrency = (amount, currency, rates) => {
	if (currency && rates[currency]) {
		return amount * rates[currency];
	} else {
		return amount;
	}
};

const calculateCollateral = ({ amount, token, rates, ltv }) => {
	const rate = rates.find(r => r.symbol === token);
	const LTV = ltv ? parseFloat(ltv) / 100 : 1;
	const collateral = amount / (rate.priceUSD * LTV);
	return `${collateral.toFixed(2)} ${rate.symbol}`;
};

const calculateSimpleInterest = ({ amount, months, apr }) => {
	const principal = parseFloat(amount);
	const interest = parseFloat(apr) / 100 / 12;

	const totalInterest = principal * interest * months;
	const total = principal + totalInterest;
	const monthly = totalInterest / months;

	return { monthly, total, totalInterest };
};

const calculateMonthlyPayment = ({ amount, apr, months }) => {
	const principal = parseFloat(amount);
	const interest = parseFloat(apr) / 100 / 12;
	const payments = months;

	const x = Math.pow(1 + interest, payments);
	let monthly = (principal * x * interest) / (x - 1);

	let total = 0;
	let totalInterest = 0;

	if (isFinite(monthly)) {
		total = monthly * payments;
		totalInterest = monthly * payments - principal;
	}

	return { monthly, total, totalInterest };
};

class LoansCalculatorComponent extends MarketplaceLoansComponent {
	state = {
		currencyIndex: 0,
		type: 'borrowing',
		selectedToken: FIXED_TOKENS[0],
		amount: '',
		period: 1,
		repayment: 'interest',
		results: []
	};

	minPeriod = () => {
		// const { inventory } = this.props;
		// const results = this.filterLoanType(inventory, type);
		// TODO: do we have a min load period?
		return 1;
	};

	maxPeriod = () => {
		const { inventory } = this.props;
		const data = this.filterLoanType(inventory, this.state.type);
		const max = Math.max.apply(
			Math,
			data.map(o => Number(o.data.maxLoanTerm.replace(/[^0-9.-]+/g, '')))
		);
		return max;
	};

	availableTokens = () => {
		const { inventory } = this.props;
		const data = this.filterLoanType(inventory, this.state.type);
		return this.inventoryUniqueTokens(data).filter(t => FIXED_TOKENS.indexOf(t) === -1);
	};

	onTypeChange = (e, type) => this.setState({ type, results: [] });

	onToggleRepayment = (e, repayment) => this.setState({ repayment, results: [] });

	onTokenChange = (e, selectedToken) => this.setState({ selectedToken, results: [] });

	onPeriodChange = (e, period) => this.setState({ period, results: [] });

	onAmountChange = event => {
		let amount = event.target.value;
		if (isNaN(Number(amount)) || amount < 0) {
			amount = 0;
		}
		this.setState({ amount });
	};

	onCurrencyChange = () => {
		const currencyIndex =
			this.state.currencyIndex + 1 >= CURRENCIES.length ? 0 : this.state.currencyIndex + 1;
		this.setState({ currencyIndex }, () => this.calculate());
	};

	generateMarks = ({ max, min, period }) => {
		const marks = [];
		marks.push({ value: min, label: `${min}` });
		if (period !== min) {
			marks.push({ value: period, label: `${period} MO` });
		}
		// Avoid overlapping marker
		if (max - period > 3) {
			marks.push({ value: max, label: `${max} MO` });
		}
		return marks;
	};

	onCalculateClick = () => this.calculate();

	calculate() {
		const { inventory, fiatRates } = this.props;
		const { amount, type, period, selectedToken, repayment, currencyIndex } = this.state;
		const currency = CURRENCIES[currencyIndex];

		// Don't do anything if amount is invalid
		if (amount <= 0) {
			return;
		}

		// Convert to USD (airtable data is in USD)
		const convertedAmount = convertToUSD(amount, currency, fiatRates);

		// Filter correct type (Lending or Borrowing)
		const inventoryByType = this.filterLoanType(inventory, type);

		// Filters offers outside of min and max loan values
		let results = inventoryByType.filter(offer => {
			return (
				(Number(offer.data.maxLoan.replace(/[^0-9.-]+/g, '')) >= +convertedAmount ||
					offer.data.maxLoan === 'Unlimited') &&
				Number(offer.data.minLoan.replace(/[^0-9.-]+/g, '')) <= +convertedAmount
			);
		});

		// Filter and remove offers with loan term < user selected period
		results = results.filter(offer => {
			return (
				Number(offer.data.maxLoanTerm.replace(/[^0-9.-]+/g, '')) >= period ||
				offer.data.maxLoanTerm === 'Unlimited'
			);
		});

		// Filters by asset
		results = results.filter(offer => offer.data.assets.includes(selectedToken));

		// Calculate loan repayment for each result
		results = results.map(offer => {
			if (repayment === 'interest') {
				offer.loanPayment = calculateSimpleInterest({
					amount: convertedAmount,
					months: period,
					apr: Number(offer.data.interestRate.replace(/[^0-9.-]+/g, ''))
				});
			} else {
				offer.loanPayment = calculateMonthlyPayment({
					amount: convertedAmount,
					months: period,
					apr: Number(offer.data.interestRate.replace(/[^0-9.-]+/g, ''))
				});
			}
			if (type === 'borrowing') {
				offer.collateral = calculateCollateral({
					amount: convertedAmount,
					rates: this.props.rates,
					token: selectedToken,
					ltv: offer.data.ltv
				});
			}

			// Exchange back to original currency
			offer.loanPayment.monthly = convertToCurrency(
				offer.loanPayment.monthly,
				currency,
				fiatRates
			);
			offer.loanPayment.total = convertToCurrency(
				offer.loanPayment.total,
				currency,
				fiatRates
			);
			offer.loanPayment.totalInterest = convertToCurrency(
				offer.loanPayment.totalInterest,
				currency,
				fiatRates
			);

			return offer;
		});

		this.setState({ results });
	}

	render() {
		const { classes } = this.props;
		const { type, period, amount, selectedToken, repayment, currencyIndex } = this.state;
		const currency = CURRENCIES[currencyIndex];
		return (
			<React.Fragment>
				<div className={classes.container}>
					<Grid container direction="column" justify="flex-start" spacing={4}>
						<Grid item>
							<Typography variant="overline" gutterBottom>
								I want to
							</Typography>
							<ToggleButtonGroup onChange={this.onTypeChange} exclusive value={type}>
								<ToggleButton value="borrowing">
									<Typography variant="h5">Borrow</Typography>
								</ToggleButton>
								<ToggleButton value="lending">
									<Typography variant="h5">Lend</Typography>
								</ToggleButton>
							</ToggleButtonGroup>
						</Grid>

						<Grid item>
							<Grid container direction="row" justify="flex-start" spacing={8}>
								<Grid item className={classes.gridCell}>
									<Typography variant="overline" gutterBottom>
										My Crypto
									</Typography>
									<ToggleButtonGroup
										onChange={this.onTokenChange}
										exclusive
										value={selectedToken}
									>
										{FIXED_TOKENS.map(token => (
											<ToggleButton key={token} value={token}>
												<Typography variant="h5">{token}</Typography>
											</ToggleButton>
										))}
									</ToggleButtonGroup>
									<Select
										name="asset"
										className={classes.selectTokens}
										IconComponent={KeyboardArrowDown}
										input={<Input disableUnderline />}
										value={
											FIXED_TOKENS.includes(selectedToken)
												? ''
												: selectedToken
										}
										displayEmpty
										onChange={e => this.onTokenChange(e, e.target.value)}
									>
										<MenuItem key="empty" value="" disabled>
											<Typography variant="subtitle1" color="textSecondary">
												Other...
											</Typography>
										</MenuItem>
										{this.availableTokens().map(token => (
											<MenuItem key={token} value={token}>
												{token}
											</MenuItem>
										))}
									</Select>
								</Grid>
								<Grid item className={classes.gridCell}>
									<Typography variant="overline" gutterBottom>
										Loan Amount
									</Typography>
									<div className={classes.loanAmount}>
										<Input
											type="text"
											value={amount}
											placeholder="0.00"
											onChange={this.onAmountChange}
											className={classes.amountInput}
										/>
										<Button
											variant="outlined"
											size="large"
											className={classes.sourceInput}
											onClick={this.onCurrencyChange}
										>
											{currency}
											<TransferIcon />
										</Button>
									</div>
								</Grid>
							</Grid>
						</Grid>
						<Grid item>
							<Grid container direction="row" justify="flex-start" spacing={8}>
								<Grid item className={classes.gridCell}>
									<Typography variant="overline" gutterBottom>
										Loan Period
									</Typography>
									<Slider
										value={period}
										min={this.minPeriod()}
										max={this.maxPeriod()}
										onChange={this.onPeriodChange}
										step="1"
										marks={this.generateMarks({
											max: this.maxPeriod(),
											min: this.minPeriod(),
											period
										})}
										valueLabelDisplay="off"
										aria-labelledby="range-slider"
										className={classes.slider}
									/>
								</Grid>

								<Grid item className={classes.gridCell}>
									<Typography variant="overline" gutterBottom>
										Repayment
										<KeyTooltip
											interactive
											placement="top-start"
											className={classes.tooltip}
											title={
												<React.Fragment>
													<span>
														Principal and interest loans require you to
														pay off part of the principle loan amount as
														well as cover the interest repayments
													</span>
													<TooltipArrow />
												</React.Fragment>
											}
										>
											<IconButton aria-label="Info">
												<InfoTooltip />
											</IconButton>
										</KeyTooltip>
									</Typography>
									<ToggleButtonGroup
										onChange={this.onToggleRepayment}
										exclusive
										value={repayment}
									>
										<ToggleButton value="interest">
											<Typography variant="h5">Interest</Typography>
										</ToggleButton>
										<ToggleButton value="interest + principle">
											<Typography variant="h5">
												Interest + Principle
											</Typography>
										</ToggleButton>
									</ToggleButtonGroup>
								</Grid>
							</Grid>
						</Grid>
						<Grid item>
							<Button
								variant="contained"
								size="large"
								onClick={this.onCalculateClick}
							>
								Calculate
							</Button>
						</Grid>
					</Grid>
				</div>
				<div className={classes.resultsTableContainer}>
					{type === 'borrowing' && (
						<LoansCalculatorBorrowTable
							data={this.state.results}
							currency={currency}
							onDetailsClick={this.props.onDetailsClick}
						/>
					)}
					{type === 'lending' && (
						<LoansCalculatorLendTable
							data={this.state.results}
							currency={currency}
							onDetailsClick={this.props.onDetailsClick}
						/>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const LoansCalculator = withStyles(styles)(LoansCalculatorComponent);
export default LoansCalculator;
export { LoansCalculator };
