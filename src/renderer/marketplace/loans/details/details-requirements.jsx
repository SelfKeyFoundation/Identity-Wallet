import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	bodyText: {
		marginTop: '1em	'
	}
});

const LoansDetailsRequirements = withStyles(styles)(({ classes, item }) => (
	<Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={2}>
		<Grid item>
			<Typography variant="h5">Requirements for Loans:</Typography>
			<Typography variant="body2" className={classes.bodyText}>
				{item.data.requirements}
			</Typography>
		</Grid>
	</Grid>
));

export { LoansDetailsRequirements };
export default LoansDetailsRequirements;
