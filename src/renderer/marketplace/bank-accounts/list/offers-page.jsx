import React from 'react';
import { BankingOffersTable } from './offers-table';
import { BankingAccountTypeTabs } from './account-type-tabs';
import { PageLoading } from '../../common';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { BackButton, BankIcon } from 'selfkey-ui';

const styles = theme => ({
	pageContent: {
		margin: '0 auto',
		width: '1074px'
	},
	'@media screen and (min-width: 1230px)': {
		pageContent: {
			width: '1140px'
		}
	},
	header: {
		alignItems: 'center',
		borderBottom: 'solid 1px #475768',
		display: 'flex',
		justifyContent: 'flex-start',
		marginBottom: theme.spacing(5),
		marginTop: theme.spacing(9),
		paddingBottom: theme.spacing(4)
	},
	headerTitle: {
		paddingLeft: theme.spacing(2)
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
		marginBottom: theme.spacing(2)
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
