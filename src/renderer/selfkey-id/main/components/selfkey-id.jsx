import React, { Component } from 'react';
import { Grid, Typography, Tabs, Tab } from '@material-ui/core';
import { connect } from 'react-redux';
import { walletSelectors } from 'common/wallet';
import { push } from 'connected-react-router';
import SelfkeyIdOverview from './selfkey-id-overview';
import SelfkeyIdApplications from './selfkey-id-applications';
import { kycSelectors, kycOperations } from 'common/kyc';
// import SelfkeyIdCompanies from './selfkey-id-companies';
// import SelfkeyIdHistory from './selfkey-id-history';

/*
const dummyApplications = [
	{
		type: 'Incorporation',
		country: 'Singapore',
		status: 'Documents Required',
		applicationDate: '08 May 2018',
		serviceProvider: 'Far Horizon Capintal Inc',
		providerContact: 'support@flagtheory.com',
		address: '10 Anson Rd Int Plaza #27-15 Singapore 079903',
		transactionId: 'asdasds21312',
		transactionDate: '08 May 2018 12:48AM',
		amount: '746,234,43.00 KEY',
		paymentStatus: 'Sent KEY'
	},
	{
		type: 'Incorporation',
		country: 'France',
		status: 'Documents Submitted',
		applicationDate: '07 May 2018',
		serviceProvider: 'Far Horizon Capintal Inc',
		providerContact: 'support@flagtheory.com',
		address: '10 Anson Rd Int Plaza #27-15 France 079903',
		transactionId: 'asdasds21312',
		transactionDate: '07 May 2018 12:48AM',
		amount: '746,234,43.00 ETH',
		paymentStatus: 'Sent ETH'
	},
	{
		type: 'Incorporation',
		country: 'Malta',
		status: 'Approved',
		applicationDate: '09 May 2018',
		serviceProvider: 'Far Horizon Capintal Inc',
		providerContact: 'support@flagtheory.com',
		address: '10 Anson Rd Int Plaza #27-15 Malta 079903',
		transactionId: 'asdasds2131313',
		transactionDate: '09 May 2018 12:48AM',
		amount: '746,234,49.00 KEY',
		paymentStatus: 'Sent KEY'
	},
	{
		type: 'Incorporation',
		country: 'Brazil',
		status: 'Denied',
		applicationDate: '10 May 2018',
		serviceProvider: 'Far Horizon Capintal Inc',
		providerContact: 'support@flagtheory.com',
		address: '10 Anson Rd Int Plaza #27-15 Brazil 079903',
		transactionId: 'asdasds2131111',
		transactionDate: '10 May 2018 12:48AM',
		amount: '746,234,10.00 KEY',
		paymentStatus: 'Sent ETH'
	}
];
*/

class SelfkeyIdComponent extends Component {
	state = {
		tabValue: 0
	};

	async componentDidMount() {
		const { wallet, dispatch } = this.props;

		if (!wallet.isSetupFinished) {
			await dispatch(push('/selfkeyIdCreate'));
		} else {
			await this.props.dispatch(kycOperations.loadApplicationsOperation());
		}
	}

	handleChange = (event, tabValue) => {
		this.setState({ tabValue });
	};

	render() {
		console.log(this.props);

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
		applications: kycSelectors.selectApplications(state)
	};
};

export const SelfkeyId = connect(mapStateToProps)(SelfkeyIdComponent);

export default SelfkeyId;
