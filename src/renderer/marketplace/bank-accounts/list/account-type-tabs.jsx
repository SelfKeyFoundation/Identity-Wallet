import React from 'react';
import { withStyles, Tabs, Tab, Typography } from '@material-ui/core';
const styles = theme => ({
	tabContent: {
		marginTop: '15px',
		marginBottom: '15px'
	}
});

export const BankingAccountTypeTabs = withStyles(styles)(
	({ classes, accountType, onAccountTypeChange }) => {
		return (
			<React.Fragment>
				<Tabs value={accountType} onChange={(evt, value) => onAccountTypeChange(value)}>
					<Tab value="personal" label="Personal Accounts" />
					<Tab value="business" label="Corporate Accounts" />
					<Tab value="private" label="Private Banking" />
				</Tabs>
				{accountType === 'personal' && (
					<Typography variant="body2" color="secondary" className={classes.tabContent}>
						Personal account refers to the account owned by an individual or a couple if
						it{"'"}s a joint{'-'}account. That type of account is intended to reflect
						the person{"'"}s banking needs and obligations and is not transferrable.
					</Typography>
				)}
				{accountType === 'business' && (
					<Typography variant="body2" color="secondary" className={classes.tabContent}>
						Corporate Accounts
					</Typography>
				)}
				{accountType === 'private' && (
					<Typography variant="body2" color="secondary" className={classes.tabContent}>
						Private Banking
					</Typography>
				)}
			</React.Fragment>
		);
	}
);

export default BankingAccountTypeTabs;
