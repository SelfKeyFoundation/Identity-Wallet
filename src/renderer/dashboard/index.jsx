import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import TokenList from './token-list';
import CryptoChartBox from './crypto-chart-box';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import TransactionsHistory from '../transaction/transactions-history';

const Dashboard = connect()(props => {
	return (
		<Grid
			id="viewDashboard"
			container
			direction="column"
			justify="flex-start"
			alignItems="center"
			spacing={32}
		>
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
