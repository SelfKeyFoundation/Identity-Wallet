import React from 'react';
import { Modal, Typography, Grid, withStyles } from '@material-ui/core';
import { ModalWrap, ModalBody, WarningShieldIcon } from 'selfkey-ui';
import { connect } from 'react-redux';

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
		marginBottom: '30px',
		textAlign: 'center'
	}
});

export const NoConnection = withStyles(styles)(props => {
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
							<WarningShieldIcon className={classes.logo} />
						</Grid>
						<Grid item>
							<Typography variant="h2" gutterBottom>
								Please check your connection.
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="body2" gutterBottom>
								An internet connection is required <br />
								to use the SelfKey Vault.
							</Typography>
						</Grid>
					</Grid>
				</ModalBody>
			</ModalWrap>
		</Modal>
	);
});

const mapStateToProps = (state, props) => {
	return {};
};

export default connect(mapStateToProps)(NoConnection);
