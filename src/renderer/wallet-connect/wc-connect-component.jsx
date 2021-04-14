import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Popup } from '../common/popup';
import { Typography, Grid, Button } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import { WalletConnectIcon } from 'selfkey-ui';

const useStyles = makeStyles({
	icon: {
		width: 50,
		height: 50,
		background: 'transparent'
	},
	message: {
		width: 300,
		overflowWrap: 'break-word'
	},
	actions: {
		marginTop: 20
	}
});

export const WcConnectComponent = ({ onCancel, peerMeta, message, address, onSignMessage }) => {
	const classes = useStyles();
	const { description, url } = peerMeta;
	return (
		<Popup closeAction={onCancel} text="WalletConnect - Choose a QR scanning source">
			<Grid container direction="column" alignItems="center" spacing={2}>
				<Grid item>
					<WalletConnectIcon />
				</Grid>

				<Grid item>
					<Typography variant="body1">
						WalletConnect - Choose a QR scanning source
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

				<Grid item className={classes.actions}>
					<Grid container direction="row" spacing={2}>
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

WcConnectComponent.propTypes = {
	peerMeta: PropTypes.object.isRequired,
	onCancel: PropTypes.func.isRequired,
	address: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	onSignMessage: PropTypes.func
};
WcConnectComponent.defaultProps = {
	peerMeta: {}
};

export default WcConnectComponent;
