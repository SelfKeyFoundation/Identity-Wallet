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
	message: {
		width: 300,
		overflowWrap: 'break-word'
	},
	actions: {
		marginTop: 20
	}
});

export const SignMessageComponent = ({ onCancel, peerMeta, message, address, onSignMessage }) => {
	const classes = useStyles();
	const { name, description, url, icons = [] } = peerMeta;
	const [icon] = icons;
	return (
		<Popup closeAction={onCancel} text="WalletConnect sign message request">
			<Grid container direction="column" alignItems="center" spacing={2}>
				{icon && (
					<Grid item>
						<img src={icon} className={classes.icon} />
					</Grid>
				)}
				<Grid item>
					<Typography variant="body1">
						{name || 'An application'} is requesting to sign a message
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

				<Grid item className={classes.message}>
					<Typography variant="h3">Message:</Typography>
					<Typography variant="body1">{message}</Typography>
				</Grid>

				<Grid item className={classes.actions}>
					<Grid container direction="row" spacing={2}>
						<Grid item>
							<Button variant="contained" size="large" onClick={onSignMessage}>
								Sign Message
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

SignMessageComponent.propTypes = {
	peerMeta: PropTypes.object.isRequired,
	onCancel: PropTypes.func.isRequired,
	address: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	onSignMessage: PropTypes.func
};
SignMessageComponent.defaultProps = {
	peerMeta: {}
};

export default SignMessageComponent;
