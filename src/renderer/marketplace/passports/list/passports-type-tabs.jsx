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
					Passport description
				</Typography>
			)}
			{type === 'residency' && (
				<Typography
					id="personalView"
					variant="subtitle2"
					color="secondary"
					className={classes.tabContent}
				>
					Residency description
				</Typography>
			)}
		</React.Fragment>
	);
});

export default PassportsTypeTabs;
export { PassportsTypeTabs };
