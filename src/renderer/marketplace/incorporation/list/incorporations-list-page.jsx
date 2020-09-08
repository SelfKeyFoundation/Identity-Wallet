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
	tabs: {
		marginBottom: '15px'
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
							container
							id="incorporations"
							direction="column"
							justify="flex-start"
							alignItems="stretch"
							className={classes.pageContent}
						>
							<Grid
								container
								item
								id="header"
								alignItems="center"
								justify="flex-start"
								className={classes.header}
							>
								<IncorporationsIcon className={classes.icon} />
								<Typography variant="h1" className={classes.headerTitle}>
									Incorporation Marketplace
								</Typography>
							</Grid>
							<Grid container item>
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
