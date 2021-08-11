import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Popup } from '../common/popup';
import { NumberFormat } from 'selfkey-ui';
import { Typography, Grid, Button, Divider } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import EthUnits from 'common/utils/eth-units';
import TransactionFeeBox from '../transaction/send/components/transaction-fee-box';

const useStyles = makeStyles({
	gridItem: {
		textAlign: 'center'
	},
	gridItemLeft: {
		textAlign: 'left',
		display: 'flex',
		alignItems: 'center',
		gap: '10px'
	},
	icon: {
		width: 30,
		height: 30,
		background: 'transparent'
	},
	data: {
		width: 300,
		overflowWrap: 'break-word',
		fontFamily: 'monospace',
		padding: '5px',
		border: '1px solid #384656',
		marginTop: '5px'
	},
	actions: {
		marginTop: 20
	},
	divider: {
		margin: '20px 0'
	},
	balance: {
		color: '#fff',
		fontWeight: 'bold',
		marginLeft: '.5em'
	},
	bottomSpace: {
		marginBottom: '20px'
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
	}
});

const getFeeInEth = (gasPrice, gasLimit, digits) => {
	let ethFee = EthUnits.toEther(gasPrice * gasLimit, 'gwei');
	return digits ? Number.parseFloat(ethFee).toFixed(digits) : ethFee;
};

const getFeeUsd = (ethRate, gasPrice, gasLimit, digits) => {
	const ethFee = getFeeInEth(gasPrice, gasLimit, digits);
	return ethFee * ethRate;
};

export const TransactionComponent = ({
	onCancel,
	peerMeta,
	address,
	method,
	tx,
	onApprove,
	ethGasStationInfo,
	fiatCurrency,
	locale,
	ethRate,
	handleGasLimitChange,
	handleGasPriceChange,
	handleMaxPriorityFeeChange,
	reloadEthGasStationInfoAction,
	handleNonceChange,
	gasPrice,
	gasLimit,
	nonce = '',
	maxPriorityFee,
	cryptoCurrency = 'ETH',
	amount = 0,
	balance = 0,
	amountUsd = 0,
	eip1559 = true
}) => {
	const classes = useStyles();
	const { name, url, icons = [] } = peerMeta;
	const [icon] = icons;

	const action = method === 'eth_signTransaction' ? 'sign' : 'send';

	return (
		<Popup closeAction={onCancel} text={`WalletConnect request from ${name}`}>
			<Grid container direction="column" alignItems="center" spacing={2}>
				<Grid item>
					<Grid container direction="row" spacing={2} alignItems="center">
						{icon && (
							<Grid item>
								<img src={icon} className={classes.icon} />
							</Grid>
						)}
						<Grid item>
							{name || 'An application'} is requesting to {action} a transaction
							<br />
							<Typography variant="subtitle2" color="secondary">
								{url}
							</Typography>
						</Grid>
					</Grid>
				</Grid>

				<Divider className={classes.divider} />

				{/*
				<Grid item>
					<Typography variant="subtitle1" color="secondary">
						Current address is
					</Typography>
					<div>
						<Typography variant="body2">{address}</Typography>
					</div>
				</Grid>
				*/}
				<Grid item className={classes.gridItemLeft}>
					<Typography variant="subtitle1" color="secondary">
						From
					</Typography>
					<div>
						<Typography variant="body2">{tx.from}</Typography>
					</div>
				</Grid>
				<Grid item className={classes.gridItemLeft}>
					<Typography variant="subtitle1" color="secondary">
						To
					</Typography>
					<div>
						<Typography variant="body2">{tx.to}</Typography>
					</div>
				</Grid>
				{tx.value && (
					<Grid item className={classes.gridItem}>
						<Typography variant="subtitle1" color="secondary">
							Amount
						</Typography>
						<div>
							<Typography variant="body2">
								{EthUnits.unitToUnit(tx.value, 'wei', 'ether')} ETH
							</Typography>
						</div>

						<div>
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
										value={
											EthUnits.unitToUnit(tx.value, 'wei', 'ether') * ethRate
										}
										fractionDigits={2}
									/>
								</Typography>
								<Typography variant="subtitle2" color="secondary">
									USD
								</Typography>
							</div>
						</div>
					</Grid>
				)}
				{!!tx.data && (
					<Grid item className={classes.gridItem}>
						<Typography variant="subtitle1" color="secondary">
							Data:
						</Typography>
						<Typography variant="subtitle1" className={classes.data}>
							{tx.data}
						</Typography>
					</Grid>
				)}

				<Divider className={classes.divider} />

				<Grid item className={classes.gridItem}>
					<Typography variant="subtitle1" color="secondary">
						Gas Fee
					</Typography>
					<div>
						<Typography variant="body2">
							{getFeeInEth(gasPrice, gasLimit)} ETH
						</Typography>
					</div>

					<div className={classes.bottomSpace}>
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
									value={getFeeUsd(ethRate, gasPrice, gasLimit)}
									fractionDigits={2}
								/>
							</Typography>
							<Typography variant="subtitle2" color="secondary">
								USD
							</Typography>
						</div>
					</div>
				</Grid>

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
					amount={tx.value}
					eip1559={eip1559}
					maxPriorityFee={maxPriorityFee}
					changeMaxPriorityFeeAction={handleMaxPriorityFeeChange}
				/>
				{/*
				<Grid item>
					<Typography variant="body1">Gas Limit: {tx.gas}</Typography>
				</Grid>
				<Grid item>
					<Typography variant="body1">Gas Price: {tx.gasPrice} WEI</Typography>
				</Grid>
				{!!tx.nonce && (
					<Grid item>
						<Typography variant="body1">Nonce: {tx.nonce}</Typography>
					</Grid>
				)}
				<Grid item>
					<Typography variant="body1">Value: {tx.value || 0} WEI</Typography>
				</Grid>
				{!!tx.data && (
					<Grid item className={classes.data}>
						<Typography variant="h3">Data:</Typography>
						<Typography variant="subtitle1">{tx.data}</Typography>
					</Grid>
				)}
				*/}

				<Grid item className={classes.actions}>
					<Grid container direction="row" spacing={2}>
						<Grid item>
							<Button variant="contained" size="large" onClick={onApprove}>
								Approve
							</Button>
						</Grid>

						<Grid item>
							<Button variant="outlined" size="large" onClick={onCancel}>
								Cancel
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	);
};

TransactionComponent.propTypes = {
	peerMeta: PropTypes.object.isRequired,
	onCancel: PropTypes.func.isRequired,
	address: PropTypes.string.isRequired,
	tx: PropTypes.object.isRequired,
	method: PropTypes.string.isRequired,
	onApprove: PropTypes.func
};
TransactionComponent.defaultProps = {
	peerMeta: {},
	tx: {}
};

export default TransactionComponent;
