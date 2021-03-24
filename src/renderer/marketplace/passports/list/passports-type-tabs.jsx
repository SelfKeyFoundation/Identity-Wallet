import React from 'react';
import { Tabs, Tab, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	tabContent: {
		marginTop: '15px',
		marginBottom: '15px'
	}
});

const PassportsTypeTabs = withStyles(styles)(({ classes, type, onTypeChange }) => {
	return (
		<React.Fragment>
			<Tabs value={type} onChange={(evt, value) => onTypeChange(value)}>
				<Tab id="passport" value="passport" label="Passport" />
				<Tab id="residency" value="residency" label="Residency" />
			</Tabs>
			{type === 'passport' && (
				<Typography
					id="personalView"
					variant="subtitle2"
					color="secondary"
					className={classes.tabContent}
				>
					Apply and get approved for Citizenship in the following countries through
					investment programs. Invest a standard amount according to the country’s
					policies and pay a standard fee for the service. Pay the service fee in KEY
					tokens.
				</Typography>
			)}
			{type === 'residency' && (
				<Typography
					id="personalView"
					variant="subtitle2"
					color="secondary"
					className={classes.tabContent}
				>
					Apply and get approved for permanent or temporary residence in the following
					countries. Invest a standard amount according to the country’s policies and pay
					a standard fee for the service. Pay the service fee in KEY tokens
				</Typography>
			)}
		</React.Fragment>
	);
});

export default PassportsTypeTabs;
export { PassportsTypeTabs };
