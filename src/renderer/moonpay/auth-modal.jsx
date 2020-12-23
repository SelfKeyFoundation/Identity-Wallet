import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { Popup } from '../common';
import { PropTypes } from 'prop-types';

export const MoonpayAuthModal = ({ onCancel, onNext }) => {
	return (
		<Popup closeAction={onCancel} text="MoonPayAuth">
			<Grid container direction="column" spacing={4}>
				<Grid item>
					<Typography variant="body1">Authenticate With Moonpay:</Typography>
				</Grid>
				<Grid item>
					<Grid container direction="row" spacing={2}>
						<Grid item>
							<Button variant="outlined" size="large" onClick={onNext}>
								Authenticate
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
	onCancel: PropTypes.func.isRequired
};

MoonpayAuthModal.defaultProps = {};

export default MoonpayAuthModal;
