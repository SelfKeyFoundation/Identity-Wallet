import React, { PureComponent } from 'react';
import EthUnits from 'common/utils/eth-units';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { NumberFormat } from 'selfkey-ui';
import { CustomTransactionSettings } from './custom-transaction-settings';

const DEFAULT_ETH_GAS_LIMIT = 21000;

const styles = theme => ({
	networkTransactionFeeTitle: {
		paddingRight: '5px',
		color: '#93B0C1',
		fontSize: '16px'
	},
	showAdvancedContainer: {
		cursor: 'pointer',
		fontSize: '14px',
		color: '#00C0D9',
		margin: '2em auto 2em auto',
		textAlign: 'center',
		'& *': {
			userSelect: 'none'
		}
	},
	icon: {
		border: 'solid #00C0D9',
		borderWidth: '0 2px 2px 0',
		display: 'inline-block',
		padding: '2px',
		marginLeft: '5px'
	},
	upIcon: {
		transform: 'rotate(-135deg)',
		'-webkitTransform': 'rotate(-135deg)'
	},
	downIcon: {
		transform: 'rotate(45deg)',
		'-webkit-transform': 'rotate(45deg)',
		position: 'relative',
		top: '-2px'
	},
	transactionFeeTitle: {
		textAlign: 'center',
		marginBottom: '1em'
	},
	transactionFeeContainer: {
		display: 'grid',
		gridTemplateColumns: '1fr',
		alignItems: 'center',
		columnGap: '1em',
		margin: '0 2em'
	},
	transactionFeeOptionTitle: {
		marginBottom: '5px'
	},
	transactionExpectedTiming: {
		marginTop: '1em',
		'& *': {
			color: '#4dda4d'
		}
	},
	fiatPrice: {
		display: 'flex'
	},
	transactionFee: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 1fr',
		alignItems: 'center',
		'& > div': {
			padding: '1em',
			color: '#00C0D9',
			fontWeight: 'bold',
			minHeight: '50px',
			textAlign: 'left',
			'& .amount-in-crypto': {
				marginTop: '5px'
			},
			border: '1px solid #384656',
			borderRadius: '5px',
			cursor: 'pointer',
			'&:hover': {
				border: '1px solid #aaa'
			}
		},
		'& div.selected': {
			border: '1px solid #00C0D9',
			'&:hover': {
				border: '1px solid #00C0D9'
			}
		},
		'& div.amount-in-crypto': {
			color: theme.palette.secondary.main,
			fontSize: '13px'
		},
		'& .transactionFee': {
			color: theme.palette.secondary.main
		},
		'& div.price:last-child': {
			textAlign: 'right'
		}
	},
	customForm: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 1fr 1fr',
		gridGap: '5px',
		margin: '0 2em'
	},
	formGroup: {
		display: 'flex',
		flexDirection: 'column',
		'&& label': {
			fontSize: '12px',
			fontWeight: '600',
			marginBottom: '10px',
			lineHeight: '15px',
			color: '#93A4AF',
			marginLeft: '5px'
		}
	},
	formControl: {
		paddingLeft: '12px',
		boxSizing: 'border-box',
		height: '46px',
		width: '100%',
		border: '1px solid #384656',
		borderRadius: '4px',
		backgroundColor: '#1E262E',
		color: '#FFFFFF',
		fontSize: '14px',
		lineHeight: '14px',
		'&:focus': {
			outline: 'none',
			boxShadow: '0 0 5px rgba(81, 203, 238, 1)'
		}
	}
});

export class TransactionFeeBoxComponent extends PureComponent {
	state = {
		showAdvanced: this.props.showAdvanced || false
	};

	typeTranslation(type) {
		switch (type) {
			case 'safeLow':
				return 'low';
			case 'average':
				return 'medium';
			case 'fast':
				return 'high';
		}
	}

	getFee(type) {
		if (!this.props.ethGasStationInfo || !this.props.ethGasStationInfo[type]) {
			return;
		}
		if (this.props.eip1559) {
			return this.props.ethGasStationInfo[type];
		} else {
			return this.props.ethGasStationInfo[type];
		}
	}

	getFeeInEth(type, digits = false) {
		const gasPrice = this.getFee(type);
		const gasLimit = this.props.gasLimit ? this.props.gasLimit : DEFAULT_ETH_GAS_LIMIT;

		const maxFee = this.props.ethGasStationInfo.fees[this.typeTranslation(type)]
			.suggestedMaxFeePerGas;
		const ethFee = EthUnits.toEther((gasPrice + maxFee) * gasLimit, 'gwei');
		return digits ? Number.parseFloat(ethFee).toFixed(digits) : ethFee;
	}

	getFeeUsd(type) {
		const { ethRate } = this.props;
		const ethFee = this.getFeeInEth(type);
		return ethFee * ethRate;
	}

	getTransactionTiming(data) {
		if (data && data.maxWaitTimeEstimate) {
			return `Likely in < ${Math.ceil(data.maxWaitTimeEstimate / 1000 / 60)} min`;
		} else {
			return '';
		}
	}

	getMaxPriorityFee(data) {
		if (data && data.maxPriorityFee) {
			return data.maxPriorityFee;
		}
	}

	toggleShowAdvanced() {
		const { showAdvanced } = this.state;
		this.setState({ ...this.state, showAdvanced: !showAdvanced });
	}

	setGasLimit = event => {
		const value = event.target.value;
		if (this.props.changeGasLimitAction) {
			this.props.changeGasLimitAction(value);
		}
	};

	setGasPrice = event => {
		const value = event.target.value;
		if (this.props.changeGasPriceAction) {
			this.props.changeGasPriceAction(value);
		}
	};

	setNonce = event => {
		const value = event.target.value;
		if (this.props.changeNonceAction) {
			this.props.changeNonceAction(value);
		}
	};

	setMaxPriorityFee = event => {
		const value = event.target.value;
		if (this.props.changeMaxPriorityFeeAction) {
			this.props.changeMaxPriorityFeeAction(value);
		}
	};

	selectPreDefinedGas = type => {
		const { changeGasPriceAction, changeMaxPriorityFeeAction } = this.props;

		if (!this.props.ethGasStationInfo || !this.props.ethGasStationInfo[type]) {
			return;
		}

		const gasPrice = this.props.ethGasStationInfo[type];
		const maxPriorityFee = this.props.ethGasStationInfo.fees[this.typeTranslation(type)]
			.suggestedMaxPriorityFeePerGas;

		if (changeMaxPriorityFeeAction) {
			changeMaxPriorityFeeAction(maxPriorityFee);
		}

		if (changeGasPriceAction) {
			changeGasPriceAction(gasPrice);
		}
	};

	showEip1559() {
		const {
			classes,
			ethGasStationInfo,
			locale,
			fiatCurrency,
			gasPrice,
			gasLimit,
			nonce,
			maxPriorityFee
		} = this.props;
		const { showAdvanced } = this.state;
		return (
			<React.Fragment>
				<div className={classes.transactionFeeTitle}>
					<span className={classes.networkTransactionFeeTitle}>Transaction Fee:</span>
				</div>
				<div className={classes.transactionFeeContainer}>
					<div className={classes.transactionFee}>
						<div
							className={`${
								this.props.gasPrice === this.getFee('safeLow') ? 'selected' : ''
							}`}
							onClick={() => this.selectPreDefinedGas('safeLow')}
						>
							<Typography
								variant="body1"
								color="primary"
								className={classes.transactionFeeOptionTitle}
							>
								<strong>Slow</strong>
							</Typography>
							<div className={classes.fiatPrice}>
								<Typography variant="subtitle2">
									{this.getFeeInEth('safeLow', 8)} ETH
								</Typography>
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
										value={this.getFeeUsd('safeLow')}
										fractionDigits={2}
										showCurrency={true}
									/>
								</Typography>
							</div>
							<div className={classes.transactionExpectedTiming}>
								<Typography variant="subtitle2" color="success">
									{this.getTransactionTiming(ethGasStationInfo.fees.low)}
								</Typography>
							</div>
						</div>
						<div
							className={`${
								this.props.gasPrice === this.getFee('average') ? 'selected' : ''
							}`}
							onClick={() => this.selectPreDefinedGas('average')}
						>
							<Typography
								variant="body1"
								color="primary"
								className={classes.transactionFeeOptionTitle}
							>
								<strong>Medium</strong>
							</Typography>
							<div className={classes.fiatPrice}>
								<Typography variant="subtitle2">
									{this.getFeeInEth('average', 8)} ETH
								</Typography>
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
										value={this.getFeeUsd('average')}
										fractionDigits={2}
										showCurrency={true}
									/>
								</Typography>
							</div>
							<div className={classes.transactionExpectedTiming}>
								<Typography variant="subtitle2" color="success">
									{this.getTransactionTiming(ethGasStationInfo.fees.medium)}
								</Typography>
							</div>
						</div>
						<div
							className={`${
								this.props.gasPrice === this.getFee('fast') ? 'selected' : ''
							}`}
							onClick={() => this.selectPreDefinedGas('fast')}
						>
							<Typography
								variant="body2"
								color="primary"
								className={classes.transactionFeeOptionTitle}
							>
								<strong>Fast</strong>
							</Typography>
							<div className={classes.fiatPrice}>
								<Typography variant="subtitle2">
									{this.getFeeInEth('fast', 8)} ETH
								</Typography>
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
										value={this.getFeeUsd('fast')}
										fractionDigits={2}
										showCurrency={true}
									/>
								</Typography>
							</div>
							<div className={classes.transactionExpectedTiming}>
								<Typography variant="subtitle2" color="success">
									{this.getTransactionTiming(ethGasStationInfo.fees.high)}
								</Typography>
							</div>
						</div>
					</div>
				</div>

				<div
					className={classes.showAdvancedContainer}
					onClick={() => this.toggleShowAdvanced()}
				>
					<span> Advanced </span>
					{!showAdvanced ? (
						<i className={`${classes.icon} ${classes.downIcon}`}> </i>
					) : (
						<i className={`${classes.icon} ${classes.upIcon}`}> </i>
					)}
				</div>

				{showAdvanced && (
					<React.Fragment>
						<div className={classes.customForm}>
							<div className={classes.formGroup}>
								<label>Gas Limit</label>
								<input
									type="text"
									value={gasLimit}
									onChange={e => this.setGasLimit(e)}
									className={classes.formControl}
								/>
							</div>

							<div className={classes.formGroup}>
								<label>Max Priority Fee (Gwei)</label>
								<input
									type="text"
									className={classes.formControl}
									value={Number.parseFloat(maxPriorityFee).toFixed(2)}
									onChange={e => this.setMaxPriorityFee(e)}
								/>
							</div>

							<div className={classes.formGroup}>
								<label>Base Fee (Gwei)</label>
								<input
									type="text"
									className={classes.formControl}
									value={gasPrice}
									onChange={e => this.setGasPrice(e)}
								/>
							</div>

							<div className={classes.formGroup}>
								<label>Nonce</label>
								<input
									type="text"
									value={nonce}
									onChange={e => this.setNonce(e)}
									className={classes.formControl}
								/>
							</div>
						</div>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}

	showDefault() {
		const {
			classes,
			ethGasStationInfo,
			reloadEthGasStationInfoAction,
			nonce,
			locale,
			fiatCurrency,
			gasPrice,
			gasLimit
		} = this.props;
		const { showAdvanced } = this.state;

		return (
			<React.Fragment>
				<div className={classes.transactionFeeContainer}>
					<div>
						<span className={classes.networkTransactionFeeTitle}>Transaction Fee:</span>
					</div>
					<div className={classes.transactionFee}>
						<div
							className={`${
								this.props.gasPrice === this.getFee('safeLow') ? 'selected' : ''
							}`}
							onClick={() => this.selectPreDefinedGas('safeLow')}
						>
							<Typography variant="body2">Slow</Typography>
							<div className={classes.fiatPrice}>
								<Typography variant="subtitle2">
									{this.getFeeInEth('safeLow', 5)} ETH
								</Typography>
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
										value={this.getFeeUsd('safeLow')}
										fractionDigits={2}
										showCurrency={true}
									/>
								</Typography>
							</div>
						</div>
						<div
							className={`${
								this.props.gasPrice === this.getFee('average') ? 'selected' : ''
							}`}
							onClick={() => this.selectPreDefinedGas('average')}
						>
							<Typography variant="body2">Average</Typography>
							<div className={classes.fiatPrice}>
								<Typography variant="subtitle2">
									{this.getFeeInEth('average', 5)} ETH
								</Typography>
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
										value={this.getFeeUsd('average')}
										fractionDigits={2}
										showCurrency={true}
									/>
								</Typography>
							</div>
						</div>
						<div
							className={`${
								this.props.gasPrice === this.getFee('fast') ? 'selected' : ''
							}`}
							onClick={() => this.selectPreDefinedGas('fast')}
						>
							<Typography variant="body2">Fast</Typography>
							<div className={classes.fiatPrice}>
								<Typography variant="subtitle2">
									{this.getFeeInEth('fast', 5)} ETH
								</Typography>
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
										value={this.getFeeUsd('fast')}
										fractionDigits={2}
										showCurrency={true}
									/>
								</Typography>
							</div>
						</div>
					</div>
				</div>
				<div
					className={classes.showAdvancedContainer}
					onClick={() => this.toggleShowAdvanced()}
				>
					<span> Advanced </span>
					{!showAdvanced ? (
						<i className={`${classes.icon} ${classes.downIcon}`}> </i>
					) : (
						<i className={`${classes.icon} ${classes.upIcon}`}> </i>
					)}
				</div>
				{showAdvanced && (
					<CustomTransactionSettings
						ethGasStationInfo={ethGasStationInfo}
						reloadEthGasStationInfoAction={reloadEthGasStationInfoAction}
						nonce={nonce}
						gasPrice={gasPrice}
						gasLimit={gasLimit}
						setNonce={this.setNonce}
						setGasPrice={this.setGasPrice}
						setGasLimit={this.setGasLimit}
					/>
				)}
			</React.Fragment>
		);
	}

	render() {
		if (!this.props.eip1559) {
			return this.showDefault();
		}
		return this.showEip1559();
	}
}

export const TransactionFeeBox = withStyles(styles)(TransactionFeeBoxComponent);

export default TransactionFeeBox;
