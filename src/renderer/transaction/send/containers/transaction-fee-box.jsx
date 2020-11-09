import React, { PureComponent } from 'react';
import { ActualTransactionFeeBox } from 'renderer/transaction/send/containers/actual-transaction-fee-box';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Loop as LoopIcon } from '@material-ui/icons';

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
		color: '#00C0D9'
	},
	icon: {
		border: 'solid #00C0D9',
		borderWidth: '0 2px 2px 0',
		display: 'inline-block',
		padding: '4px',
		marginLeft: '5px'
	},
	rightIcon: {
		transform: 'rotate(-45deg)',
		'-webkitTransform': 'rotate(-45deg)'
	},
	downIcon: {
		transform: 'rotate(45deg)',
		'-webkit-transform': 'rotate(45deg)'
	},
	inputsContainer: {
		paddingTop: theme.spacing(6)
	},
	formGroup: {
		display: 'flex',
		flexDirection: 'column',
		'&& label': {
			fontSize: '12px',
			fontWeight: '600',
			marginBottom: theme.spacing(1),
			lineHeight: '15px',
			color: '#93A4AF'
		}
	},
	fullWidth: {
		width: '100%'
	},
	nonceValue: {
		color: '#FFFFFF',
		fontSize: '14px',
		lineHeight: '14px'
	},
	formControl: {
		paddingLeft: theme.spacing(1),
		boxSizing: 'border-box',
		height: '46px',
		width: '178px',
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
	},
	currNetworkStatusContainer: {
		display: 'flex',
		paddingTop: theme.spacing(1)
	},
	currNetworkStatusTitle: {
		color: '#93B0C1',
		fontSize: '13px',
		lineHeight: '19px',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column'
	},
	reloadNetworkIcon: {
		color: '#93B0C1',
		cursor: 'pointer'
	},
	gasPriceValuesContainer: {
		paddingTop: theme.spacing(2),
		'&& p': {
			color: '#FFFFFF',
			fontSize: '14px',
			lineHeight: '26px',
			margin: theme.spacing(0)
		}
	}
});

export class TransactionFeeBoxComponent extends PureComponent {
	state = {
		showAdvanced: this.props.showAdvanced || false,
		gasLimit: this.props.gasLimit,
		gasPrice: this.props.gasPrice
	};

	componentDidUpdate(prevProps) {
		if (
			prevProps.gasLimit !== this.props.gasLimit ||
			prevProps.gasPrice !== this.props.gasPrice
		) {
			this.setState({
				...this.state,
				gasLimit: this.props.gasLimit,
				gasPrice: this.props.gasPrice
			});
		}
	}

	renderActualTransactionFeeBox() {
		return <ActualTransactionFeeBox {...this.props} />;
	}

	toggleShowAdvanced() {
		const { showAdvanced } = this.state;
		this.setState({ ...this.state, showAdvanced: !showAdvanced });
	}

	setGasLimit(event) {
		const value = event.target.value;
		this.setState({ ...this.state, gasLimit: Number(value) });

		if (this.props.changeGasLimitAction) {
			this.props.changeGasLimitAction(value);
		}
	}

	setGasPrice(event) {
		const value = event.target.value;
		this.setState({ ...this.state, gasPrice: Number(value) });

		if (this.props.changeGasPriceAction) {
			this.props.changeGasPriceAction(value);
		}
	}

	renderAdvancedContent() {
		const { classes, ethGasStationInfo, reloadEthGasStationInfoAction, nonce } = this.props;
		return (
			<div className={classes.fullWidth}>
				<Grid
					container
					className={classes.inputsContainer}
					direction="row"
					justify="space-between"
					alignItems="flex-start"
				>
					<div className={classes.formGroup}>
						<label>Gas Price (Gwei)</label>
						<input
							type="text"
							className={classes.formControl}
							value={this.state.gasPrice}
							onChange={e => this.setGasPrice(e)}
						/>
					</div>
					<div>
						<div className={classes.formGroup}>
							<label>Gas Limit</label>
							<input
								type="text"
								value={this.state.gasLimit}
								onChange={e => this.setGasLimit(e)}
								className={classes.formControl}
							/>
						</div>
					</div>
					<div className={classes.formGroup}>
						<label>Nonce</label>
						<span className={classes.nonceValue}> {nonce} </span>
					</div>
				</Grid>
				<Grid container direction="column" justify="center" alignItems="center">
					<div className={classes.currNetworkStatusContainer}>
						<span className={classes.currNetworkStatusTitle}>
							Current Network Status:
						</span>
						<LoopIcon
							onClick={reloadEthGasStationInfoAction}
							classes={{ root: classes.reloadNetworkIcon }}
						/>
					</div>
					<div className={classes.gasPriceValuesContainer}>
						<p> Under 30 Mins: {ethGasStationInfo.safeLow} Gwei </p>
						<p> Under 5 Mins: {ethGasStationInfo.average} Gwei </p>
						<p> Under 2 Mins: {ethGasStationInfo.fast} Gwei </p>
					</div>
				</Grid>
			</div>
		);
	}

	render() {
		let { classes } = this.props;
		let { showAdvanced } = this.state;
		return (
			<Grid
				container
				direction="row"
				justify="space-between"
				alignItems="center"
				className={classes.container}
			>
				<Grid item>
					<Grid container direction="row">
						<Grid item>
							<span className={classes.networkTransactionFeeTitle}>
								Network Transaction Fee:
							</span>
						</Grid>
						<Grid item>{this.renderActualTransactionFeeBox()}</Grid>
					</Grid>
				</Grid>
				<Grid
					item
					className={classes.showAdvancedContainer}
					onClick={() => this.toggleShowAdvanced()}
				>
					<span> Advanced </span>
					{!showAdvanced ? (
						<i className={`${classes.icon}	${classes.rightIcon}`}> </i>
					) : (
						<i className={`${classes.icon}	${classes.downIcon}`}> </i>
					)}
				</Grid>
				{showAdvanced && this.renderAdvancedContent()}
			</Grid>
		);
	}
}

export const TransactionFeeBox = withStyles(styles)(TransactionFeeBoxComponent);

export default TransactionFeeBox;
