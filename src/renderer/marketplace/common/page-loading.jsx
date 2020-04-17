import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, CircularProgress } from '@material-ui/core';

const styles = theme => ({
	loading: {
		marginTop: '5em'
	}
});

const PageLoading = withStyles(styles)(({ classes }) => (
	<Grid container justify="center" alignItems="center">
		<CircularProgress size={50} className={classes.loading} />
	</Grid>
));

export default PageLoading;
export { PageLoading };
