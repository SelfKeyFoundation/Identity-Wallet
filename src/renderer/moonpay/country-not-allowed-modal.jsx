import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { Popup } from '../common';

export const MoonPayCountryNotAllowedModal = ({
	onCancel,
	isMissingProfileAttributes,
	error,
	onSelfkeyProfile
}) => {
	return (
		<Popup closeAction={onCancel} text="MoonPay Authentication Error">
			<Grid container direction="column" spacing={4}>
				{isMissingProfileAttributes && (
					<Grid item>
						<Typography variant="body1">Missing Profile Information</Typography>
						<Typography variant="body2" color="secondary" style={{ marginTop: '1em' }}>
							Nationality and/or Country of Residency are missing.
							<br />
							Click the button below to complete your Profile.
						</Typography>
					</Grid>
				)}
				{!isMissingProfileAttributes && (
					<Grid item>
						<Typography variant="body1">
							Service not available in your country
						</Typography>
					</Grid>
				)}
				{error ? (
					<Grid item>
						<Typography variant="body1" color="error">
							{error}
						</Typography>
					</Grid>
				) : null}
				<Grid item>
					<Grid container direction="row" spacing={2}>
						{isMissingProfileAttributes && (
							<Grid item>
								<Button variant="contained" size="large" onClick={onSelfkeyProfile}>
									Selfkey Profile
								</Button>
							</Grid>
						)}
						<Grid item>
							<Button variant="outlined" size="large" onClick={onCancel}>
								Cancel
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	);
};

MoonPayCountryNotAllowedModal.defaultProps = {};

export default MoonPayCountryNotAllowedModal;
