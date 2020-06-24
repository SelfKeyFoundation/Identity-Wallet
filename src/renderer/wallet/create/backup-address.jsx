import React, { PureComponent } from 'react';
import { Grid, Typography, Input, Button, InputAdornment } from '@material-ui/core';
import { Copy, DownloadIcon2 } from 'selfkey-ui';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { walletSelectors } from 'common/wallet';
import { createWalletSelectors, createWalletOperations } from 'common/create-wallet';
import { Link } from 'react-router-dom';
import { Popup } from '../../common';

const styles = theme => ({
	bottomSpace: {
		marginBottom: '50px'
	},
	buttonBottomSpace: {
		marginBottom: '20px'
	},
	downloadIcon: {
		width: '66px',
		height: '71px'
	},
	icon: {
		marginRight: '45px'
	},
	publicKey: {
		color: '#fff !important',
		opacity: '1 !important'
	}
});

const backupPrivateKey = props => <Link to="/backupPrivateKey" {...props} />;

class BackupAddress extends PureComponent {
	state = {
		showFileDownloadedResult: false
	};

	handleDownload = async event => {
		const directoryPath = await window.openDirectorySelectDialog(event);
		if (directoryPath) {
			this.props.dispatch(createWalletOperations.downloadFileOperation(directoryPath));
			this.setState({ ...this.state, showFileDownloadedResult: true });
		}
	};

	showFileDownloadedResult = () => {
		if (this.props.fileDownloaded) {
			return <Typography variant="body1">File Downloaded Successfully</Typography>;
		} else {
			return <Typography variant="body1">File NOT Downloaded Successfully</Typography>;
		}
	};

	render() {
		const { classes } = this.props;
		return (
			<Popup
				closeAction={this.handleBackAction}
				open
				displayLogo
				text="Step 3: Backup Your Ethereum AddressPassword"
			>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					wrap="nowrap"
				>
					<Grid item className={classes.icon}>
						<DownloadIcon2 className={classes.downloadIcon} />
					</Grid>
					<Grid item>
						<Typography variant="body1" className={classes.bottomSpace}>
							Your address in Ethereum network. Think of it like a bank account number
							that you own, used to send and receive Ether or tokens. The ability to
							authorize transactions on this address is encrypted by the password you
							just created. Download a backup and save this address in a convenient
							location.
						</Typography>
						<Typography variant="overline" gutterBottom>
							Your Address
						</Typography>
						<Input
							id="publicKey"
							fullWidth
							disableUnderline={true}
							value={this.props.address}
							endAdornment={
								<InputAdornment position="start">
									<Copy text={this.props.address} />
								</InputAdornment>
							}
							disabled
							className={`${classes.publicKey} ${classes.bottomSpace}`}
						/>
						<Button
							variant="contained"
							size="large"
							fullWidth
							onClick={this.handleDownload}
							className={classes.buttonBottomSpace}
						>
							DOWNLOAD KEYSTORE FILE (UTC/JSON)
						</Button>
						{this.state.showFileDownloadedResult && this.showFileDownloadedResult()}
						<Button
							id="keystoreNext"
							variant="outlined"
							component={backupPrivateKey}
							size="large"
							color="secondary"
							fullWidth
						>
							MY ADDRESS IS BACKED UP, CONTINUE
						</Button>
					</Grid>
				</Grid>
			</Popup>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		address: walletSelectors.getWallet(state).address,
		fileDownloaded: createWalletSelectors.selectCreateWallet(state).fileDownloaded
	};
};

export default connect(mapStateToProps)(withStyles(styles)(BackupAddress));
