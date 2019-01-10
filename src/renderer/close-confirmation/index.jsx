import React from 'react';
import { Modal, Typography, Grid, Button } from '@material-ui/core';
import { ModalWrap, ModalCloseButton, ModalHeader, ModalBody, ModalCloseIcon } from 'selfkey-ui';
import history from 'common/store/history';
import { connect } from 'react-redux';
import { closeOperations } from 'common/close';

const handleCancel = async props => {
	await props.dispatch(closeOperations.cancelClose());
	history.getHistory().goBack();
};

export const CloseConfirmation = props => {
	return (
		<Modal open={true}>
			<ModalWrap>
				<ModalCloseButton onClick={history.getHistory().goBack}>
					<ModalCloseIcon />
				</ModalCloseButton>
				<ModalHeader>
					<Typography variant="h6" id="modal-title">
						Close Confirmation
					</Typography>
				</ModalHeader>

				<ModalBody>
					<Typography variant="body1" gutterBottom>
						Are you sure you want to close?
					</Typography>
					<br />
					<br />
					<Grid container spacing={24}>
						<Grid item>
							<Button variant="contained" size="large" onClick={window.quit}>
								YES
							</Button>
						</Grid>

						<Grid item>
							<Button
								variant="outlined"
								size="large"
								onClick={() => handleCancel(props)}
							>
								CANCEL
							</Button>
						</Grid>
					</Grid>
				</ModalBody>
			</ModalWrap>
		</Modal>
	);
};

const mapStateToProps = (state, props) => {
	return {};
};

export default connect(mapStateToProps)(CloseConfirmation);
