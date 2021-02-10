import React from 'react';
import { Grid, Typography, Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Popup } from '../common';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles(theme => ({
	loadingSection: {},
	loading: {},
	body: {
		marginTop: '1em'
	}
}));

export const TransactionLoadingModal = ({ onCloseClick, title, onStatusClick, transactionId }) => {
	const classes = useStyles();
	return (
		<Popup closeAction={onCloseClick} text={title}>
			<Grid container direction="column" alignItems="center" spacing={4}>
				<Grid item className={classes.loadingSection}>
					<CircularProgress size={50} className={classes.loading} />
				</Grid>

				<Grid item>
					<Typography variant="body2" color="secondary" className={classes.body}>
						Transactions normally take between a few minutes and half an hour to
						complete, but may take longer if we need to run additional checks. For
						example, if it{"'"}s your first-ever purchase, or your first purchase with a
						particular payment card.
					</Typography>
					<Typography variant="body2" color="secondary" className={classes.body}>
						You will be notified by email when transaction completes, you can safely
						close this window.
					</Typography>
				</Grid>
				{onCloseClick && (
					<Grid item>
						<Grid container direction="row" spacing={2}>
							{transactionId && (
								<Grid item>
									<Button
										variant="contained"
										size="large"
										onClick={onStatusClick}
									>
										Check Status
									</Button>
								</Grid>
							)}
							<Grid item>
								<Button variant="contained" size="large" onClick={onCloseClick}>
									Close
								</Button>
							</Grid>
						</Grid>
					</Grid>
				)}
			</Grid>
		</Popup>
	);
};

TransactionLoadingModal.propTypes = {
	onCloseClick: PropTypes.func,
	onStatusClick: PropTypes.func,
	title: PropTypes.string,
	transactionId: PropTypes.string
};

TransactionLoadingModal.defaultProps = {
	title: 'Loading'
};

export default TransactionLoadingModal;
