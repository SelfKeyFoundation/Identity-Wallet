import React from 'react';
import { BankingOffersTable } from './offers-table';
import { BankingAccountTypeTabs } from './account-type-tabs';
import { PageLoading } from '../../common';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { BackButton, BankIcon } from 'selfkey-ui';

const styles = theme => ({
	pageContent: {
		width: '1074px',
		margin: '0 auto'
	},
	'@media screen and (min-width: 1230px)': {
		pageContent: {
			width: '1140px'
		}
	},
	header: {
		borderBottom: 'solid 1px #475768',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingBottom: '30px',
		marginBottom: '40px',
		marginTop: '70px'
	},
	headerTitle: {
		paddingLeft: '21px'
	},
	icon: {
		height: '36px',
		width: '36px'
	},
	backButtonContainer: {
		left: '75px',
		position: 'absolute'
	},
	tabs: {
		marginBottom: '15px'
	}
});

const BankingOffersPage = withStyles(styles)(
	({
		classes,
		loading,
		inventory,
		keyRate,
		onDetails,
		accountType,
		onAccountTypeChange,
		onBackClick
	}) => {
		return (
			<Grid container>
				<Grid item>
					<div className={classes.backButtonContainer}>
						<BackButton onclick={onBackClick} />
					</div>
				</Grid>
				{loading && <PageLoading />}
				{!loading && (
					<Grid item>
						<Grid
							id="bankAccounts"
							container
							direction="column"
							justify="flex-start"
							alignItems="stretch"
							className={classes.pageContent}
						>
							<Grid item id="header" className={classes.header}>
								<BankIcon className={classes.icon} />
								<Typography variant="h1" className={classes.headerTitle}>
									Bank Accounts
								</Typography>
							</Grid>

							<Grid item className={classes.tabs}>
								<BankingAccountTypeTabs
									accountType={accountType}
									onAccountTypeChange={onAccountTypeChange}
								/>
							</Grid>

							<Grid item>
								<BankingOffersTable
									keyRate={keyRate}
									inventory={inventory}
									onDetails={onDetails}
								/>
							</Grid>
						</Grid>
					</Grid>
				)}
			</Grid>
		);
	}
);

export default BankingOffersPage;
export { BankingOffersPage };
