import React from 'react';
import { Grid, Typography, Button, FormControl, Input, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Popup, InputTitle } from '../common';
import { PropTypes } from 'prop-types';
import { CodeIcon } from 'selfkey-ui';

const useStyles = makeStyles(theme => ({
	link: {
		cursor: 'pointer',
		color: '#00C0D9',
		textDecoration: 'none'
	},
	resend: {
		marginTop: 5,
		textAlign: 'right'
	},
	actions: {
		marginTop: 30
	}
}));

export const MoonPayEmailVerificationModal = ({
	onCloseClick,
	onContinueClick,
	onResendClick,
	email,
	code,
	onCodeChange,
	loading,
	error
}) => {
	const classes = useStyles();
	return (
		<Popup closeAction={onCloseClick} text="Email verification">
			<Grid container direction="row" spacing={4}>
				<Grid item xs={2}>
					<CodeIcon />
				</Grid>
				<Grid item xs>
					<Grid container direction="column" spacing={4}>
						<Grid item>
							<Typography variant="h1">Verify your email with MoonPay</Typography>
						</Grid>
						{loading && (
							<Grid item>
								<CircularProgress />
							</Grid>
						)}
						{!loading && (
							<React.Fragment>
								<Grid item>
									<Typography variant="body1">
										We’ve sent a verification code to {email}.
									</Typography>
								</Grid>
								<Grid item>
									<Typography variant="body1">Please enter it below:</Typography>
								</Grid>
								<Grid item>
									<FormControl variant="filled" fullWidth>
										<InputTitle title="Verification Code" />

										<Input
											fullWidth
											type="text"
											onChange={onCodeChange}
											value={code}
											placeholder="Enter the code your received to your email"
										/>

										<Typography
											variant="subtitle1"
											color="secondary"
											className={classes.resend}
										>
											Haven&#39;t received a code?{' '}
											<a className={classes.link} onClick={onResendClick}>
												Send Again
											</a>
										</Typography>
										{error && (
											<Typography
												variant="subtitle2"
												color="error"
												gutterBottom
											>
												{error}
											</Typography>
										)}
									</FormControl>
								</Grid>
							</React.Fragment>
						)}
						<Grid item>
							<Grid container direction="row" spacing={2} className={classes.actions}>
								<Grid item>
									<Button
										variant="contained"
										size="large"
										onClick={onContinueClick}
										disabled={loading || !code || code.length < 4}
									>
										Continue
									</Button>
								</Grid>
								<Grid item>
									<Button variant="outlined" size="large" onClick={onCloseClick}>
										Cancel
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	);
};

MoonPayEmailVerificationModal.propTypes = {
	onContinueClick: PropTypes.func.isRequired,
	onCloseClick: PropTypes.func.isRequired,
	onResendClick: PropTypes.func.isRequired,
	email: PropTypes.string,
	code: PropTypes.string,
	onCodeChange: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	error: PropTypes.string
};

MoonPayEmailVerificationModal.defaultProps = {
	code: '',
	loading: false,
	error: ''
};

export default MoonPayEmailVerificationModal;
