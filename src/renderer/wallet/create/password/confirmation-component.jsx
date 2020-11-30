import React, { PureComponent } from 'react';
import { Grid, Typography, Input, LinearProgress, Button } from '@material-ui/core';
import { PasswordConfirmIcon } from 'selfkey-ui';
import { withStyles } from '@material-ui/styles';
import { renderPasswordStrength } from './password-util';
import { Popup } from '../../../common';
import { PropTypes } from 'prop-types';

const styles = theme => ({
	icon: {
		marginRight: '45px'
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
	next: {
		minWidth: '120px'
	},
	passwordInput: {
		width: '100%'
	},
	passwordScore: {
		backgroundColor: '#1E262E',
		borderRadius: 0,
		height: '10px',
		width: '100%'
	}
});

class PasswordConfirmationComponent extends PureComponent {
	render() {
		const {
			classes,
			password,
			passwordScore,
			strength,
			error,
			backElement,
			onBackAction,
			onPasswordChange,
			onNextClick
		} = this.props;
		return (
			<Popup
				closeComponent={backElement}
				closeAction={onBackAction}
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
						<Typography variant="body1" gutterBottom>
							Confirm the password you just created. After this step, there is no way
							the password can be restored or reset, and SelfKey cannot you help if it
							is lost.
						</Typography>
						<br />
						<br />
						<Input
							id="pwd2"
							error={error !== ''}
							disableUnderline={true}
							placeholder="Password"
							type="password"
							value={password}
							onChange={onPasswordChange}
							className={classes.passwordInput}
							onKeyUp={event => {
								if (event.keyCode === 13) {
									onNextClick();
								}
							}}
						/>
						{error !== '' && (
							<Typography variant="subtitle2" color="error" gutterBottom>
								{error}
							</Typography>
						)}
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
							id="pwd2Next"
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

const PasswordConfirmation = withStyles(styles)(PasswordConfirmationComponent);

PasswordConfirmation.displayName = 'PasswordConfirmation';
PasswordConfirmation.propTypes = {
	onNextClick: PropTypes.func.isRequired,
	onPasswordChange: PropTypes.func.isRequired,
	password: PropTypes.string,
	strength: PropTypes.string,
	passwordScore: PropTypes.number,
	backComponent: PropTypes.element,
	onBackAction: PropTypes.func
};
PasswordConfirmation.defaultProps = {
	password: '',
	passwordScore: 0
};

export default PasswordConfirmation;
