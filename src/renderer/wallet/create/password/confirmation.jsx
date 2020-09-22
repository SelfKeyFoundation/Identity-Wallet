import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography, Input, LinearProgress, Button } from '@material-ui/core';
import { PasswordConfirmIcon } from 'selfkey-ui';
import { withStyles } from '@material-ui/styles';
import { handlePassword, renderPasswordStrength } from './password-util';
import { createWalletSelectors, createWalletOperations } from 'common/create-wallet';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Popup } from '../../../common';
import { getGlobalContext } from 'common/context';

const styles = theme => ({
	icon: {
		marginRight: theme.spacing(5)
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
	next: {
		marginTop: theme.spacing(4),
		minWidth: '120px'
	},
	passwordInput: {
		width: '100%'
	},
	passwordScore: {
		backgroundColor: '#1E262E',
		borderRadius: 0,
		height: '10px',
		marginBottom: theme.spacing(2),
		width: '100%'
	},
	text: {
		marginBottom: theme.spacing(6)
	}
});

const goBackCreatePassword = React.forwardRef((props, ref) => (
	<Link to="/createPassword" {...props} ref={ref} />
));

class PasswordConfirmation extends PureComponent {
	state = {
		password: '',
		passwordScore: 0,
		strength: '',
		error: ''
	};

	handleNext = async () => {
		if (this.props.firstPassword === this.state.password) {
			getGlobalContext().matomoService.trackEvent(
				'wallet_setup',
				'password_create',
				undefined,
				undefined,
				true
			);
			await this.props.dispatch(createWalletOperations.createWalletOperation());
			await this.props.dispatch(push('/backupAddress'));
		} else {
			this.setState({ ...this.state, error: 'Password does not match' });
		}
	};

	render() {
		const { classes } = this.props;
		return (
			<Popup
				closeComponent={goBackCreatePassword}
				closeAction={this.handleBackAction}
				open
				displayLogo
				text="Step 2: Confirm Password"
			>
				<Grid
					container
					direction="row"
					justify="flex-start"
					alignItems="flex-start"
					wrap="nowrap"
				>
					<Grid item className={classes.icon}>
						<PasswordConfirmIcon />
					</Grid>
					<Grid item>
						<Typography variant="body1" className={classes.text}>
							Confirm the password you just created. After this step, there is no way
							the password can be restored or reset, and SelfKey cannot you help if it
							is lost.
						</Typography>
						<Input
							id="pwd2"
							error={this.state.error !== ''}
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
						{this.state.error !== '' && (
							<Typography variant="subtitle2" color="error" gutterBottom>
								{this.state.error}
							</Typography>
						)}
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
							id="pwd2Next"
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

const mapStateToProps = state => {
	return {
		firstPassword: createWalletSelectors.selectCreateWallet(state).password
	};
};

export default connect(mapStateToProps)(withStyles(styles)(PasswordConfirmation));
