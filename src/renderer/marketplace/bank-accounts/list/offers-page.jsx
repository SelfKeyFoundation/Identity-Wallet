import React from 'react';
import { BankingOffersTable } from './offers-table';
import { BankingAccountTypeTabs } from './account-type-tabs';
import { Grid, withStyles } from '@material-ui/core';
import OffersPageLayout from '../../common/offers-page-layout';

const styles = theme => ({});

const BankingOffersPage = withStyles(styles)(
	({
		classes,
		loading,
		data,
		keyRate,
		onDetails,
		accountType,
		onAccountTypeChange,
		onBackClick
	}) => {
		return (
			<OffersPageLayout title="Bank Accounts" loading={loading} onBackClick={onBackClick}>
				<Grid item className={classes.tabs}>
					<BankingAccountTypeTabs
						accountType={accountType}
						onAccountTypeChange={onAccountTypeChange}
					/>
				</Grid>
				<Grid item>
					<BankingOffersTable keyRate={keyRate} data={data} onDetails={onDetails} />
				</Grid>
			</OffersPageLayout>
		);
	}
);

export default BankingOffersPage;
export { BankingOffersPage };
