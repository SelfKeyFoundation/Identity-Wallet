import React from 'react';
import { withStyles, Tabs, Tab } from '@material-ui/core';

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

export const LoansTabs = withStyles(styles)(
	({ classes, tab = 'lending', onTabChange, ...tabProps }) => {
		return (
			<div className={classes.LoansTabs}>
				<Tabs
					value={tab}
					className={classes.tabs}
					onChange={(evt, value) => onTabChange(value)}
				>
					<Tab id="lending" value="lending" label="Lending" />
					<Tab id="borrowing" value="borrowing" label="Borrowing" />
					<Tab id="calculator" value="calculator" label="Loan Calculator" />
				</Tabs>
			</div>
		);
	}
);

export default LoansTabs;
