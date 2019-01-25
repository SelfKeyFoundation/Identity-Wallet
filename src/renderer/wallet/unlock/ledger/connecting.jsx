import React, { Component } from 'react';
import { Modal, Typography, Button, Grid, CircularProgress } from '@material-ui/core';
import {
	ModalWrap,
	ModalCloseButton,
	ModalHeader,
	ModalBody,
	ModalCloseIcon,
	HourGlassLargeIcon
} from 'selfkey-ui';
import { connect } from 'react-redux';
import HelpStepsSection from './help-steps-section';
import { appOperations } from 'common/app';

class Connecting extends Component {
	state = {
		isModalOpen: false
	};

	componentDidMount() {
		console.log('HERE');
		this.setState({ isModalOpen: this.props.open });
		this.props.dispatch(appOperations.loadLedgerWalletsOperation());
	}

	componentDidUpdate(prevProps) {
		if (prevProps.open !== this.props.open) {
			this.setState({ isModalOpen: this.props.open });
		}
	}

	handleClose = () => {
		this.setState({ isModalOpen: false });
		this.props.onClose();
	};

	render() {
		return (
			<Modal open={this.state.isModalOpen}>
				<ModalWrap>
					<ModalCloseButton onClick={this.handleClose}>
						<ModalCloseIcon />
					</ModalCloseButton>
					<ModalHeader>
						<Grid container direction="row" justify="space-between" alignItems="center">
							<Grid item>
								<Typography variant="h6">Connecting</Typography>
							</Grid>
							<Grid item>
								<CircularProgress />
							</Grid>
						</Grid>
					</ModalHeader>
					<ModalBody>
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
											To ensure a successful connection, please check the
											following:
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
					</ModalBody>
				</ModalWrap>
			</Modal>
		);
	}
}

const mapStateToProps = (state, props) => {
	console.log('STATE', state);
	return {};
};

export default connect(mapStateToProps)(Connecting);
