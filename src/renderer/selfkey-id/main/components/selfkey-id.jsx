import React, { Component } from 'react';
import { Grid, Typography, Tabs, Tab } from '@material-ui/core';
import { connect } from 'react-redux';
import { walletSelectors } from 'common/wallet';
import { push } from 'connected-react-router';
import SelfkeyIdOverview from './selfkey-id-overview';
import SelfkeyIdApplications from './selfkey-id-applications';
// import SelfkeyIdCompanies from './selfkey-id-companies';
// import SelfkeyIdHistory from './selfkey-id-history';

const dummyApplications = [
	{
		id: '1',
		owner: 'owner',
		scope: 'Singapore',
		rpName: 'incorporations',
		currentStatus: 1,
		currentStatusName: 'Documents Required',
		applicationDate: '08 May 2018',
		payments: {
			amount: '123',
			amountKey: '746,234,43.00 KEY',
			transactionHash: 'asdasds21312',
			transactionDate: '08 May 2018 12:48AM'
		}
	},
	{
		id: '2',
		owner: 'owner',
		scope: 'France',
		rpName: 'incorporations',
		currentStatus: 2,
		currentStatusName: 'Documents Submitted',
		applicationDate: '07 May 2018',
		payments: {
			amount: '123',
			amountKey: '746,234,40.00 KEY',
			transactionHash: 'asdasds21311',
			transactionDate: '07 May 2018 12:48AM'
		}
	},
	{
		id: '3',
		owner: 'owner',
		scope: 'Malta',
		rpName: 'incorporations',
		currentStatus: 3,
		currentStatusName: 'Approved',
		applicationDate: '06 May 2018',
		payments: {
			amount: '123',
			amountKey: '746,234,41.00 KEY',
			transactionHash: 'asdasds21313',
			transactionDate: '06 May 2018 12:48AM'
		}
	},
	{
		id: '4',
		owner: 'owner',
		scope: 'Brazil',
		rpName: 'incorporations',
		currentStatus: 4,
		currentStatusName: 'Denied',
		applicationDate: '05 May 2018',
		payments: {
			amount: '123',
			amountKey: '746,234,44.00 KEY',
			transactionHash: 'asdasds21314',
			transactionDate: '05 May 2018 12:48AM'
		}
	}
];

class SelfkeyIdComponent extends Component {
	state = {
		tabValue: 0
	};

	async componentDidMount() {
		const { wallet, dispatch } = this.props;

		if (!wallet.isSetupFinished) {
			await dispatch(push('/selfkeyIdCreate'));
		}
	}

	handleChange = (event, tabValue) => {
		this.setState({ tabValue });
	};

	render() {
		let component = <SelfkeyIdOverview {...this.props} />;

		if (this.state.tabValue === 1) {
			component = <SelfkeyIdApplications {...this.props} />;
		}
		// } else if (this.state.tabValue === 2) {
		// 	component = <SelfkeyIdCompanies {...this.props} />;
		// } else if (this.state.tabValue === 3) {
		// 	component = <SelfkeyIdHistory {...this.props} />;
		// }

		return (
			<Grid container direction="column" spacing={32}>
				<Grid item>
					<Typography variant="h1">SelfKey Identity Wallet</Typography>
				</Grid>
				<Grid item>
					<Tabs value={this.state.tabValue} onChange={this.handleChange}>
						<Tab label="Overview" />
						<Tab label="Marketplace Applications" />
						{/* <Tab label="Companies" /> */}
						{/* <Tab label="History" /> */}
					</Tabs>
				</Grid>
				<Grid item>{component}</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		wallet: walletSelectors.getWallet(state),
		applications: dummyApplications
	};
};

export const SelfkeyId = connect(mapStateToProps)(SelfkeyIdComponent);

export default SelfkeyId;
