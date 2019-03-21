import React from 'react';
import { Modal, Typography, Grid, Button, withStyles } from '@material-ui/core';
import { ModalWrap, ModalBody, SelfkeyLogo } from 'selfkey-ui';
import history from 'common/store/history';
import { connect } from 'react-redux';
import { closeOperations } from 'common/close';

const handleCancel = async props => {
	await props.dispatch(closeOperations.cancelClose());
	history.getHistory().goBack();
};

const styles = theme => ({
	closeModal: {
		left: 0,
		right: 0,
		margin: '0 auto',
		width: '360px'
	},

	shortButton: {
		minWidth: 0,
		width: '100px'
	},

	logo: {
		height: '60px',
		width: '53px'
	},

	bottomSpace: {
		marginBottom: '30px'
	}
});

export const CloseConfirmation = props => {
	const { classes } = props;
	return (
		<Modal open={true}>
			<ModalWrap className={classes.closeModal}>
				<ModalBody>
					<Grid
						container
						spacing={24}
						direction="column"
						justify="center"
						alignItems="center"
						className={classes.bottomSpace}
					>
						<Grid item>
							<SelfkeyLogo className={classes.logo} />
						</Grid>

						<Grid item>
							<Typography variant="body2" gutterBottom>
								Are you sure you want to close?
							</Typography>
						</Grid>
					</Grid>

					<Grid container spacing={24} justify="center">
						<Grid item>
							<Button
								variant="contained"
								size="large"
								className={classes.shortButton}
								onClick={window.quit}
							>
								YES
							</Button>
						</Grid>

						<Grid item>
							<Button
								variant="outlined"
								size="large"
								onClick={() => handleCancel(props)}
								className={classes.shortButton}
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

export default connect(mapStateToProps)(withStyles(styles)(CloseConfirmation));
