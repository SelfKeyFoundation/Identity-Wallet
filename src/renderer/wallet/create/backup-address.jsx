import React, { PureComponent } from 'react';
import { Grid, Typography, Input, Button, InputAdornment } from '@material-ui/core';
import { Copy, DownloadIcon2, warning } from 'selfkey-ui';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { walletSelectors } from 'common/wallet';
import { createWalletSelectors, createWalletOperations } from 'common/create-wallet';
import { Link } from 'react-router-dom';
import { Popup } from '../../common';

const styles = theme => ({
	downloadIcon: {
		width: '66px',
		height: '71px'
	},
	button: {
		width: '100%'
	},
	orange: {
		border: `1px solid ${warning}`,
		background: 'transparent',
		color: warning,
		width: '100%',
		'&:hover': {
			border: `1px solid ${warning}`
		}
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
				<Grid container direction="row" justify="flex-start" alignItems="flex-start">
					<Grid item xs={2}>
						<DownloadIcon2 className={classes.downloadIcon} />
					</Grid>
					<Grid item xs={10}>
						<Typography variant="body1" gutterBottom>
							Your address in Ethereum network. Think of it like a bank account number
							that you own, used to send and receive Ether or tokens. The ability to
							authorize transactions on this address is encrypted by the password you
							just created. Download a backup and save this address in a convenient
							location.
						</Typography>
						<br />
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
						/>
						<br />
						<br />
						<Button
							variant="contained"
							size="large"
							className={classes.button}
							onClick={this.handleDownload}
						>
							DOWNLOAD KEYSTORE FILE (UTC/JSON)
						</Button>
						{this.state.showFileDownloadedResult && this.showFileDownloadedResult()}
						<br />
						<br />
						<Button
							id="keystoreNext"
							variant="outlined"
							component={backupPrivateKey}
							size="large"
							className={classes.orange}
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
