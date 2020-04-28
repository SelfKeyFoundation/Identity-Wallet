import React from 'react';
import { withStyles, Tabs, Tab } from '@material-ui/core';
import { LoansDetailsHighlights } from './details-highlights';

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
					<Tab id="requirements" value="requirements" label="Requirements" disabled />
				</Tabs>
				{tab === 'highlights' && (
					<LoansDetailsHighlights id="highlights-tab" {...tabProps} />
				)}
			</div>
		);
	}
);

export default LoansDetailsTabs;
