import React from 'react';
// import { BankingOffersTable } from './offers-table';
import { PageLoading } from '../../common';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { BackButton, PassportsIcon } from 'selfkey-ui';
import { PassportsTypeTabs } from './passports-type-tabs';
import { PassportsListTable } from './passports-list-table';
import { ResidenciesListTable } from './residencies-list-table';

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

const PassportsListPage = withStyles(styles)(
	({
		classes,
		loading,
		passports,
		residencies,
		keyRate,
		onDetails,
		type,
		onTypeChange,
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
							id="passports-list-page"
							container
							direction="column"
							justify="flex-start"
							alignItems="stretch"
							className={classes.pageContent}
						>
							<Grid item id="header" className={classes.header}>
								<PassportsIcon className={classes.icon} />
								<Typography variant="h1" className={classes.headerTitle}>
									Passports & Residencies
								</Typography>
							</Grid>

							<Grid item className={classes.tabs}>
								<PassportsTypeTabs type={type} onTypeChange={onTypeChange} />
							</Grid>

							<Grid item>
								{type === 'passport' && (
									<PassportsListTable
										keyRate={keyRate}
										inventory={passports}
										onDetails={onDetails}
									/>
								)}
								{type === 'residency' && (
									<ResidenciesListTable
										keyRate={keyRate}
										inventory={residencies}
										onDetails={onDetails}
									/>
								)}
							</Grid>
						</Grid>
					</Grid>
				)}
			</Grid>
		);
	}
);

export default PassportsListPage;
export { PassportsListPage };
