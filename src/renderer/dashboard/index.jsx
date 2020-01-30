import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
// import TokenList from './token-list';
import CryptoChartBox from './crypto-chart-box';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import TransactionsHistory from '../transaction/transactions-history';
import DashboardMarketplaceApplications from './dashboard-marketplace-applications';
import DashboardSelfkeyProfile from './dashboard-selfkey-profile';
import { Alert } from '../common';
import { withStyles } from '@material-ui/core/styles';
import { appSelectors } from 'common/app';
import { CustomIcon } from 'selfkey-ui';

const styles = theme => ({
	leftSideWidget: {
		width: '66%'
	},
	padding: {
		padding: '16px'
	},
	smallWidget: {
		width: '32%'
	},
	rightColumnWrap: {
		display: 'flex',
		flexDirection: 'column',
		'& .rightColumnWidget': {
			flexGrow: 1
		}
	},
	smallWidgetBox: {
		border: '1px solid #43505B',
		borderRadius: '4px',
		boxSizing: 'border-box',
		padding: '20px 30px 30px'
	},
	trading: {
		backgroundColor: '#1E262E',
		marginBottom: '15px',
		maxHeight: '236px'
	},
	transactions: {
		backgroundColor: '#262F39'
	},
	title: {
		fontSize: '20px',
		marginBottom: '30px'
	},
	ctabutton: {
		display: 'flex',
		justifyContent: 'space-between',
		maxWidth: '100%',
		marginLeft: 'auto',
		marginRight: '0',
		width: '100%',
		'& span': {
			flexGrow: 1
		}
	}
});

const mapStateToProps = state => {
	return {
		info: appSelectors.selectAutoUpdateInfo(state)
	};
};

const Dashboard = connect(mapStateToProps)(
	withStyles(styles)(props => {
		const { classes } = props;
		return (
			<Grid
				id="viewDashboard"
				container
				direction="column"
				justify="flex-start"
				alignItems="center"
				spacing={32}
			>
				{props.info && props.info.version && (
					<Grid item style={{ width: '100%' }}>
						<Alert type="warning">
							<Grid
								container
								direction="row"
								justify="space-between"
								alignItems="center"
							>
								<div>
									A new version of the wallet is available! For security reasons
									please update to the latest version.
								</div>
								<div>
									<Button
										variant="contained"
										size="small"
										onClick={() => props.dispatch(push('/auto-update'))}
									>
										DOWNLOAD & INSTALL
									</Button>
								</div>
							</Grid>
						</Alert>
					</Grid>
				)}
				<Grid container item direction="row" justify="flex-start" alignItems="flex-start">
					<Typography variant="h1">SelfKey Dashboard</Typography>
				</Grid>
				<Grid
					container
					justify="space-between"
					className={classes.padding}
					spacing={10}
					wrap="nowrap"
				>
					<Grid item className={classes.leftSideWidget}>
						<CryptoChartBox
							manageCryptoAction={() => props.dispatch(push('/main/crypto-manager'))}
							manageAddTokenAction={() => props.dispatch(push('/main/add-token'))}
						/>
					</Grid>
					<Grid item className={`${classes.smallWidget} ${classes.rightColumnWrap}`}>
						<Grid
							item
							className={`${classes.trading} ${
								classes.smallWidgetBox
							} rightColumnWidget`}
						>
							<Typography variant="h1" className={classes.title}>
								Buy KEY tokens, to use in the SelfKey Marketplace.
							</Typography>
							<Button
								variant="outlined"
								color="primary"
								size="large"
								className={classes.ctabutton}
							>
								<CustomIcon width="24px" height="24px" />
								<span>Buy KEY</span>
							</Button>
						</Grid>
						<Grid
							item
							className={`${classes.transactions} ${
								classes.smallWidgetBox
							} rightColumnWidget`}
						>
							<TransactionsHistory />
						</Grid>
					</Grid>
				</Grid>

				<Grid
					container
					justify="space-between"
					className={classes.padding}
					spacing={10}
					wrap="nowrap"
				>
					<Grid item className={classes.leftSideWidget}>
						<DashboardMarketplaceApplications />
					</Grid>
					<Grid item className={classes.smallWidget}>
						<DashboardSelfkeyProfile />
					</Grid>
				</Grid>
			</Grid>
		);
	})
);
export default Dashboard;
