import React from 'react';
import { Popup } from './popup';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { HourGlassLargeIcon } from 'selfkey-ui';

const styles = theme => ({
	body: {
		paddingTop: '20px'
	}
});

export const TransactionProcessingContent = withStyles(styles)(({ classes }) => (
	<Grid container direction="row" justify="flex-start" alignItems="flex-start">
		<Grid item xs={2}>
			<HourGlassLargeIcon />
		</Grid>
		<Grid item xs={10}>
			<Grid container direction="column" justify="flex-start" alignItems="flex-start">
				<Grid item id="header">
					<Typography variant="h1">Transaction Processing</Typography>
				</Grid>
				<Grid item id="body" className={classes.body}>
					<Typography variant="body1">
						Your transaction is pending. The time it takes to complete will depend on
						the amount of network traffic.
					</Typography>
				</Grid>
			</Grid>
		</Grid>
	</Grid>
));

export const TransactionProcessingPopup = props => {
	return (
		<Popup closeAction={props.closeAction} text={props.title}>
			<TransactionProcessingContent {...props} />
		</Popup>
	);
};

export default TransactionProcessingPopup;
