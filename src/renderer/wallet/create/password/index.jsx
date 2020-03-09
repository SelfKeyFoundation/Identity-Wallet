import React, { PureComponent } from 'react';
import { Grid, Typography, Paper, Modal, Input, LinearProgress, Button } from '@material-ui/core';
import {
	PasswordIcon,
	ModalWrap,
	ModalCloseButton,
	ModalCloseIcon,
	ModalHeader,
	ModalBody,
	SelfkeyLogoTemp
} from 'selfkey-ui';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { handlePassword, renderPasswordStrength } from './password-util';
import { connect } from 'react-redux';
import { createWalletOperations } from 'common/create-wallet';

const styles = theme => ({
	logoText: {
		fontFamily: 'Orbitron, arial, sans-serif',
		fontSize: '18px',
		letterSpacing: '2.77px',
		lineHeight: '22px'
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
		backgroundColor: '#1E262E',
		borderRadius: 0,
		height: '10px',
		width: '100%'
	},
	passwordInput: {
		width: '100%'
	},
	maskContainer: {
		height: '10px',
		justifyContent: 'space-evenly',
		marginTop: '10px',
		position: 'absolute',
		width: '598px',
		zIndex: 1
	},
	maskElement: {
		backgroundColor: '#262F39',
		height: '10px',
		width: '8px'
	},
	root: {
		top: '-50px'
	},
	closeIcon: {
		marginTop: '20px'
	},
	next: {
		minWidth: '120px'
	},
	paper: {
		boxShadow: 'inherit'
	}
});

const createPasswordConfirmationLink = props => (
	<Link to="/createPasswordConfirmation" {...props} />
);

const gotBackHome = props => <Link to="/home" {...props} />;

class Password extends PureComponent {
	state = {
		password: '',
		passwordScore: 0,
		strength: '',
		error: ''
	};

	handleNext = () => {
		this.props.dispatch(createWalletOperations.setPasswordAction(this.state.password));
	};

	render() {
		const { classes } = this.props;
		return (
			<Modal open={true} className={classes.root}>
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
					<Paper className={classes.paper}>
						<ModalCloseButton component={gotBackHome}>
							<ModalCloseIcon className={classes.closeIcon} />
						</ModalCloseButton>

						<ModalHeader>
							<Typography variant="body1" id="modal-title">
								Step 1: Create Password
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
									<Typography variant="body1" gutterBottom>
										Protect your SelfKey Identity Wallet and Ethereum address
										with a password. Your address is like a bank account number
										on the blockchain, used to send and receive Ether or tokens.
										This password is required to unlock your wallet.
									</Typography>
									<br />
									<br />
									<Input
										id="pwd1"
										disableUnderline={true}
										placeholder="Password"
										type="password"
										value={this.state.password}
										onChange={e => this.setState(handlePassword(e, this.state))}
										className={classes.passwordInput}
									/>
									<Grid container className={classes.maskContainer}>
										<div className={classes.maskElement} />
										<div className={classes.maskElement} />
										<div className={classes.maskElement} />
									</Grid>
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
										id="pwdNext"
										variant="contained"
										component={createPasswordConfirmationLink}
										disabled={this.state.password === ''}
										onClick={this.handleNext}
										className={classes.next}
										size="large"
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

const mapStateToProps = (state, props) => {
	return {};
};

export default connect(mapStateToProps)(withStyles(styles)(Password));
