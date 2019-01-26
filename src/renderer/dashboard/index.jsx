import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import TokenList from './token-list';
import CryptoChartBox from './crypto-chart-box';
import TransactionsHistory from '../transaction/transactions-history';

import { KycManager } from '../kyc';

const Dashboard = props => {
	return (
		<Grid container direction="column" justify="flex-start" alignItems="center" spacing={32}>
			<KycManager relyingPartyName="B*Trade" />
			<Grid container item direction="row" justify="flex-start" alignItems="flex-start">
				<Typography variant="h1">SelfKey Dashboard</Typography>
			</Grid>
			<Grid item>
				<TokenList />
			</Grid>
			<Grid item>
				<CryptoChartBox />
			</Grid>
			<Grid item>
				<TransactionsHistory />
			</Grid>
		</Grid>
	);
};
export default Dashboard;
