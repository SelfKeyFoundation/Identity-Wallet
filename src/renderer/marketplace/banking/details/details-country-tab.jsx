import React from 'react';
import { withStyles, Typography } from '@material-ui/core';

const styles = theme => ({});

export const BankingCountryTab = withStyles(styles)(({ classes }) => (
	<div className={classes.tabContainer}>
		<Typography variant="body2" color="secondary">
			We work with 4 different banks in Singapore. Each bank has different eligibility
			requirements, types of accounts available and onboarding processes. We invite you to
			carefully review each banks requirements and services to better understand if their
			banking services meet your needs:
		</Typography>
	</div>
));

export default BankingCountryTab;
