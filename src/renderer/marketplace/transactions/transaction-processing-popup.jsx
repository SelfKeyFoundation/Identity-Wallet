import React from 'react';
import { Popup } from './popup';
import { Grid, Typography, withStyles } from '@material-ui/core';
import { H2, HourGlassLargeIcon } from 'selfkey-ui';

const styles = theme => ({
	text: {
		color: '#FFFFFF',
		fontSize: '18px',
		lineHeight: '30px'
	},

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
					<H2 className={classes.headerText}>Transaction Processing</H2>
				</Grid>
				<Grid item id="body" className={classes.body}>
					<Typography variant="body2" className={classes.text}>
						Your transaction is pending. The time it takes to complete will depend on
						the amount of network traffic.
					</Typography>
				</Grid>
			</Grid>
		</Grid>
	</Grid>
));

export const MarketplaceTransactionProcessingPopup = props => {
	return (
		<Popup closeAction={props.closeAction}>
			<TransactionProcessingContent {...props} />
		</Popup>
	);
};

export default MarketplaceTransactionProcessingPopup;
