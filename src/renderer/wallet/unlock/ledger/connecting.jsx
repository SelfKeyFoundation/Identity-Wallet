import React, { Component } from 'react';
import { Modal, Typography, Button, Grid, CircularProgress } from '@material-ui/core';
import {
	ModalWrap,
	ModalCloseButton,
	ModalHeader,
	ModalBody,
	ModalCloseIcon,
	HourGlassLargeIcon,
	WarningShieldIcon
} from 'selfkey-ui';
import { connect } from 'react-redux';
import HelpStepsSection from './help-steps-section';
import { appOperations, appSelectors } from 'common/app';
import HelpStepsErrorSection from './help-steps-error-section';

class Connecting extends Component {
	state = {
		isModalOpen: false,
		isModalErrorOpen: false
	};

	componentDidMount() {
		this.setState({ isModalOpen: this.props.open });
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.open !== this.props.open) {
			this.setState({ isModalOpen: this.props.open });
			if (this.props.open) {
				await this.props.dispatch(appOperations.setHardwareWalletsAction([]));
				await this.props.dispatch(appOperations.loadLedgerWalletsOperation());
			}
		}

		if (prevProps.hasConnected !== this.props.hasConnected) {
			if (this.props.hasConnected) {
				this.handleClose();
			}
		}
	}

	handleTryAgain = async () => {
		await this.props.dispatch(appOperations.setUnlockWalletErrorAction(''));
		await this.props.dispatch(appOperations.loadLedgerWalletsOperation());
	};

	handleClose = () => {
		if (this.props.error !== '') {
			this.props.dispatch(appOperations.setUnlockWalletErrorAction(''));
		}
		this.setState({ isModalOpen: false });
		this.props.onClose();
	};

	renderModalBody = () => {
		if (this.props.error !== '') {
			return (
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					spacing={40}
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
							spacing={40}
						>
							<Grid item>
								<Typography variant="h2">
									Error: Can&#39;t Connect To Ledger
								</Typography>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1">
									To ensure a successful connection, please check following:
								</Typography>
							</Grid>
							<Grid item>
								<HelpStepsErrorSection />
							</Grid>
							<Grid item>
								<Grid
									container
									direction="row"
									justify="flex-start"
									alignItems="center"
									spacing={24}
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
					spacing={40}
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
							spacing={40}
						>
							<Grid item>
								<Typography variant="h2">Connecting To Ledger</Typography>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1">
									To ensure a successful connection, please check the following:
								</Typography>
							</Grid>
							<Grid item>
								<HelpStepsSection />
							</Grid>
							<Grid item>
								<Button
									variant="outlined"
									size="large"
									color="secondary"
									onClick={this.handleClose}
								>
									CLOSE
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
			<div>
				<Modal open={this.state.isModalOpen}>
					<ModalWrap>
						<ModalCloseButton onClick={this.handleClose}>
							<ModalCloseIcon />
						</ModalCloseButton>
						<ModalHeader>
							<Grid
								container
								direction="row"
								justify="space-between"
								alignItems="center"
							>
								<Grid item>
									<Typography variant="h6">Connecting</Typography>
								</Grid>
								<Grid item>
									<CircularProgress />
								</Grid>
							</Grid>
						</ModalHeader>
						<ModalBody>{this.renderModalBody()}</ModalBody>
					</ModalWrap>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		error: appSelectors.selectApp(state).error,
		hasConnected: appSelectors.hasConnected(state)
	};
};

export default connect(mapStateToProps)(Connecting);
