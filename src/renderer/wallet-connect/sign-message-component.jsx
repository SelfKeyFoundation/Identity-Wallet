import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Popup } from '../common/popup';
import { Typography, Grid, Button, Divider } from '@material-ui/core';
import { PropTypes } from 'prop-types';

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

export const SignMessageComponent = ({ onCancel, peerMeta, message, address, onSignMessage }) => {
	const classes = useStyles();
	const { name, url, icons = [] } = peerMeta;
	const [icon] = icons;
	return (
		<Popup closeAction={onCancel} text="WalletConnect Sign message request">
			<Grid container direction="column" alignItems="center" spacing={2}>
				<Grid item>
					<Grid container direction="row" spacing={2} alignItems="center">
						{icon && (
							<Grid item>
								<img src={icon} className={classes.icon} />
							</Grid>
						)}
						<Grid item>
							{name || 'An application'} is requesting to Sign a Message
							<br />
							<Typography variant="subtitle2" color="secondary">
								{url}
							</Typography>
						</Grid>
					</Grid>
				</Grid>

				<Divider className={classes.divider} />

				<Grid item className={classes.gridItem}>
					<Typography variant="subtitle1" color="secondary">
						Current Wallet Address
					</Typography>
					<div>
						<Typography variant="body2" style={{ fontFamily: 'monospace' }}>
							{address}
						</Typography>
					</div>
				</Grid>

				<Grid item className={classes.gridItem}>
					<Typography variant="subtitle1" color="secondary">
						Message
					</Typography>
					<div>
						<Typography variant="body2" style={{ fontFamily: 'monospace' }}>
							{message}
						</Typography>
					</div>
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
