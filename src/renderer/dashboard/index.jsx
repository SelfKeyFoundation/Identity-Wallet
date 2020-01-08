import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import TokenList from './token-list';
import CryptoChartBox from './crypto-chart-box';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import TransactionsHistory from '../transaction/transactions-history';
import { Alert } from '../common';
import { appSelectors } from 'common/app';

const mapStateToProps = state => {
	return {
		info: appSelectors.selectAutoUpdateInfo(state)
	};
};

const Dashboard = connect(mapStateToProps)(props => {
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
						<Grid container direction="row" justify="space-between" alignItems="center">
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
			<Grid item style={{ width: '100%' }}>
				<TokenList />
			</Grid>
			<Grid item style={{ width: '100%' }}>
				<CryptoChartBox
					manageCryptoAction={() => props.dispatch(push('/main/crypto-manager'))}
				/>
			</Grid>
			<Grid item style={{ width: '100%' }}>
				<TransactionsHistory />
			</Grid>
		</Grid>
	);
});
export default Dashboard;
