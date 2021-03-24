import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Popup } from '../common';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles(theme => ({
	body: {
		background: '#313d49',
		padding: '1em',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
}));

export const MoonpayAuthModal = ({ onCancel, onNext, onChooseEmail, email }) => {
	const classes = useStyles();
	return (
		<Popup closeAction={onCancel} text="MoonPay Authentication">
			<Grid container direction="column" spacing={4}>
				<Grid item>
					<Typography variant="body1">
						You will be authenticated the following email address:
					</Typography>
				</Grid>
				<Grid item>
					<Grid container direction="row" spacing={2} className={classes.body}>
						<Grid item>
							<Typography variant="body2" color="primary">
								{email}
							</Typography>
						</Grid>
						{onChooseEmail && (
							<Grid item>
								<Button onClick={onChooseEmail} variant="outlined" size="small">
									Change Address
								</Button>
							</Grid>
						)}
					</Grid>
				</Grid>
				<Grid item>
					<Typography variant="subtitle1" color="secondary">
						If you have connected to moonpay before with this wallet address, please
						make sure to use the same email
					</Typography>
				</Grid>
				<Grid item>
					<Grid container direction="row" spacing={2}>
						<Grid item>
							<Button
								variant="outlined"
								size="large"
								onClick={onNext}
								disabled={!email}
							>
								Confirm
							</Button>
						</Grid>
						<Grid item>
							<Button variant="contained" size="large" onClick={onCancel}>
								Cancel
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	);
};

MoonpayAuthModal.propTypes = {
	onNext: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	onChooseEmail: PropTypes.func,
	email: PropTypes.string.isRequired
};

MoonpayAuthModal.defaultProps = {};

export default MoonpayAuthModal;
