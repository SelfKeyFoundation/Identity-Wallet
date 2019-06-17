import React from 'react';
import { BankingOffersTable } from './offers-table';
import { BankingAccountTypeTabs } from './account-type-tabs';
import { PageLoading } from '../../common';
import { Button, Typography, Grid, withStyles } from '@material-ui/core';
import { BankIcon } from 'selfkey-ui';

const styles = theme => ({
	pageContent: {
		width: '1140px',
		margin: '0 auto'
	},
	header: {
		borderBottom: 'solid 1px #475768',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingBottom: '30px',
		marginBottom: '40px',
		marginTop: '50px'
	},
	headerTitle: {
		paddingLeft: '21px'
	},
	icon: {
		height: '36px',
		width: '36px'
	},
	backButtonContainer: {
		left: '15px',
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
		data,
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
						<Button
							variant="outlined"
							color="secondary"
							size="small"
							onClick={onBackClick}
						>
							<Typography
								variant="subtitle2"
								color="secondary"
								className={classes.bold}
							>
								‹ Back
							</Typography>
						</Button>
					</div>
				</Grid>
				{loading && <PageLoading />}
				{!loading && (
					<Grid item>
						<Grid
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
									data={data}
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
