import React, { PureComponent } from 'react';
import EthUnits from 'common/utils/eth-units';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { NumberFormat } from 'selfkey-ui';
import { CustomTransactionSettings } from './custom-transaction-settings';

const DEFAULT_ETH_GAS_LIMIT = 21000;

const styles = theme => ({
	container: {
		fontFamily: 'Lato, arial, sans-serif'
	},
	networkTransactionFeeTitle: {
		paddingRight: '5px',
		color: '#93B0C1',
		fontSize: '16px'
	},
	showAdvancedContainer: {
		cursor: 'pointer',
		fontSize: '14px',
		color: '#00C0D9',
		margin: '3em auto 2em auto',
		textAlign: 'center'
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
		'-webkit-transform': 'rotate(45deg)'
	},
	transactionFeeContainer: {
		display: 'grid',
		gridTemplateColumns: '180px 1fr',
		alignItems: 'center',
		columnGap: '1em'
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
	}
});

export class TransactionFeeBoxComponent extends PureComponent {
	state = {
		showAdvanced: this.props.showAdvanced || false
	};

	getFee(type) {
		return this.props.ethGasStationInfo[type];
	}

	getFeeInEth(type, digits = false) {
		const gasPrice = this.getFee(type);
		const gasLimit = this.props.gasLimit || DEFAULT_ETH_GAS_LIMIT;
		const ethFee = EthUnits.toEther(gasPrice * gasLimit, 'gwei');
		return digits ? Number.parseFloat(ethFee).toFixed(digits) : ethFee;
	}

	getFeeUsd(type) {
		const { ethRate } = this.props;
		const ethFee = this.getFeeInEth(type);
		return ethFee * ethRate;
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

	selectPreDefinedGas = (type = 'average') => {
		const { changeGasPriceAction } = this.props;
		const gasPrice = this.props.ethGasStationInfo[type];
		if (changeGasPriceAction) {
			changeGasPriceAction(gasPrice);
		}
	};

	render() {
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
							<Typography variant="body2" color="white">
								Slow
							</Typography>
							<div className={classes.fiatPrice}>
								<Typography variant="subtitle2" color="white">
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
									/>
								</Typography>
								<Typography variant="subtitle2" color="secondary">
									USD
								</Typography>
							</div>
						</div>
						<div
							className={`${
								this.props.gasPrice === this.getFee('average') ? 'selected' : ''
							}`}
							onClick={() => this.selectPreDefinedGas('average')}
						>
							<Typography variant="body2" color="white">
								Average
							</Typography>
							<div className={classes.fiatPrice}>
								<Typography variant="subtitle2" color="white">
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
									/>
								</Typography>
								<Typography variant="subtitle2" color="secondary">
									USD
								</Typography>
							</div>
						</div>
						<div
							className={`${
								this.props.gasPrice === this.getFee('fast') ? 'selected' : ''
							}`}
							onClick={() => this.selectPreDefinedGas('fast')}
						>
							<Typography variant="body2" color="white">
								Fast
							</Typography>
							<div className={classes.fiatPrice}>
								<Typography variant="subtitle2" color="white">
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
									/>
								</Typography>
								<Typography variant="subtitle2" color="secondary">
									USD
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
}

/*
AllowanceEditor.propTypes = {
	showAdvanced: PropTypes.bool,
	ethGasStationInfo: PropTypes.object,
	reloadEthGasStationInfoAction: PropTypes.func,
	changeGasLimitAction: PropTypes.func,
	changeGasPriceAction: PropTypes.func,
	changeNonceAction: PropTypes.func,
	fiatCurrency: PropTypes.string,
	locale: PropTypes.string,
	gasLimit: PropTypes.string,
	gasPrice: PropTypes.string,
	nonce: PropTypes.string,
	ethRate: PropTypes.string
};
*/

export const TransactionFeeBox = withStyles(styles)(TransactionFeeBoxComponent);

export default TransactionFeeBox;
