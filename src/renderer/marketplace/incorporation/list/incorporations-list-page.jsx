import React from 'react';
import { IncorporationsListTable } from './incorporations-list-table';
import { PageLoading } from '../../common';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { BackButton, IncorporationsIcon } from 'selfkey-ui';

const styles = theme => ({
	pageContent: {
		margin: '0 auto',
		width: '1074px'
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
	tabs: {
		marginBottom: theme.spacing(2)
	},
	backButtonContainer: {
		left: '75px',
		position: 'absolute'
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
				<Grid item className={classes.backButtonContainer}>
					<BackButton onclick={onBackClick} />
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
							<Grid container item id="header" className={classes.header}>
								<IncorporationsIcon className={classes.icon} />
								<Typography variant="h1" className={classes.headerTitle}>
									Incorporation Marketplace
								</Typography>
							</Grid>
							<Grid
								container
								item
								direction="row"
								justify="space-evenly"
								alignItems="center"
							>
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
