import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Alert } from '../../common';

const styles = theme => ({
	status: {
		alignItems: 'center',
		backgroundColor: '#262F39',
		'& p': {
			display: 'inline-block'
		},
		'& svg': {
			verticalAlign: 'middle'
		}
	},
	payment: {
		textAlign: 'right'
	},
	alertWrap: {
		alignItems: 'center',
		display: 'flex'
	}
});

export const ApplicationStatusCompleted = withStyles(styles)(({ classes, statusAction }) => (
	<React.Fragment>
		<Alert type="success" xtraClass={classes.alertWrap}>
			<Grid item xs={9}>
				<Typography variant="body2" color="secondary">
					Your application was successful
				</Typography>
			</Grid>
			<Grid item xs={3} className={classes.payment}>
				<Button variant="contained" onClick={statusAction}>
					Manage Applications
				</Button>
			</Grid>
		</Alert>
	</React.Fragment>
));

export const ApplicationStatusRejected = withStyles(styles)(({ classes, statusAction }) => (
	<React.Fragment>
		<Alert type="warning" xtraClass={classes.alertWrap}>
			<Grid item xs={9}>
				<Typography variant="body2" color="secondary">
					Your previous application was rejected
				</Typography>
			</Grid>
			<Grid item xs={3} className={classes.payment}>
				<Button variant="contained" onClick={statusAction}>
					Manage Applications
				</Button>
			</Grid>
		</Alert>
	</React.Fragment>
));

export const ApplicationStatusUnpaid = withStyles(styles)(({ classes, statusAction }) => (
	<Alert type="warning" xtraClass={classes.alertWrap}>
		<Grid item xs={9}>
			<Typography variant="body2" color="secondary">
				You have an existing <strong>unpaid</strong> application
			</Typography>
		</Grid>
		<Grid item xs={3} className={classes.payment}>
			<Button variant="contained" onClick={statusAction}>
				Pay
			</Button>
		</Grid>
	</Alert>
));

export const ApplicationStatusAdditionalRequirements = withStyles(styles)(
	({ classes, statusAction }) => (
		<Alert type="warning" xtraClass={classes.alertWrap}>
			<Grid item xs={9}>
				<Typography variant="body2" color="secondary">
					Your existing application requires additional information
				</Typography>
			</Grid>
			<Grid item xs={3} className={classes.payment}>
				<Button variant="contained" onClick={statusAction}>
					Complete Application
				</Button>
			</Grid>
		</Alert>
	)
);

export const ApplicationStatusInProgress = withStyles(styles)(({ classes, contact }) => (
	<Alert type="warning" xtraClass={classes.alertWrap}>
		<Typography variant="body2" color="secondary">
			You have an existing <strong>in progress</strong> application
			{contact ? `, please contact ${contact} for further details` : ''}
		</Typography>
	</Alert>
));

const statusComponent = {
	completed: { StatusComponent: ApplicationStatusCompleted },
	progress: { StatusComponent: ApplicationStatusInProgress },
	unpaid: { StatusComponent: ApplicationStatusUnpaid },
	rejected: { StatusComponent: ApplicationStatusRejected },
	additionalRequirements: {
		StatusComponent: ApplicationStatusAdditionalRequirements
	}
};

export const ApplicationStatusBar = withStyles(styles)(
	({ classes, status, contact, statusAction, loading = false, barStyle }) => {
		if (!statusComponent.hasOwnProperty(status) || loading) {
			return null;
		}
		const { StatusComponent } = statusComponent[status];
		return (
			<Grid
				container
				direction="row"
				justify="flex-start"
				alignItems="flex-start"
				className={`${classes.status} ${barStyle}`}
			>
				<StatusComponent contact={contact} statusAction={statusAction} />
			</Grid>
		);
	}
);
