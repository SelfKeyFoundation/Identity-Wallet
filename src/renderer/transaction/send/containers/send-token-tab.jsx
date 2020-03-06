import React, { PureComponent } from 'react';
import { Input, Button, Divider, Grid, Typography } from '@material-ui/core';
import injectSheet from 'react-jss';
import { debounce, over } from 'lodash';
import { NumberFormat, TransactionFeeBox } from 'selfkey-ui';
import { InputTitle } from '../../../common/input-title';
import { transactionOperations } from '../../../../common/transaction';

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
	static UPDATE_DELAY = 1000;
	async componentDidMount() {
		window.scrollTo(0, 0);
	}

	withLock = targetFunction => over([this.lockTransaction, targetFunction]);

	handleGasLimitChange = debounce(
		value => this.props.dispatch(transactionOperations.setLimitPrice(value)),
		SendTokenTabComponent.UPDATE_DELAY
	);

	handleGasPriceChange = debounce(
		value => this.props.dispatch(transactionOperations.setGasPrice(value)),
		SendTokenTabComponent.UPDATE_DELAY
	);

	renderButtons() {
		const { classes, addressError, address, ethFee, locked, sending } = this.props;
		const sendBtnIsEnabled =
			address && +this.state.amount && !addressError && ethFee && !locked;

		if (sending) {
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

	render() {
		const {
			classes,
			locale,
			fiatCurrency,
			amountUsd,
			amount,
			address,
			addressError,
			handleAmountChange,
			handleAllAmountClick,
			handleAddressChange
		} = this.props;
		const labelInputClass = `${addressError ? classes.errorColor : ''}`;
		console.log(this.props);
		return (
			<>
				<div className={classes.bottomSpace}>Available: {amount}</div>
				<div className={classes.tokenBottomSpace}>
					<InputTitle title="Amount" />
					<div className={classes.tokenMax}>
						<Input
							type="text"
							onChange={handleAmountChange}
							value={amount}
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
							onChange={handleAddressChange}
							value={address}
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

				<TransactionFeeBox
					changeGasLimitAction={this.withLock(this.handleGasLimitChange)}
					changeGasPriceAction={this.withLock(this.handleGasPriceChange)}
					reloadEthGasStationInfoAction={this.loadData}
					{...this.props}
				/>
				{this.renderButtons()}
			</>
		);
	}
}

export const SendTokenTab = injectSheet(styles)(SendTokenTabComponent);

export default SendTokenTab;
