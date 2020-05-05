import React from 'react';
import { IncorporationsListTable } from './incorporations-list-table';
import { PageLoading } from '../../common';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { BackButton, IncorporationsIcon } from 'selfkey-ui';

const styles = theme => ({
	pageContent: {
		width: '1074px',
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
	tabs: {
		marginBottom: '15px'
	},
	'@media screen and (min-width: 1230px)': {
		pageContent: {
			width: '1140px'
		}
	}
});

const IncorporationsListPage = withStyles(styles)(
	({ classes, loading, data, keyRate, onDetailsClick, onBackClick }) => {
		return (
			<Grid container>
				<Grid item>
					<BackButton id="backToMarketplace" onclick={onBackClick} />
				</Grid>
				{loading && <PageLoading />}
				{!loading && (
					<Grid item>
						<Grid
							id="incorporations"
							container
							direction="column"
							justify="flex-start"
							alignItems="stretch"
							className={classes.pageContent}
						>
							<Grid item id="header" className={classes.header}>
								<IncorporationsIcon className={classes.icon} />
								<Typography variant="h1" className={classes.headerTitle}>
									Incorporation Marketplace
								</Typography>
							</Grid>
							<Grid item direction="row" justify="space-evenly" alignItems="center">
								<IncorporationsListTable
									keyRate={keyRate}
									data={data}
									onDetailsClick={onDetailsClick}
								/>
							</Grid>
						</Grid>
					</Grid>
				)}
			</Grid>
		);
	}
);

export default IncorporationsListPage;
export { IncorporationsListPage };
