import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import TokenList from './token-list';
import CryptoChartBox from './crypto-chart-box';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import TransactionsHistory from '../transaction/transactions-history';

const Dashboard = connect()(props => {
	return (
		<Grid container direction="column" justify="flex-start" alignItems="center" spacing={32}>
			<Grid container item direction="row" justify="flex-start" alignItems="flex-start">
				<button
					onClick={() => {
						const { kycOperations } = require('common/kyc');
						props.dispatch(
							kycOperations.startCurrentApplicationOperation(
								'B*Trade',
								1,
								'/main/dashboard',
								'Incorporation Checklist: Singapure',
								'You are about to being the incorporation process in Singapore. Please double check your required documents are Certified True or Notarized where necessary. Failure to do so will result in delays in the incorporation process. You may also be asked to provide more information by the service provider.',
								'I understand SelfKey Wallet LLC will pass this information to Far Horizon Capital Inc, that will provide incorporation services in Singapore at my request and will communicate with me at my submitted email address above.'
							)
						);
					}}
				>
					Apply
				</button>
			</Grid>
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
