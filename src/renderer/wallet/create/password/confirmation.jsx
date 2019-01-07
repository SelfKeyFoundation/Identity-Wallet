import React, { Component } from 'react';
import { Grid, Typography, Paper, Modal, Input, LinearProgress, Button } from '@material-ui/core';
import {
	SelfkeyLogo,
	PasswordIcon,
	ModalWrap,
	ModalCloseButton,
	ModalCloseIcon,
	ModalHeader,
	ModalBody,
	Paragraph,
	ErrorMessage
} from 'selfkey-ui';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { handlePassword, renderPasswordStrength } from './password-util';
import { createWalletSelectors, createWalletOperations } from 'common/create-wallet';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

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
	passwordScore: {
		width: '100%'
	},
	passwordInput: {
		width: '100%'
	}
});

const goBackCreatePassword = props => <Link to="/createPassword" {...props} />;

class PasswordConfirmation extends Component {
	state = {
		password: '',
		passwordScore: 0,
		strength: '',
		error: ''
	};

	handleNext = async () => {
		if (this.props.firstPassword === this.state.password) {
			await this.props.dispatch(createWalletOperations.createWalletOperation());
			await this.props.dispatch(push('/backupAddress'));
		} else {
			this.setState({ ...this.state, error: 'Password does not match' });
		}
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
					<Paper>
						<ModalCloseButton component={goBackCreatePassword}>
							<ModalCloseIcon />
						</ModalCloseButton>

						<ModalHeader>
							<Typography variant="h6" id="modal-title">
								Step 2: Confirm Password
							</Typography>
						</ModalHeader>

						<ModalBody>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="flex-start"
							>
								<Grid item xs={2}>
									<PasswordIcon className={classes.passwordIcon} />
								</Grid>
								<Grid item xs={10}>
									<Paragraph id="simple-modal-description" gutterBottom>
										Confirm the password you just created. After this step,
										there is no way the password can be restored or reset, and
										SelfKey cannot you help if it is lost.
									</Paragraph>
									<br />
									<br />
									<Input
										error={this.state.error !== ''}
										disableUnderline={true}
										placeholder="Password"
										type="password"
										value={this.state.password}
										onChange={e => this.setState(handlePassword(e, this.state))}
										className={classes.passwordInput}
									/>
									{this.state.error !== '' && (
										<ErrorMessage>{this.state.error}</ErrorMessage>
									)}
									<LinearProgress
										variant="determinate"
										value={this.state.passwordScore}
										className={classes.passwordScore}
									/>
									{renderPasswordStrength(
										this.state.password,
										this.state.strength
									)}
									<br />
									<br />
									<Button
										variant="contained"
										disabled={this.state.password === ''}
										onClick={this.handleNext}
									>
										NEXT
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

const mapStateToProps = state => {
	return {
		firstPassword: createWalletSelectors.selectCreateWallet(state).password
	};
};

export default connect(mapStateToProps)(withStyles(styles)(PasswordConfirmation));
