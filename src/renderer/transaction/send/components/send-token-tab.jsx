import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Input, Button, Divider, Typography } from '@material-ui/core';
import { NumberFormat } from 'selfkey-ui';
import { InputTitle } from '../../../common/input-title';
import { TransactionFeeBox } from './transaction-fee-box';

const useStyles = makeStyles(theme => ({
	balance: {
		color: '#fff',
		fontWeight: 'bold',
		marginLeft: '.5em'
	},
	bottomSpace: {
		marginBottom: '20px'
	},
	divider: {
		margin: '40px 0'
	},
	tokenMax: {
		display: 'flex',
		flexWrap: 'nowrap',
		marginBottom: '5px'
	},
	tokenBottomSpace: {
		marginBottom: '30px'
	},
	flexColumn: {
		flexDirection: 'column'
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
	}
}));

export const SendTokenTab = ({
	balance,
	cryptoCurrency,
	amountUsd,
	fiatCurrency,
	locale,
	addressError,
	address,
	amount,
	handleAddressChange,
	handleAmountChange,
	handleGasLimitChange,
	handleGasPriceChange,
	handleNonceChange,
	handleAllAmountClick,
	ethGasStationInfo,
	reloadEthGasStationInfoAction,
	gasLimit,
	gasPrice,
	nonce,
	ethFee,
	ethRate,
	sending,
	locked,
	handleSend,
	handleCancel,
	handleConfirm
}) => {
	const classes = useStyles();
	const labelInputClass = `${addressError ? classes.errorColor : ''}`;
	const sendBtnIsEnabled = address && +amount && !addressError && ethFee && !locked;
	return (
		<React.Fragment>
			<div className={classes.bottomSpace}>
				<InputTitle title="Send to" />
				<div className={`${classes.tokenMax} ${classes.flexColumn}`}>
					<Input
						type="text"
						onChange={handleAddressChange}
						value={address}
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

			{address && !addressError && (
				<React.Fragment>
					<div className={classes.bottomSpace}>
						<InputTitle
							title={`Amount${
								cryptoCurrency !== 'custom' ? ` (${cryptoCurrency})` : ''
							}`}
						/>
						<div style={{ marginBottom: '3px' }}>
							<Typography variant="subtitle2" color="secondary">
								Balance:
								<span className={classes.balance}>
									{parseFloat(balance).toFixed(5)}{' '}
									{cryptoCurrency !== 'custom' ? cryptoCurrency : ''}
								</span>
							</Typography>
						</div>
						<div className={classes.tokenMax}>
							<Input
								type="text"
								onChange={handleAmountChange}
								value={`${amount}`}
								placeholder="0.00"
								className={classes.amount}
								fullWidth
							/>
							<Button onClick={handleAllAmountClick} variant="outlined" size="large">
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
									fractionDigits={2}
								/>
							</Typography>
							<Typography variant="subtitle2" color="secondary">
								USD
							</Typography>
						</div>
					</div>

					<Divider className={classes.divider} />

					<TransactionFeeBox
						showAdvanced={false}
						ethGasStationInfo={ethGasStationInfo}
						fiatCurrency={fiatCurrency}
						locale={locale}
						gasLimit={gasLimit}
						gasPrice={gasPrice}
						nonce={nonce}
						ethRate={ethRate}
						changeGasLimitAction={handleGasLimitChange}
						changeGasPriceAction={handleGasPriceChange}
						changeNonceAction={handleNonceChange}
						reloadEthGasStationInfoAction={reloadEthGasStationInfoAction}
						cryptoCurrency={cryptoCurrency}
						address={address}
						amount={amount}
					/>

					<Divider className={classes.divider} />

					{sending && (
						<Grid
							container
							direction="row"
							justify="center"
							alignItems="center"
							className={classes.actionButtonsContainer}
							spacing={3}
						>
							<Grid item>
								<Button variant="contained" size="large" onClick={handleConfirm}>
									CONFIRM
								</Button>
							</Grid>
							<Grid item>
								<Button variant="outlined" size="large" onClick={handleCancel}>
									CANCEL
								</Button>
							</Grid>
						</Grid>
					)}
					{!sending && (
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
									onClick={handleSend}
									variant="contained"
									size="large"
								>
									SEND
								</Button>
							</Grid>
						</Grid>
					)}
				</React.Fragment>
			)}
		</React.Fragment>
	);
};

SendTokenTab.propTypes = {
	balance: PropTypes.string,
	cryptoCurrency: PropTypes.string,
	amountUsd: PropTypes.number,
	fiatCurrency: PropTypes.string,
	locale: PropTypes.string,
	addressError: PropTypes.bool,
	address: PropTypes.string,
	amount: PropTypes.number,
	handleAddressChange: PropTypes.func,
	handleAmountChange: PropTypes.func,
	handleGasLimitChange: PropTypes.func,
	handleGasPriceChange: PropTypes.func,
	handleNonceChange: PropTypes.func,
	handleAllAmountClick: PropTypes.func,
	ethGasStationInfo: PropTypes.object,
	reloadEthGasStationInfoAction: PropTypes.func,
	gasLimit: PropTypes.number,
	gasPrice: PropTypes.number,
	nonce: PropTypes.number,
	ethFee: PropTypes.number,
	ethRate: PropTypes.number,
	sending: PropTypes.bool,
	locked: PropTypes.bool,
	handleSend: PropTypes.func,
	handleCancel: PropTypes.func,
	handleConfirm: PropTypes.func
};

export default SendTokenTab;
