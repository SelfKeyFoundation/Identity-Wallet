import React from 'react';
import { PageLoading } from '../../common';
import { Button, Typography, Grid, withStyles } from '@material-ui/core';
import { TransferIcon } from 'selfkey-ui';

const styles = theme => ({
	pageContent: {
		width: '1080px',
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
		left: '75px',
		position: 'absolute'
	},
	tabs: {
		marginBottom: '15px'
	}
});

const LoansListPage = withStyles(styles)(
	({ classes, loading, inventory, keyRate, onDetails, onBackClick }) => {
		return (
			<Grid container>
				<Grid item>
					<div className={classes.backButtonContainer}>
						<Button
							id="backToMarketplace"
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
							id="loans"
							container
							direction="column"
							justify="flex-start"
							alignItems="stretch"
							className={classes.pageContent}
						>
							<Grid item id="header" className={classes.header}>
								<TransferIcon className={classes.icon} />
								<Typography variant="h1" className={classes.headerTitle}>
									Loans
								</Typography>
							</Grid>

							<Grid item className={classes.tabs}>
								Tabs
							</Grid>

							<Grid item>Table</Grid>
						</Grid>
					</Grid>
				)}
			</Grid>
		);
	}
);

export default LoansListPage;
export { LoansListPage };
