import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import TokenList from './token-list';
import CryptoChartBox from './crypto-chart-box';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import TransactionsHistory from '../transaction/transactions-history';

import { appSelectors } from 'common/app';

const mapStateToProps = state => {
	return {
		info: appSelectors.selectAutoUpdateInfo(state)
	};
};

const PersonalDashboardPage = connect(mapStateToProps)(props => {
	return (
		<React.Fragment>
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
		</React.Fragment>
	);
});

export { PersonalDashboardPage };
export default PersonalDashboardPage;
