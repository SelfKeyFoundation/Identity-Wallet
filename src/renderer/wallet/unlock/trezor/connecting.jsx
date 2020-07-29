import React, { PureComponent } from 'react';
import {
	// Modal,
	Typography,
	Button,
	Grid
	// CircularProgress
} from '@material-ui/core';
import {
	// ModalWrap,
	// ModalCloseButton,
	// ModalHeader,
	// ModalBody,
	// ModalCloseIcon,
	HourGlassLargeIcon,
	WarningShieldIcon,
	TrezorBridgeIcon
} from 'selfkey-ui';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { appOperations, appSelectors } from 'common/app';
import { push } from 'connected-react-router';
import { Popup } from '../../../common';

const styles = theme => ({
	closeIcon: {
		marginTop: '20px'
	}
});

class ConnectingToTrezor extends PureComponent {
	async componentDidMount() {
		await this.props.dispatch(appOperations.setHardwareWalletsAction([]));
		await this.props.dispatch(appOperations.loadTrezorWalletsOperation());
	}

	handleTryAgain = async () => {
		await this.props.dispatch(appOperations.setUnlockWalletErrorAction(''));
		await this.props.dispatch(appOperations.loadTrezorWalletsOperation());
	};

	handleClose = async () => {
		if (this.props.error !== '') {
			this.props.dispatch(appOperations.setUnlockWalletErrorAction(''));
		}
		await this.props.dispatch(push('/unlockWallet/trezor'));
	};

	renderModalBody = () => {
		if (this.props.error !== '') {
			if (this.props.error === 'TREZOR_BRIDGE_NOT_FOUND') {
				return (
					<Grid
						container
						direction="row"
						justify="flex-start"
						alignItems="flex-start"
						spacing={5}
					>
						<Grid item xs={2}>
							<TrezorBridgeIcon />
						</Grid>
						<Grid item xs={10}>
							<Grid
								container
								direction="column"
								justify="flex-start"
								alignItems="flex-start"
								spacing={5}
							>
								<Grid item>
									<Typography variant="h1" style={{ marginBottom: '0.75em' }}>
										Please Install Trezor Bridge
									</Typography>
									<Typography variant="body1">
										Trezor Bridge is required so that the SelfKey Identity
										Wallet can communicate with your device. It is an official
										application released by the Trezor team available to
										download below. Please restart the application after
										installation.
									</Typography>
								</Grid>
								<Grid item>
									<Grid
										container
										direction="row"
										justify="flex-start"
										alignItems="center"
										spacing={2}
									>
										<Grid item>
											<Typography variant="h3">URL:</Typography>
										</Grid>
										<Grid item>
											<Typography variant="subtitle1">
												https://wallet.trezor.io/#/bridge
											</Typography>
										</Grid>
										<Grid item>
											<Button
												variant="outlined"
												size="small"
												color="secondary"
												onClick={e => {
													window.openExternal(
														e,
														'https://wallet.trezor.io/#/bridge'
													);
												}}
											>
												Download
											</Button>
										</Grid>
									</Grid>
								</Grid>
								<Grid item>
									<Grid
										container
										direction="row"
										justify="flex-start"
										alignItems="center"
										spacing={3}
									>
										<Grid item>
											<Button
												variant="contained"
												size="large"
												onClick={this.handleTryAgain}
											>
												TRY AGAIN
											</Button>
										</Grid>
										<Grid item>
											<Button
												variant="outlined"
												size="large"
												onClick={this.handleClose}
											>
												BACK
											</Button>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				);
			} else {
				return (
					<Grid
						container
						direction="row"
						justify="flex-start"
						alignItems="flex-start"
						spacing={5}
					>
						<Grid item xs={2}>
							<WarningShieldIcon />
						</Grid>
						<Grid item xs={10}>
							<Grid
								container
								direction="column"
								justify="flex-start"
								alignItems="flex-start"
								spacing={5}
							>
								<Grid item>
									<Typography variant="h1" style={{ marginBottom: '0.75em' }}>
										Error: Can&#39;t Connect To Trezor
									</Typography>
									<Typography variant="body1">
										To ensure a successful connection, please make sure your
										device is plugged in properly via USB. If you need more
										assistance, please contact help@selfkey.org
									</Typography>
								</Grid>
								<Grid item>
									<Grid
										container
										direction="row"
										justify="flex-start"
										alignItems="center"
										spacing={3}
									>
										<Grid item>
											<Button
												variant="contained"
												size="large"
												onClick={this.handleTryAgain}
											>
												TRY AGAIN
											</Button>
										</Grid>
										<Grid item>
											<Button
												variant="outlined"
												size="large"
												onClick={this.handleClose}
											>
												BACK
											</Button>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				);
			}
		} else {
			return (
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					spacing={5}
				>
					<Grid item xs={2}>
						<HourGlassLargeIcon />
					</Grid>
					<Grid item xs={10}>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="flex-start"
							spacing={5}
						>
							<Grid item>
								<Typography variant="h1" style={{ marginBottom: '0.75em' }}>
									Connecting To Trezor
								</Typography>
								<Typography variant="body1">
									To ensure a successful connection, please make sure your device
									is plugged in properly via USB.
								</Typography>
							</Grid>
							<Grid item>
								<Button
									variant="outlined"
									size="large"
									color="secondary"
									onClick={this.handleClose}
								>
									CANCEL
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			);
		}
	};

	render() {
		return (
			<Popup closeAction={this.handleClose} open text="Connecting">
				{this.renderModalBody()}
			</Popup>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		error: appSelectors.selectApp(state).error,
		hasConnected: appSelectors.hasConnected(state)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(ConnectingToTrezor));
