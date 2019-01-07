import React from 'react';
import { Route } from 'react-router-dom';
import AddressBook from '../../address-book/main';
import Marketplace from '../../marketplace';

import { Grid, withStyles } from '@material-ui/core';
import Toolbar from './toolbar';

const styles = theme => ({
	wrapper: {},
	headerSection: {
		width: '100%'
	},
	bodySection: {
		width: '100%'
	}
});

const Main = ({ match, classes }) => {
	return (
		<Grid
			container
			direction="column"
			justify="flex-start"
			alignItems="center"
			className={classes.wrapper}
		>
			<Grid item xs={12} className={classes.headerSection}>
				<Toolbar />
			</Grid>
			<Grid item xs={12} className={classes.bodySection}>
				<Route path={`${match.path}/addressBook`} component={AddressBook} />
				<Route path={`${match.path}/marketplace`} component={Marketplace} />
			</Grid>
		</Grid>
	);
};

export default withStyles(styles)(Main);
