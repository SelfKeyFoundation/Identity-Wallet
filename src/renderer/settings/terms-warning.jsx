import React, { PureComponent } from 'react';
import { Grid, Typography, Paper, Modal, Button } from '@material-ui/core';
import { SelfkeyLogo, ModalWrap, ModalHeader, ModalBody } from 'selfkey-ui';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

const styles = theme => ({
	logo: {
		width: '50px',
		height: '65px'
	},
	container: {
		minHeight: '100vh'
	},
	parentGrid: {
		minHeight: '100vh'
	},
	passwordIcon: {
		width: '66px',
		height: '76px'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent'
	},
	logoSection: {
		paddingBottom: '50px'
	},
	paper: {
		boxShadow: '0 7px 15px 0 rgba(0, 0, 0, 0.2)'
	}
});

class TermsWarning extends PureComponent {
	handleReturn = () => {
		this.props.dispatch(push('/terms'));
	};

	handlClose = () => {
		window.quit();
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
							<SelfkeyLogo className={classes.logo} />
						</Grid>
						<Grid item>
							<Typography variant="h1">SELFKEY</Typography>
						</Grid>
					</Grid>
					<Paper className={classes.paper}>
						<ModalHeader>
							<Typography variant="h3" id="modal-title">
								Need to Accept Terms
							</Typography>
						</ModalHeader>

						<ModalBody>
							<Grid
								container
								direction="column"
								justify="flex-start"
								alignItems="flex-start"
								spacing={8}
							>
								<Grid item>
									<Typography variant="body1" paragraph>
										You will need to accept the Terms of Service in order to use
										the SelfKey Identity Wallet or you will be unable to
										proceed. Return to the TOS agreement below or exit and close
										the application.
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
												onClick={this.handleReturn}
											>
												RETURN TO TOS
											</Button>
										</Grid>
										<Grid item>
											<Button
												variant="outlined"
												size="large"
												onClick={this.handlClose}
											>
												EXIT AND CLOSE
											</Button>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</ModalBody>
					</Paper>
				</ModalWrap>
			</Modal>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

export default connect(mapStateToProps)(withStyles(styles)(TermsWarning));
