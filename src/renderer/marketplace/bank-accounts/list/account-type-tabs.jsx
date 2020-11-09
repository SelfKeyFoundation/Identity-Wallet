import React from 'react';
import { Tabs, Tab, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	tabContent: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2)
	}
});

const BankingAccountTypeTabs = withStyles(styles)(
	({ classes, accountType, onAccountTypeChange }) => {
		return (
			<React.Fragment>
				{accountType !== 'business' && (
					<Tabs value={accountType} onChange={(evt, value) => onAccountTypeChange(value)}>
						<Tab id="businessType" value="personal" label="Personal Accounts" />
						<Tab id="privateType" value="private" label="Wealth Management" />
					</Tabs>
				)}
				{accountType === 'personal' && (
					<Typography
						id="personalView"
						variant="subtitle2"
						color="secondary"
						className={classes.tabContent}
					>
						Personal account refers to the account owned by an individual or a couple if
						it{"'"}s a joint{'-'}account. That type of account is intended to reflect
						the person{"'"}s banking needs and obligations and is not transferrable.
					</Typography>
				)}
				{accountType === 'business' && (
					<Typography
						id="businessView"
						variant="subtitle2"
						color="secondary"
						className={classes.tabContent}
					>
						A corporate account or business account held at a bank or other financial
						institution by the company and used for business transactions. Banks offer a
						variety of solutions and account options for small, medium or large
						businesses.
					</Typography>
				)}
				{accountType === 'private' && (
					<Typography
						id="privateView"
						variant="subtitle2"
						color="secondary"
						className={classes.tabContent}
					>
						Wealth Management accounts provide banking, investment and other financial
						services to high-net-worth individuals with high levels of income or sizable
						assets.
					</Typography>
				)}
			</React.Fragment>
		);
	}
);

export default BankingAccountTypeTabs;
export { BankingAccountTypeTabs };
