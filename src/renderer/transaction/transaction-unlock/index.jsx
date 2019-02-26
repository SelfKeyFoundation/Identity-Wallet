import React, { Component } from 'react';
import { Modal, Typography, Button, Grid, withStyles } from '@material-ui/core';
import {
	ModalWrap,
	ModalCloseButton,
	ModalHeader,
	ModalBody,
	ModalCloseIcon,
	UnlockLargeIcon
} from 'selfkey-ui';
import { connect } from 'react-redux';
import history from 'common/store/history';

const styles = theme => ({
	unlockIcon: {
		fontSize: '66px'
	}
});

class TransactionUnlock extends Component {
	handleTryAgain = async () => {
		this.handleClose();
	};

	handleClose = () => {
		history.getHistory().goBack();
	};

	renderModalBody = () => {
		return (
			<Grid
				container
				direction="row"
				justify="flex-start"
				alignItems="flex-start"
				spacing={40}
			>
				<Grid item xs={2}>
					<UnlockLargeIcon className={this.props.classes.unlockIcon} />
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
							<Typography variant="h1">Please Unlock Your Ledger</Typography>
						</Grid>
						<Grid item>
							<Typography variant="body1">
								You need to confirm this transaction on your Ledger in order to
								proceed. Please unlock it with your PIN.
							</Typography>
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
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		);
	};

	render() {
		return (
			<div>
				<Modal open={true}>
					<ModalWrap>
						<ModalCloseButton onClick={this.handleClose}>
							<ModalCloseIcon />
						</ModalCloseButton>
						<ModalHeader>
							<Typography variant="body1">Unlock Device</Typography>
						</ModalHeader>
						<ModalBody>{this.renderModalBody()}</ModalBody>
					</ModalWrap>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {};
};

export default connect(mapStateToProps)(withStyles(styles)(TransactionUnlock));
