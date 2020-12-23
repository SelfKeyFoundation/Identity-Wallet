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

export const MoonpayAuthModal = ({ onCloseClick, onAContinueClick, onLinkClick }) => {
	const classes = useStyles();
	return (
		<Popup closeAction={onCloseClick} text="MoonPayAuth">
			<Grid container direction="column" spacing={4}>
				<Grid item>
					<Typography variant="body1">Authenticate With Moonpay:</Typography>
				</Grid>
				<Grid item>
					<Grid container direction="row" spacing={2}>
						<Grid item>
							<Button variant="outlined" size="large" onClick={onAContinueClick}>
								Authenticate
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

MoonpayAuthModal.propTypes = {
	onAContinueClick: PropTypes.func.isRequired,
	onCloseClick: PropTypes.func.isRequired,
	onLinkClick: PropTypes.func
};

MoonpayAuthModal.defaultProps = {};

export default MoonpayAuthModal;
