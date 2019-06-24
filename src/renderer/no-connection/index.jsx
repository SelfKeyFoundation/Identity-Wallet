import React from 'react';
import { Modal, Typography, Grid, withStyles, Button } from '@material-ui/core';
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
		textAlign: 'center'
	},
	marginBottom: {
		marginBottom: '70px'
	}
});

export const NoConnection = withStyles(styles)(props => {
	const { classes, onBackClick = false } = props;
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
							<Typography variant="body2" className={classes.marginBottom}>
								An internet connection is required to use the SelfKey Vault. Please
								check your connection and reopen the application.
							</Typography>
							{!onBackClick && (
								<Button
									variant="outlined"
									size="large"
									color="secondary"
									onClick={onBackClick}
								>
									OK
								</Button>
							)}
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
