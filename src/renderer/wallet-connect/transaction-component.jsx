import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Popup } from '../common/popup';
import { Typography, Grid, Button } from '@material-ui/core';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles({
	icon: {
		width: 50,
		height: 50,
		background: 'transparent'
	},
	actions: {
		marginTop: 20
	}
});

export const TransactionComponent = ({ onCancel, peerMeta, address, method, tx, onApprove }) => {
	const classes = useStyles();
	const { name, description, url, icons = [] } = peerMeta;
	const [icon] = icons;

	const action = method === 'eth_signTransaction' ? 'sign' : 'send';

	return (
		<Popup closeAction={onCancel} text={`WalletConnect ${action} transaction request`}>
			<Grid container direction="column" alignItems="center" spacing={2}>
				{icon && (
					<Grid item>
						<img src={icon} className={classes.icon} />
					</Grid>
				)}
				<Grid item>
					<Typography variant="body1">
						{name || 'An application'} is requesting to {action} a transaction
					</Typography>
				</Grid>
				{description && (
					<Grid item>
						<Typography variant="body1">{description}</Typography>
					</Grid>
				)}
				{url && (
					<Grid item>
						<Typography variant="body1">{url}</Typography>
					</Grid>
				)}

				<Grid item>
					<Typography variant="body1">Current address is {address}</Typography>
				</Grid>
				<Grid item>
					<Typography variant="body1">From: {tx.from}</Typography>
				</Grid>
				<Grid item>
					<Typography variant="body1">To: {tx.to}</Typography>
				</Grid>
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
					<Typography variant="body1">Value: {tx.value} WEI</Typography>
				</Grid>
				{!!tx.data && (
					<Grid item>
						<Typography variant="body1">Data: {tx.data}</Typography>
					</Grid>
				)}

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
