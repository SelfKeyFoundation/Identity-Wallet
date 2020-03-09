import React, { PureComponent } from 'react';
import { Grid, Typography, Paper, Modal, Input, Button, InputAdornment } from '@material-ui/core';
import {
	ModalWrap,
	ModalHeader,
	ModalBody,
	Copy,
	DownloadIcon2,
	SelfkeyLogoTemp,
	warning
} from 'selfkey-ui';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { walletSelectors } from 'common/wallet';
import { createWalletSelectors, createWalletOperations } from 'common/create-wallet';
import { Link } from 'react-router-dom';

const styles = theme => ({
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
	},
	orange: {
		border: `1px solid ${warning}`,
		background: 'transparent',
		color: warning,
		width: '100%',
		'&:hover': {
			border: `1px solid ${warning}`
		}
	},
	root: {
		top: '-50px'
	},
	paper: {
		boxShadow: 'inherit'
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
			<Modal open={true} className={classes.root}>
				<ModalWrap className={classes.modalWrap}>
					<Grid
						container
						direction="column"
						justify="flex-start"
						alignItems="center"
						spacing={8}
						className={classes.logoSection}
					>
						<Grid item>
							<SelfkeyLogoTemp />
						</Grid>
					</Grid>
					<Paper className={classes.paper}>
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
										Your address in Ethereum network. Think of it like a bank
										account number that you own, used to send and receive Ether
										or tokens. The ability to authorize transactions on this
										address is encrypted by the password you just created.
										Download a backup and save this address in a convenient
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
									{this.state.showFileDownloadedResult &&
										this.showFileDownloadedResult()}
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
						</ModalBody>
					</Paper>
				</ModalWrap>
			</Modal>
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
