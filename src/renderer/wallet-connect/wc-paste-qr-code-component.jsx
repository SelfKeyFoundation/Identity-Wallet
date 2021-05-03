import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Popup } from '../common/popup';
import { Typography, Input, Grid, Button } from '@material-ui/core';
// import { PropTypes } from 'prop-types';
import { QRCodeIcon } from 'selfkey-ui';

const useStyles = makeStyles({
	description: {
		margin: '10px auto',
		maxWidth: '400px',
		lineHeight: '1.4',
		textAlign: 'center'
	},
	input: {
		width: '400px'
	},
	actions: {
		marginTop: 20
	}
});

export const WcPasteQRCodeComponent = ({
	onCancel,
	connectionString = '',
	onConnect,
	onChangeConnectionString,
	isLoading
}) => {
	const classes = useStyles();
	return (
		<Popup closeAction={onCancel} text="WalletConnect - Paste Wallet Connect QR Code">
			<Grid container direction="column" alignItems="center" spacing={2}>
				<Grid item>
					<QRCodeIcon width="100" />
				</Grid>

				<Grid item className={classes.description}>
					<Typography variant="body2" color="secondary">
						Click the copy to clipboard option in the wallet connect QR code popup and
						paste it in the text field below
					</Typography>
				</Grid>

				<Grid item>
					<Input
						type="text"
						id="addressInput"
						onChange={onChangeConnectionString}
						value={connectionString}
						placeholder=""
						className={classes.input}
					/>
				</Grid>

				<Grid item className={classes.actions}>
					<Grid container direction="row" spacing={2}>
						<Grid item>
							{isLoading && (
								<Button variant="contained" size="large" disabled>
									Connecting ...
								</Button>
							)}
							{!isLoading && (
								<Button variant="contained" size="large" onClick={onConnect}>
									Connect
								</Button>
							)}
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

// WcPasteQRCodeComponent.propTypes = {};
// WcPasteQRCodeComponent.defaultProps = {};

export default WcPasteQRCodeComponent;
