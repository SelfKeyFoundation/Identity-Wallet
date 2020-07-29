import React from 'react';
import { Popup } from './popup';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { WarningShieldIcon } from 'selfkey-ui';

const styles = theme => ({
	body: {
		paddingTop: '20px'
	}
});

export const TransactionErrorContent = withStyles(styles)(({ classes }) => (
	<Grid container direction="row" justify="flex-start" alignItems="flex-start">
		<Grid item xs={2}>
			<WarningShieldIcon />
		</Grid>
		<Grid item xs={10}>
			<Grid container direction="column" justify="flex-start" alignItems="flex-start">
				<Grid item id="header">
					<Typography variant="h1">Transaction Error</Typography>
				</Grid>
				<Grid item id="body" className={classes.body}>
					<Typography variant="body1">
						Transaction failed, please try again later.
					</Typography>
				</Grid>
			</Grid>
		</Grid>
	</Grid>
));

export const TransactionErrorPopup = props => {
	return (
		<Popup closeAction={props.closeAction} text={props.title}>
			<TransactionErrorContent {...props} />
		</Popup>
	);
};

export default TransactionErrorPopup;
