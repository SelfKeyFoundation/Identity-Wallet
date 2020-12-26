import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Button, Typography } from '@material-ui/core';
import { Popup } from '../common/popup';

const useStyles = makeStyles(theme => ({
	link: {
		cursor: 'pointer',
		color: '#00C0D9',
		textDecoration: 'none'
	}
}));

export const MoonPayNotAllowedModal = ({
	onCancel,
	onAddCountryClick,
	onLinkClick,
	ipCheck,
	customerCountries
}) => {
	const classes = useStyles();
	return (
		<Popup closeAction={onCancel} text="MoonPay Service Not Available">
			<Grid container direction="column" spacing={4}>
				<Grid item>
					<Typography variant="body1">
						MoonPay does not provide services in your country
					</Typography>
				</Grid>
				<Grid item>
					<Grid container directoin="row" spacing={2}>
						<Grid item>
							<Typography variant="subtitle1" color="secondary">
								If you hold a residency that you did not add to your profile yet,
								please add it now.
							</Typography>
						</Grid>
						<Grid item>
							<Button size="small" variant="outlined" onClick={onAddCountryClick}>
								Add
							</Button>
						</Grid>
					</Grid>
				</Grid>

				<Grid item>
					<Typography variant="h1">Checks Performed:</Typography>
				</Grid>
				<Grid item>
					<Typography variant="body1">Country checked based on your ip</Typography>
				</Grid>
				<Grid item>
					<Typography variant="subtitle1">
						<b>{ipCheck.name}</b> - {ipCheck.isAllowed ? 'allowed' : 'not allowed'}
					</Typography>
				</Grid>
				<Grid item>
					<Typography variant="body1">Countries checked based on residencies</Typography>
				</Grid>
				{customerCountries.length > 0 ? (
					<React.Fragment>
						{customerCountries.map(c => (
							<Grid item key={c.alpha2}>
								<Typography variant="subtitle1">
									<b>{c.name}</b> - {c.isAllowed ? 'allowed' : 'not allowed'}
								</Typography>
							</Grid>
						))}
					</React.Fragment>
				) : (
					<Grid item>
						<Typography variant="subtitle1" color="secondary">
							No residencies in identity profile
						</Typography>
					</Grid>
				)}

				<Grid item>
					<Typography variant="body2" gutterBottom>
						<a
							href="https://www.moonpay.io/terms_of_use"
							target="_blank"
							rel="noopener noreferrer"
							onClick={onLinkClick}
							className={classes.link}
						>
							List of supported countries
						</a>
					</Typography>
				</Grid>

				<Grid item>
					<Grid container direction="row" spacing={2}>
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

MoonPayNotAllowedModal.propTypes = {
	ipCheck: PropTypes.object,
	customerCountries: PropTypes.arrayOf(PropTypes.object),
	onAddCountryClick: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	onLinkClick: PropTypes.func
};

export default MoonPayNotAllowedModal;
