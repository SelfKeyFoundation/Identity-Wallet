import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { Popup } from '../common';
import { PropTypes } from 'prop-types';

export const MoonpayAuthErrorModal = ({ onCancel, onNext, error }) => {
	return (
		<Popup closeAction={onCancel} text="MoonPay Authentication Error">
			<Grid container direction="column" spacing={4}>
				<Grid item>
					<Typography variant="body1">Failed to authenticate with MoonPay</Typography>
				</Grid>
				{error ? (
					<Grid item>
						<Typography variant="body1" color="error">
							{error}
						</Typography>
					</Grid>
				) : null}
				<Grid item>
					<Typography variant="body2" gutterBottom>
						Please try again later
					</Typography>
				</Grid>

				<Grid item>
					<Grid container direction="row" spacing={2}>
						<Grid item>
							<Button variant="outlined" size="large" onClick={onNext}>
								Try Again
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

MoonpayAuthErrorModal.propTypes = {
	onNext: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	error: PropTypes.string
};

MoonpayAuthErrorModal.defaultProps = {};

export default MoonpayAuthErrorModal;
