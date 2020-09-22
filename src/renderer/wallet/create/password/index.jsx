import React, { PureComponent } from 'react';
import { Grid, Typography, Input, LinearProgress, Button } from '@material-ui/core';
import { PasswordIcon } from 'selfkey-ui';
import { withStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import { handlePassword, renderPasswordStrength } from './password-util';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { createWalletOperations } from 'common/create-wallet';
import { Popup } from '../../../common';

const styles = theme => ({
	logoText: {
		fontFamily: 'Orbitron, arial, sans-serif',
		fontSize: '18px',
		letterSpacing: '2.77px',
		lineHeight: '22px'
	},
	icon: {
		marginRight: theme.spacing(5)
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
		backgroundColor: 'transparent',
		boxShadow: 'none'
	},
	logoSection: {
		paddingBottom: theme.spacing(6)
	},
	passwordScore: {
		backgroundColor: '#1E262E',
		borderRadius: 0,
		height: '10px',
		marginBottom: theme.spacing(2),
		width: '100%'
	},
	passwordInput: {
		width: '100%'
	},
	maskContainer: {
		height: '10px',
		justifyContent: 'space-evenly',
		marginTop: theme.spacing(1),
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
		marginTop: theme.spacing(3)
	},
	next: {
		marginTop: theme.spacing(4),
		minWidth: '120px'
	},
	text: {
		marginBottom: theme.spacing(6)
	}
});

const gotBackHome = React.forwardRef((props, ref) => <Link to="/home" {...props} ref={ref} />);

class Password extends PureComponent {
	state = {
		password: '',
		passwordScore: 0,
		strength: '',
		error: ''
	};

	handleNext = () => {
		this.props.dispatch(createWalletOperations.setPasswordAction(this.state.password));
		this.props.dispatch(push('/createPasswordConfirmation'));
	};

	render() {
		const { classes } = this.props;
		return (
			<Popup closeComponent={gotBackHome} open displayLogo text="Step 1: Create Password">
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					wrap="nowrap"
				>
					<Grid item className={classes.icon}>
						<PasswordIcon className={classes.passwordIcon} />
					</Grid>
					<Grid item>
						<Typography variant="body1" className={classes.text}>
							Protect your SelfKey Identity Wallet and Ethereum address with a
							password. Your address is like a bank account number on the blockchain,
							used to send and receive Ether or tokens. This password is required to
							unlock your wallet.
						</Typography>
						<Input
							id="pwd1"
							disableUnderline={true}
							placeholder="Password"
							type="password"
							value={this.state.password}
							onChange={e => this.setState(handlePassword(e, this.state))}
							className={classes.passwordInput}
							onKeyUp={event => {
								if (event.keyCode === 13) {
									this.handleNext();
								}
							}}
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
						{renderPasswordStrength(this.state.password, this.state.strength)}
						<Button
							id="pwdNext"
							variant="contained"
							disabled={this.state.password === ''}
							onClick={this.handleNext}
							className={classes.next}
							size="large"
						>
							NEXT
						</Button>
					</Grid>
				</Grid>
			</Popup>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {};
};

export default connect(mapStateToProps)(withStyles(styles)(Password));
