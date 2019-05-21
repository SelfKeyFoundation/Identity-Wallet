import React from 'react';

import { Grid, CircularProgress, withStyles } from '@material-ui/core';

const styles = theme => ({
	loading: {
		marginTop: '5em'
	}
});

export const PageLoading = withStyles(styles)(({ classes }) => (
	<Grid container justify="center" alignItems="center">
		<CircularProgress size={50} className={classes.loading} />
	</Grid>
));

export default PageLoading;
