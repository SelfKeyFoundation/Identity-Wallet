import React, { Component } from 'react';
import { Grid, Typography, Paper, Modal, Input, Button, InputAdornment } from '@material-ui/core';
import { ModalWrap, ModalHeader, ModalBody, Copy, DownloadIcon2 } from 'selfkey-ui';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { walletSelectors } from 'common/wallet';
import { createWalletSelectors, createWalletOperations } from 'common/create-wallet';
import { Link } from 'react-router-dom';

const styles = theme => ({
	container: {
		minHeight: '100vh'
	},
	parentGrid: {
		minHeight: '100vh'
	},
	downloadIcon: {
		width: '66px',
		height: '71px'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent'
	},
	logoSection: {
		paddingBottom: '50px'
	},
	button: {
		width: '100%'
	},
	input: {
		display: 'none'
	}
});

const backupPrivateKey = props => <Link to="/backupPrivateKey" {...props} />;

class BackupAddress extends Component {
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
			return <Typography variant="body1">File Downloaded Successfuly</Typography>;
		} else {
			return <Typography variant="body1">File NOT Downloaded Successfuly</Typography>;
		}
	};

	render() {
		const { classes } = this.props;
		return (
			<Modal open={true}>
				<ModalWrap className={classes.modalWrap}>
					<Grid
						container
						direction="column"
						justify="flex-start"
						alignItems="center"
						spacing={8}
						className={classes.logoSection}
					>
						<Grid item />
					</Grid>
					<Paper>
						<ModalHeader>
							<Typography variant="body1" id="modal-title">
								Step 3: Backup Your Ethereum Address
							</Typography>
						</ModalHeader>

						<ModalBody>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="flex-start"
							>
								<Grid item xs={2}>
									<DownloadIcon2 className={classes.downloadIcon} />
								</Grid>
								<Grid item xs={10}>
									<Typography variant="body1" gutterBottom>
										Your public key is a unique address on the Ethereum
										blockchain. Think of it like a bank account number that you
										own, used to send and receive Ether or tokens. The ability
										to authorize transactions on this address is encrypted by
										the password you just created. Download a backup and save
										this address in a convenient location.
									</Typography>
									<br />
									<br />
									<Typography variant="overline" gutterBottom>
										Your Public Key
									</Typography>
									<Input
										fullWidth
										disableUnderline={true}
										value={this.props.publicKey}
										endAdornment={
											<InputAdornment position="start">
												<Copy text={this.props.publicKey} />
											</InputAdornment>
										}
										disabled
									/>
									<br />
									<br />
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
									{this.state.showFileDownloadedResult &&
										this.showFileDownloadedResult()}
									<br />
									<br />
									<Button
										variant="outlined"
										component={backupPrivateKey}
										size="large"
										className={classes.button}
									>
										MY ADDRESS IS BACKED UP, CONTINUE
									</Button>
								</Grid>
							</Grid>
						</ModalBody>
					</Paper>
				</ModalWrap>
			</Modal>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		publicKey: walletSelectors.getWallet(state).publicKey,
		fileDownloaded: createWalletSelectors.selectCreateWallet(state).fileDownloaded
	};
};

export default connect(mapStateToProps)(withStyles(styles)(BackupAddress));
