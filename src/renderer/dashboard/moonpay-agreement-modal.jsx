import React from 'react';
import { Grid, Typography, Button, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Popup } from '../common';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles(theme => ({
	link: {
		cursor: 'pointer',
		color: '#00C0D9',
		textDecoration: 'none'
	}
}));

export const MoonpayAgreementModal = ({ onCloseClick, onAgreeClick, onLinkClick }) => {
	const classes = useStyles();
	return (
		<Popup closeAction={onCloseClick} text="MoonPay Terms Agreement">
			<Grid container direction="column" spacing={4}>
				<Grid item>
					<Typography variant="body1">Please read the following documents:</Typography>
				</Grid>

				<Grid item>
					<Divider />
				</Grid>
				<Grid item>
					<Typography variant="body1">
						<a
							href="https://www.moonpay.io/terms_of_use"
							target="_blank"
							rel="noopener noreferrer"
							className={classes.link}
							onClick={onLinkClick}
						>
							Terms of service
						</a>
						<br />
						<a
							href="https://www.moonpay.io/privacy_policy"
							target="_blank"
							rel="noopener noreferrer"
							className={classes.link}
							onClick={onLinkClick}
						>
							Privacy Policy
						</a>
						<br />
						<a
							href="https://buy.moonpay.com/ZeroHashLLCServicesAgreement.pdf"
							target="_blank"
							rel="noopener noreferrer"
							className={classes.link}
							onClick={onLinkClick}
						>
							Zero Hash LLC Services Agreement
						</a>
					</Typography>
				</Grid>
				<Grid item>
					<Typography variant="subtitle" color="secondary" gutterBottom>
						By clicking &#34;Agree to terms of Service&#34; you consent that you have
						read and accept the terms.
					</Typography>
				</Grid>
				<Grid item>
					<Divider />
				</Grid>
				<Grid item>
					<Grid container direction="row" spacing={2}>
						<Grid item>
							<Button variant="outlined" size="large" onClick={onAgreeClick}>
								Agree to terms of service
							</Button>
						</Grid>
						<Grid item>
							<Button variant="contained" size="large" onClick={onCloseClick}>
								Cancel
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	);
};

MoonpayAgreementModal.propTypes = {
	onAgreeClick: PropTypes.func.isRequired,
	onCloseClick: PropTypes.func.isRequired,
	onLinkClick: PropTypes.func
};

MoonpayAgreementModal.defaultProps = {};

export default MoonpayAgreementModal;
