import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { Loop as LoopIcon } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
	transactionFeeContainer: {
		display: 'grid',
		gridTemplateColumns: '180px 1fr',
		alignItems: 'center',
		columnGap: '1em'
	},
	reloadAction: {
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer',
		marginTop: '0.5em'
	},
	reloadNetworkIcon: {
		color: '#93B0C1',
		cursor: 'pointer',
		width: '0.8em'
	},
	gasPriceValuesContainer: {
		paddingTop: '15px;',
		'& div': {
			display: 'flex',
			justifyContent: 'flex-start',
			marginBottom: '0.25em'
		},
		'& h6': {
			marginRight: '5px'
		}
	},
	customForm: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr 1fr',
		gridGap: '5px'
	},
	formGroup: {
		display: 'flex',
		flexDirection: 'column',
		'&& label': {
			fontSize: '12px',
			fontWeight: '600',
			marginBottom: '10px',
			lineHeight: '15px',
			color: '#93A4AF'
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
}));

export const CustomTransactionSettings = ({
	ethGasStationInfo,
	reloadEthGasStationInfoAction,
	nonce,
	gasPrice,
	gasLimit,
	setNonce,
	setGasPrice,
	setGasLimit
}) => {
	const classes = useStyles();
	return (
		<div className={classes.transactionFeeContainer}>
			<div>
				<div>
					<div className={classes.gasPriceValuesContainer}>
						<div>
							<Typography variant="subtitle2" color="secondary">
								Under 30 Mins:
							</Typography>
							<Typography variant="subtitle2" color="white">
								{ethGasStationInfo.safeLow} Gwei
							</Typography>
						</div>
						<div>
							<Typography variant="subtitle2" color="secondary">
								Under 5 Mins:
							</Typography>
							<Typography variant="subtitle2" color="white">
								{ethGasStationInfo.average} Gwei
							</Typography>
						</div>
						<div>
							<Typography variant="subtitle2" color="secondary">
								Under 2 Mins:
							</Typography>
							<Typography variant="subtitle2" color="white">
								{ethGasStationInfo.fast} Gwei
							</Typography>
						</div>
					</div>
				</div>
			</div>
			<div className={classes.customForm}>
				<div className={classes.formGroup}>
					<label>Gas Price (Gwei)</label>
					<input
						type="text"
						className={classes.formControl}
						value={gasPrice}
						onChange={e => setGasPrice(e)}
					/>
				</div>
				<div className={classes.formGroup}>
					<label>Gas Limit</label>
					<input
						type="text"
						value={gasLimit}
						onChange={e => setGasLimit(e)}
						className={classes.formControl}
					/>
				</div>
				<div className={classes.formGroup}>
					<label>Nonce</label>
					<input
						type="text"
						value={nonce}
						onChange={e => setNonce(e)}
						className={classes.formControl}
					/>
				</div>
			</div>

			<div onClick={reloadEthGasStationInfoAction} className={classes.reloadAction}>
				<Typography variant="subtitle2" color="secondary">
					Refresh
				</Typography>
				<LoopIcon classes={{ root: classes.reloadNetworkIcon }} />
			</div>
		</div>
	);
};

CustomTransactionSettings.propTypes = {
	ethGasStationInfo: PropTypes.object,
	reloadEthGasStationInfoAction: PropTypes.func,
	nonce: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	gasPrice: PropTypes.number,
	gasLimit: PropTypes.number,
	setNonce: PropTypes.func,
	setGasPrice: PropTypes.func,
	setGasLimit: PropTypes.func
};

export default CustomTransactionSettings;
