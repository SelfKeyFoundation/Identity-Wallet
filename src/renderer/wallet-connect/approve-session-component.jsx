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
	},
	gridItem: {
		textAlign: 'center'
	}
});

export const ApproveSessionComponent = ({
	onCancel,
	peerMeta,
	onSwitchWallet,
	address,
	onApprove
}) => {
	const classes = useStyles();
	const { name, description, url, icons = [] } = peerMeta;
	const [icon] = icons;
	return (
		<Popup closeAction={onCancel} text="WalletConnect Connection Request">
			<Grid container direction="column" alignItems="center" spacing={2}>
				{icon && (
					<Grid item>
						<img src={icon} className={classes.icon} />
					</Grid>
				)}
				<Grid item className={classes.gridItem}>
					<Typography variant="body1">
						{name || 'An application'} is requesting permission to connect to your
						wallet
					</Typography>
					{description && (
						<Typography variant="subtitle1" color="secondary">
							{description}
						</Typography>
					)}
				</Grid>

				{url && (
					<Grid item className={classes.gridItem}>
						<Typography variant="body1">{url}</Typography>
					</Grid>
				)}
				{address && (
					<Grid item className={classes.gridItem}>
						<Typography variant="subtitle1" color="secondary">
							Wallet address is:
						</Typography>
						<div style={{ marginTop: '5px' }}>
							<Typography variant="subtitle">{address}</Typography>
						</div>
					</Grid>
				)}
				<Grid item className={classes.actions}>
					<Grid container direction="row" spacing={2}>
						{!address && (
							<Grid item>
								<Button variant="contained" size="large" onClick={onSwitchWallet}>
									Unlock Wallet
								</Button>
							</Grid>
						)}
						{address && (
							<Grid item>
								<Button variant="contained" size="large" onClick={onApprove}>
									Approve
								</Button>
							</Grid>
						)}
						{address && (
							<Grid item>
								<Button variant="outlined" size="large" onClick={onSwitchWallet}>
									Switch Wallet
								</Button>
							</Grid>
						)}
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

ApproveSessionComponent.propTypes = {
	peerMeta: PropTypes.object.isRequired,
	onCancel: PropTypes.func.isRequired,
	address: PropTypes.string,
	onSwitchWallet: PropTypes.func.isRequired,
	onApprove: PropTypes.func
};
ApproveSessionComponent.defaultProps = {
	peerMeta: {}
};

export default ApproveSessionComponent;
