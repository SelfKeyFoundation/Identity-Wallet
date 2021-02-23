import React from 'react';
import {
	Grid,
	Typography,
	Button,
	Select,
	MenuItem,
	FormControl,
	Input,
	CircularProgress
} from '@material-ui/core';
import { SelectDropdownIcon, CodeIcon, NumberFormat } from 'selfkey-ui';
import { makeStyles } from '@material-ui/styles';
import { Popup, InputTitle } from '../common';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles(theme => ({
	select: {
		width: '100px'
	},
	fiatPrice: {
		display: 'flex',
		marginTop: '5px',
		'& h6': {
			fontWeight: 'bold'
		}
	},
	fees: {
		display: 'flex',
		marginTop: '3px',
		'& div': {
			marginLeft: '5px'
		}
	},
	info: {
		background: '#313d49',
		padding: '1em',
		marginTop: '0',
		marginBottom: '2em',
		'& a': {
			color: '#00c0d9',
			fontWeight: 'bold',
			marginLeft: '3px'
		}
	}
}));

export const MoonPayTransactionModal = ({
	locale,
	onCloseClick,
	onBuyClick,
	onLinkClick,
	loading,
	disabled,
	quote,
	onCurrencyChange,
	onAmountChange,
	baseCurrencyCode,
	baseAmount,
	currencyCode = 'KEY',
	currencies,
	error
}) => {
	const classes = useStyles();
	return (
		<Popup closeAction={onCloseClick} text="Select amount of KEY to buy">
			<Grid container direction="row" spacing={4}>
				<Grid item xs={2}>
					<CodeIcon />
				</Grid>
				<Grid item xs>
					<Grid container direction="column" spacing={4}>
						<Grid item>
							<Typography variant="h1">
								Indicate amount of {currencyCode} to buy with your credit card
							</Typography>
						</Grid>
						{loading && (
							<Grid item>
								<CircularProgress />
							</Grid>
						)}
						{!loading && (
							<React.Fragment>
								<Grid item>
									<Grid container direction="row" spacing={0}>
										<Grid item>
											<FormControl variant="filled">
												<InputTitle title="Amount" />
												<Input
													fullWidth
													type="text"
													value={baseAmount}
													onChange={onAmountChange}
													placeholder="100"
												/>
											</FormControl>
											{quote && baseAmount > 0 && (
												<div className={classes.fiatPrice}>
													<Typography
														variant="subtitle2"
														color="secondary"
														style={{ marginRight: '3px' }}
													>
														<NumberFormat
															locale={locale}
															priceStyle="decimal"
															currency={currencyCode}
															value={quote.quoteCurrencyAmount}
															fractionDigits={8}
														/>
													</Typography>
													<Typography
														variant="subtitle2"
														color="secondary"
													>
														{currencyCode}
													</Typography>
												</div>
											)}
											{(!baseAmount || !quote) && (
												<div className={classes.fiatPrice}>
													<Typography
														variant="subtitle2"
														color="secondary"
														style={{ marginRight: '3px' }}
													>
														<NumberFormat
															locale={locale}
															priceStyle="decimal"
															currency={currencyCode}
															value={0}
															fractionDigits={8}
														/>
													</Typography>
													<Typography
														variant="subtitle2"
														color="secondary"
													>
														{currencyCode}
													</Typography>
												</div>
											)}
											{quote && quote.totalFees && baseAmount > 0 && (
												<div className={classes.fees}>
													<Typography
														variant="subtitle2"
														color="secondary"
														gutterTop
													>
														Fees:{' '}
													</Typography>
													<Typography variant="subtitle2" gutterTop>
														<NumberFormat
															locale={locale}
															priceStyle="currency"
															currency={baseCurrencyCode}
															value={quote.totalFees}
															fractionDigits={2}
														/>
													</Typography>
												</div>
											)}
										</Grid>
										<Grid item>
											<FormControl variant="filled">
												<InputTitle title="Currency" />
												<Select
													className={classes.select}
													onChange={onCurrencyChange}
													displayEmpty
													name="jurisdiction"
													value={baseCurrencyCode}
													disableUnderline
													IconComponent={SelectDropdownIcon}
													input={<Input disableUnderline />}
												>
													{currencies.map(c => (
														<MenuItem key={c} value={c}>
															{c}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</Grid>
									</Grid>
									{error && (
										<Grid item>
											<Typography
												variant="subtitle2"
												color="error"
												gutterBottom
											>
												{error}
											</Typography>
										</Grid>
									)}
								</Grid>
							</React.Fragment>
						)}
						<Grid item className={classes.info}>
							<Typography variant="subtitle2" color="secondary">
								More information about Moonpay Fees:
								<a
									href="https://support.moonpay.com/hc/en-gb/articles/360011930117-What-fees-do-you-charge-"
									target="_blank"
									rel="noopener noreferrer"
									onClick={onLinkClick}
								>
									here
								</a>
							</Typography>
						</Grid>

						<Grid item>
							<Grid container direction="row" spacing={2}>
								<Grid item>
									<Button
										variant="contained"
										size="large"
										onClick={onBuyClick}
										disabled={loading || disabled || error || !baseAmount}
									>
										Buy {currencyCode}
									</Button>
								</Grid>
								<Grid item>
									<Button variant="outlined" size="large" onClick={onCloseClick}>
										Cancel
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	);
};

MoonPayTransactionModal.propTypes = {
	locale: PropTypes.string,
	onLinkClick: PropTypes.func.isRequired,
	onBuyClick: PropTypes.func.isRequired,
	onCloseClick: PropTypes.func.isRequired,
	onCurrencyChange: PropTypes.func.isRequired,
	onAmountChange: PropTypes.func.isRequired,
	quote: PropTypes.object,
	baseCurrencyCode: PropTypes.string,
	baseAmount: PropTypes.string,
	currencyCode: PropTypes.string,
	currencies: PropTypes.array,
	loading: PropTypes.bool,
	error: PropTypes.string,
	disabled: PropTypes.bool
};

MoonPayTransactionModal.defaultProps = {
	loading: false,
	error: '',
	disabled: false,
	currencyCode: 'KEY'
};

export default MoonPayTransactionModal;
