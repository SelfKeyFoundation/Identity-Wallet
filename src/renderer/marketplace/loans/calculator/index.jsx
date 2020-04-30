import React from 'react';
import { Typography, Grid, Select, Input, MenuItem, Slider, Button } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { withStyles } from '@material-ui/styles';
import { KeyboardArrowDown } from '@material-ui/icons';
import { /* NumberFormat, */ TransferIcon } from 'selfkey-ui';
import { MarketplaceLoansComponent } from '../common/marketplace-loans-component';
import { LoansCalculatorBorrowTable } from './borrow-table';
import { LoansCalculatorLendTable } from './lend-table';

const styles = theme => ({
	container: {},
	gridCell: {
		width: '400px'
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
	selectTokens: {
		minWidth: '11em',
		float: 'right'
	},
	resultsTableContainer: {
		marginTop: '20px'
	}
});

const FIXED_TOKENS = ['BTC', 'ETH', 'KEY'];

class LoansCalculatorComponent extends MarketplaceLoansComponent {
	state = {
		type: 'borrowing',
		selectedToken: '',
		amount: '',
		period: 0,
		repayment: 'interest',
		results: []
	};

	minPeriod = () => {
		// const { inventory } = this.props;
		// const results = this.inventoryByType(inventory, type);
		// TODO: do we have a min load period?
		return 1;
	};

	maxPeriod = () => {
		const { inventory } = this.props;
		const data = this.inventoryByType(inventory, this.state.type);
		const max = Math.max.apply(
			Math,
			data.map(o => Number(o.data.maxLoanTerm.replace(/[^0-9.-]+/g, '')))
		);
		return max;
	};

	availableTokens = () => {
		const { inventory } = this.props;
		const data = this.inventoryByType(inventory, this.state.type);
		return this.inventoryUniqueTokens(data).filter(t => FIXED_TOKENS.indexOf(t) === -1);
	};

	onToggleType = () => {
		this.setState({
			results: [],
			type: this.state.type === 'borrowing' ? 'lending' : 'borrowing'
		});
	};

	onToggleRepayment = () =>
		this.setState({
			results: [],
			repayment: this.state.repayment === 'interest' ? 'interest + principle' : 'interest'
		});

	onTokenChange = selectedToken => this.setState({ selectedToken, results: [] });

	onAmountChange = event => {
		let amount = event.target.value;
		if (isNaN(Number(amount)) || amount < 0) {
			amount = 0;
		}
		this.setState({ amount });
	};

	onPeriodChange = (e, period) => {
		this.setState({ results: [], period });
	};

	onCalculateClick = () => this.calculate();

	calculate() {
		const { inventory } = this.props;
		const { amount, type, period, selectedToken } = this.state;

		// Filter correct type (Lending or Borrowing)
		let results = this.inventoryByType(inventory, type);

		// Filters offers with min and max Loan
		results = results.filter(offer => {
			return (
				Number(offer.data.maxLoan.replace(/[^0-9.-]+/g, '')) <= amount &&
				Number(offer.data.minLoan.replace(/[^0-9.-]+/g, '')) >= amount
			);
		});

		// Filters loan term
		results = results.filter(offer => {
			return Number(offer.data.maxLoanTerm.replace(/[^0-9.-]+/g, '')) >= period;
		});

		// Filters by asset
		results = results.filter(offer => {
			offer.data.assets.includes(selectedToken);
		});

		this.setState({ results });
	}

	render() {
		const { classes } = this.props;
		const { type, period, amount, selectedToken, repayment } = this.state;

		return (
			<React.Fragment>
				<Grid container direction="column" justify="flex-start" spacing={4}>
					<Grid item>
						<Typography variant="overline" gutterBottom>
							I want to
						</Typography>
						<ToggleButton
							value="checked"
							selected={type === 'borrowing'}
							onChange={this.onToggleType}
						>
							<Typography variant="h5">Borrow</Typography>
						</ToggleButton>
						<ToggleButton
							value="checked"
							selected={type === 'lending'}
							onChange={this.onToggleType}
						>
							<Typography variant="h5">Lend</Typography>
						</ToggleButton>
					</Grid>
					<Grid item>
						<Grid container direction="row" justify="flex-start" spacing={8}>
							<Grid item className={classes.gridCell}>
								<Typography variant="overline" gutterBottom>
									My Crypto
								</Typography>
								{FIXED_TOKENS.map(token => (
									<ToggleButton
										key={token}
										value="checked"
										selected={selectedToken === token}
										onChange={() => this.onTokenChange(token)}
									>
										<Typography variant="h5">{token}</Typography>
									</ToggleButton>
								))}
								<Select
									name="asset"
									className={classes.selectTokens}
									IconComponent={KeyboardArrowDown}
									input={<Input disableUnderline />}
									value={selectedToken}
									displayEmpty={true}
									onChange={e => this.onTokenChange(e.target.value)}
								>
									<MenuItem value="">
										<em>Other...</em>
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
									Loan Amonunt
								</Typography>
								<Input
									type="text"
									value={amount}
									placeholder="0.00"
									onChange={this.onAmountChange}
								/>
								<Button
									variant="outlined"
									size="large"
									className={classes.sourceInput}
								>
									USD
									<TransferIcon />
								</Button>
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
									valueLabelDisplay="auto"
									aria-labelledby="range-slider"
								/>
							</Grid>
							<Grid item className={classes.gridCell}>
								<Typography variant="overline" gutterBottom>
									Repayment
								</Typography>
								<ToggleButton
									value="checked"
									selected={repayment === 'interest'}
									onChange={this.onToggleRepayment}
								>
									<Typography variant="h5">Interest</Typography>
								</ToggleButton>
								<ToggleButton
									value="checked"
									selected={repayment === 'interest + principle'}
									onChange={this.onToggleRepayment}
								>
									<Typography variant="h5">Interest + Principe</Typography>
								</ToggleButton>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<Button variant="contained" size="large" onClick={this.onCalculateClick}>
							Calculate
						</Button>
					</Grid>
				</Grid>
				<div className={classes.resultsTableContainer}>
					{type === 'borrowing' && (
						<LoansCalculatorBorrowTable data={this.state.results} />
					)}
					{type === 'lending' && <LoansCalculatorLendTable data={this.state.results} />}
				</div>
			</React.Fragment>
		);
	}
}

const LoansCalculator = withStyles(styles)(LoansCalculatorComponent);
export default LoansCalculator;
export { LoansCalculator };
