import React from 'react';
import { Grid, Typography, Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Popup } from '../common';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles(theme => ({
	loadingSection: {},
	loading: {}
}));

export const LoadingModal = ({ onCloseClick, title, text }) => {
	const classes = useStyles();
	return (
		<Popup closeAction={onCloseClick} text={title}>
			<Grid container direction="column" alignItems="center" spacing={4}>
				{text && (
					<Grid item>
						<Typography variant="body1">{text}</Typography>
					</Grid>
				)}
				<Grid item className={classes.loadingSection}>
					<CircularProgress size={50} className={classes.loading} />
				</Grid>
				{onCloseClick && (
					<Grid item>
						<Grid container direction="row" spacing={2}>
							<Grid item>
								<Button variant="contained" size="large" onClick={onCloseClick}>
									Cancel
								</Button>
							</Grid>
						</Grid>
					</Grid>
				)}
			</Grid>
		</Popup>
	);
};

LoadingModal.propTypes = {
	onCloseClick: PropTypes.func,
	title: PropTypes.string,
	text: PropTypes.string
};

LoadingModal.defaultProps = {
	title: 'Loading',
	text: 'Loading in progress...'
};

export default LoadingModal;
