import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	bottomSpace: {
		marginBottom: theme.spacing(1)
	}
});

const MarketplaceDisclaimer = withStyles(styles)(props => {
	const { classes } = props;
	return (
		<Typography variant="subtitle2" color="secondary" className={classes.bottomSpace}>
			Although we use our best efforts to keep the information of this site accurate and
			up-to-date, we make no representations or warranties with respect to the accuracy,
			applicability, fitness, or completeness of the contents of this website. We disclaim any
			warranties expressed or implied, merchantability, or fitness for any particular purposes
		</Typography>
	);
});

export { MarketplaceDisclaimer };
