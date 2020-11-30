import React, { PureComponent } from 'react';
import { Grid, Typography, Input, LinearProgress, Button } from '@material-ui/core';
import { renderPasswordStrength } from './password-util';
import { PasswordIcon } from 'selfkey-ui';
import { withStyles } from '@material-ui/styles';
import { Popup } from '../../../common';
import { PropTypes } from 'prop-types';

const styles = theme => ({
	logoText: {
		fontFamily: 'Orbitron, arial, sans-serif',
		fontSize: '18px',
		letterSpacing: '2.77px',
		lineHeight: '22px'
	},
	icon: {
		marginRight: '45px'
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
	}
});

class PasswordComponent extends PureComponent {
	render() {
		const {
			classes,
			onNextClick,
			onPasswordChange,
			password,
			strength,
			passwordScore,
			backComponent
		} = this.props;
		return (
			<Popup closeComponent={backComponent} open displayLogo text="Step 1: Create Password">
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
						<Typography variant="body1" gutterBottom>
							Protect your SelfKey Identity Wallet and Ethereum address with a
							password. Your address is like a bank account number on the blockchain,
							used to send and receive Ether or tokens. This password is isRequired to
							unlock your wallet.
						</Typography>
						<br />
						<br />
						<Input
							id="pwd1"
							disableUnderline={true}
							placeholder="Password"
							type="password"
							value={password}
							onChange={e => onPasswordChange}
							className={classes.passwordInput}
							onKeyUp={event => {
								if (event.keyCode === 13) {
									onNextClick();
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
							value={passwordScore}
							className={classes.passwordScore}
						/>
						{renderPasswordStrength(password, strength)}
						<br />
						<br />
						<Button
							id="pwdNext"
							variant="contained"
							disabled={password === ''}
							onClick={onNextClick}
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

export const Password = withStyles(styles)(PasswordComponent);

Password.displayName = 'Password';
Password.propTypes = {
	onNextClick: PropTypes.func.isRequired,
	onPasswordChange: PropTypes.func.isRequired,
	password: PropTypes.string,
	strength: PropTypes.string,
	passwordScore: PropTypes.number,
	backComponent: PropTypes.element
};
Password.defaultProps = {
	password: '',
	passwordScore: 0
};

export default Password;
