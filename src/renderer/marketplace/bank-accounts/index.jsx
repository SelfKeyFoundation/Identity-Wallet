import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import BankAccountsTable from './table';
// import BankAccountsDetailView from './detail';

class MarketplaceBankAccountsComponent extends Component {
	render() {
		const { path } = this.props.match;

		return (
			<div>
				<Route exact path={`${path}`} component={BankAccountsTable} />
				{/*
				<Route
					path={`${path}/details/:accountCode/:countryCode/:templateId?`}
					component={BankAccountsDetailView}
				/>
				*/}
			</div>
		);
	}
}

const MarketplaceBankAccountsPage = MarketplaceBankAccountsComponent;
export { MarketplaceBankAccountsPage };
