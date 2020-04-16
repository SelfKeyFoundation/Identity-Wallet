import React, { PureComponent } from 'react';
import QRCode from 'qrcode.react';
import { Popup } from '../../common/popup';
import { Typography, Button, Grid, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	title: {
		marginBottom: '7px'
	},
	buttonContainer: {
		marginTop: '10px'
	},
	popup: {
		boxShadow: 'none',
		'& .paper': {
			boxShadow: '0 7px 15px 0 rgba(0, 0, 0, 0.2)'
		}
	}
});

class WalletExportQRCodeComponent extends PureComponent {
	render() {
		const { classes, onCancel, keystore } = this.props;
		return (
			<Popup open={true} text="Step 2: QR Code" displayLogo popupClass={classes.popup}>
				<Grid
					container
					direction="column"
					justify="flex-start"
					alignItems="center"
					spacing={8}
				>
					<Grid item className={classes.title}>
						<Typography variant="h2">
							Export your SelfKey Wallet to mobile application
						</Typography>
					</Grid>
					<Grid item>
						<Typography variant="body2" color="secondary" gutterBottom>
							Scan the QR Code using the SelfKey mobile application, and follow the
							instructions provided
						</Typography>
					</Grid>
					<Grid item>
						{keystore && keystore.length ? (
							<QRCode
								size={500}
								bgColor={'#262f39'}
								fgColor={'#ffffff'}
								includeMargin={true}
								renderAs={'svg'}
								value={keystore}
							/>
						) : (
							<CircularProgress />
						)}
					</Grid>
					<Grid item>
						<Typography variant="subtitle2" color="secondary" gutterBottom>
							Don’t have the mobile app yet? Download it for iOS & Android
						</Typography>
					</Grid>

					<Grid item className={classes.buttonContainer}>
						<Button variant="contained" size="large" onClick={onCancel}>
							Done
						</Button>
					</Grid>
				</Grid>
			</Popup>
		);
	}
}

export const WalletExportQRCode = withStyles(styles)(WalletExportQRCodeComponent);

export default WalletExportQRCode;
