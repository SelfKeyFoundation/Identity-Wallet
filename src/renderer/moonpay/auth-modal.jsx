import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { Popup } from '../common';
import { PropTypes } from 'prop-types';

export const MoonpayAuthModal = ({ onCancel, onNext, onChooseEmail, email }) => {
	return (
		<Popup closeAction={onCancel} text="MoonPay Authentication">
			<Grid container direction="column" spacing={4}>
				<Grid item>
					<Typography variant="body1">Authenticate With Moonpay</Typography>
				</Grid>
				<Grid item>
					<Typography variant="body2" gutterBottom>
						You will be authenticated the following email address:
					</Typography>
					<Typography variant="subtitle1" color="secondary">
						If you have connected to moonpay before with this wallet address, please
						make sure to use the same email
					</Typography>
				</Grid>
				<Grid item>
					<Grid container direction="row" spacing={2}>
						<Grid item>
							<Typography variant="body2" color="primary">
								{email}
							</Typography>
						</Grid>
						{onChooseEmail && (
							<Grid item>
								<Button onClick={onChooseEmail} variant="outlined" size="small">
									Choose a different one
								</Button>
							</Grid>
						)}
					</Grid>
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
