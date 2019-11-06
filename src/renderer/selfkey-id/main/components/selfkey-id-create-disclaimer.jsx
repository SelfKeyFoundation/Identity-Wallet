import React, { PureComponent } from 'react';
import { Grid, Modal, Typography, Paper, Button, withStyles } from '@material-ui/core';
import { SelfkeyLogoTemp, ModalWrap, ModalHeader, ModalBody } from 'selfkey-ui';
import { Link } from 'react-router-dom';
import history from 'common/store/history';

const styles = theme => ({
	container: {
		minHeight: '100vh'
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
	cancel: {
		paddingLeft: '20px'
	}
});

const selfkeyId = props => <Link to="/main/selfkeyId" {...props} />;
const main = props => <Link to="/main/dashboard" {...props} />;

class SelfKeyIdCreateDisclaimerComponent extends PureComponent {
	handleBackClick = evt => {
		evt && evt.preventDefault();
		history.getHistory().goBack();
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
						<Grid item>
							<SelfkeyLogoTemp />
						</Grid>
					</Grid>
					<Paper>
						<ModalHeader>
							<Typography variant="body1" id="modal-title">
								What Are ID Attributes & Documents?
							</Typography>
						</ModalHeader>

						<ModalBody>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="flex-start"
							>
								<Grid item>
									<Typography variant="body1" gutterBottom>
										Your identity profile is broken down into two parts:{' '}
										attributes and documents. Attributes are details about your{' '}
										identity such as birthday, phone, address, and city.{' '}
										Documents are proof of your identity such as a passport or{' '}
										utility bill.
									</Typography>
									<br />
									<br />
									<Typography variant="body1" gutterBottom>
										We{"'"}ll be adding more features in the future, such as{' '}
										blockchain verified claims in your identity profile. All{' '}
										attributes and documents regarding your identity profile are{' '}
										stored locally on your computer, and SelfKey does not have{' '}
										any access to your information.
									</Typography>
									<br />
									<br />
									<br />
								</Grid>
								<Grid item>
									<Button
										id="selfkeyIdDisclaimerButton"
										variant="contained"
										size="large"
										component={selfkeyId}
									>
										Continue
									</Button>
								</Grid>
								<Grid item className={classes.cancel}>
									<Button variant="outlined" size="large" component={main}>
										Cancel
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

export const SelfKeyIdCreateDisclaimer = withStyles(styles)(SelfKeyIdCreateDisclaimerComponent);

export default SelfKeyIdCreateDisclaimer;
