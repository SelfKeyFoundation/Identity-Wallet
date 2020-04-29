import React from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { LoansDetailsHighlights } from './details-highlights';
import { LoansDetailsRequirements } from './details-requirements';

const styles = theme => ({
	LoansTabs: {
		alignItems: 'stretch',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start'
	},
	tabs: {
		marginBottom: '40px'
	}
});

export const LoansDetailsTabs = withStyles(styles)(
	({ classes, tab = 'highlights', onTabChange, ...tabProps }) => {
		return (
			<div className={classes.LoansTabs}>
				<Tabs
					value={tab}
					className={classes.tabs}
					onChange={(evt, value) => onTabChange(value)}
				>
					<Tab id="highlights" value="highlights" label="Provider Highlights" />
					<Tab id="requirements" value="requirements" label="Requirements" />
				</Tabs>
				{tab === 'highlights' && (
					<LoansDetailsHighlights id="highlights-tab" {...tabProps} />
				)}
				{tab === 'requirements' && (
					<LoansDetailsRequirements id="requirements-tab" {...tabProps} />
				)}
			</div>
		);
	}
);

export default LoansDetailsTabs;
