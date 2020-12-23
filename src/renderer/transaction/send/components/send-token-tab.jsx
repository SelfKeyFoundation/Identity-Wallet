import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Input, Button, Divider, Typography } from '@material-ui/core';
import { NumberFormat } from 'selfkey-ui';
import { InputTitle } from '../../../common/input-title';
import { TransactionFeeBox } from './transaction-fee-box';

const styles = {
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
	actionButtonsContainer: {
		paddingTop: '50px'
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
	},
	tabs: {
		marginBottom: '50px'
	}
};

class SendTokenTabComponent extends PureComponent {
	renderButtons() {
		const {
			classes,
			addressError,
			address,
			ethFee,
			locked,
			amount,
			sending,
			handleConfirm,
			handleCancel,
			handleSend
		} = this.props;
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
							onClick={handleSend}
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
			cryptoCurrency,
			classes,
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
			reloadEthGasStationInfoAction
		} = this.props;
		const labelInputClass = `${addressError ? classes.errorColor : ''}`;
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
										{parseFloat(this.props.balance).toFixed(5)}{' '}
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
								<Button
									onClick={handleAllAmountClick}
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
						{this.renderButtons()}
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}

export const SendTokenTab = withStyles(styles)(SendTokenTabComponent);

export default SendTokenTab;
