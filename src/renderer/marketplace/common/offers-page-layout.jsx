import React from 'react';
import { PageLoading } from './page-loading';
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

const OffersPageLayout = withStyles(styles)(
	({ classes, loading, onBackClick, title, children }) => {
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
									{title}
								</Typography>
							</Grid>
							{children}
						</Grid>
					</Grid>
				)}
			</Grid>
		);
	}
);

export default OffersPageLayout;
export { OffersPageLayout };
