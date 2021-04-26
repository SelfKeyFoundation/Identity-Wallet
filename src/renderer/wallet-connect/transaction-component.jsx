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
	icon: {
		width: 30,
		height: 30,
		background: 'transparent'
	},
	data: {
		width: 300,
		overflowWrap: 'break-word'
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
	reloadEthGasStationInfoAction,
	handleNonceChange,
	nonce = '',
	cryptoCurrency = 'ETH',
	amount = 0,
	balance = 0,
	amountUsd = 0
}) => {
	const classes = useStyles();
	const { name, url, icons = [] } = peerMeta;
	const [icon] = icons;

	const action = method === 'eth_signTransaction' ? 'sign' : 'send';

	return (
		<Popup closeAction={onCancel} text={`WalletConnect ${action} transaction request`}>
			<Grid container direction="column" alignItems="center" spacing={2}>
				{icon && (
					<Grid item>
						<Grid container direction="row" spacing={2} alignItems="center">
							<Grid item>
								<img src={icon} className={classes.icon} />
							</Grid>
							<Grid item>
								<Typography variant="body2">{url}</Typography>
							</Grid>
						</Grid>
					</Grid>
				)}
				<Grid item className={classes.gridItem}>
					<Typography variant="body2">
						{name || 'An application'} is requesting to {action} a transaction
					</Typography>
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
				<Grid item className={classes.gridItem}>
					<Typography variant="subtitle1" color="secondary">
						From
					</Typography>
					<div>
						<Typography variant="body2">{tx.from}</Typography>
					</div>
				</Grid>
				<Grid item className={classes.gridItem}>
					<Typography variant="subtitle1" color="secondary">
						To
					</Typography>
					<div>
						<Typography variant="body2">{tx.to}</Typography>
					</div>
				</Grid>
				<Grid item className={classes.gridItem}>
					<Typography variant="subtitle1" color="secondary">
						Amount
					</Typography>
					<div>
						<Typography variant="body2">
							{EthUnits.unitToUnit(tx.value, 'wei', 'ether')}
						</Typography>
					</div>

					<div className={classes.bottomSpace}>
						{/*
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
								value={`${amount}`}
								placeholder="0.00"
								className={classes.amount}
								fullWidth
							/>
						</div>
						*/}

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
				</Grid>

				<Divider className={classes.divider} />

				<TransactionFeeBox
					showAdvanced={false}
					ethGasStationInfo={ethGasStationInfo}
					fiatCurrency={fiatCurrency}
					locale={locale}
					gasLimit={tx.gas}
					gasPrice={tx.gasPrice}
					nonce={tx.nonce}
					ethRate={ethRate}
					changeGasLimitAction={handleGasLimitChange}
					changeGasPriceAction={handleGasPriceChange}
					changeNonceAction={handleNonceChange}
					reloadEthGasStationInfoAction={reloadEthGasStationInfoAction}
					cryptoCurrency={cryptoCurrency}
					address={address}
					amount={tx.value}
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
