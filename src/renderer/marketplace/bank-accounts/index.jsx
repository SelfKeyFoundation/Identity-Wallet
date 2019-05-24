import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import BankAccountsTableContainer from './list';
import { BankAccountsDetailContainer } from './detail';

class MarketplaceBankAccountsComponent extends Component {
	render() {
		const { path } = this.props.match;
		console.log(path);
		return (
			<div>
				<Route exact path={`${path}`} component={BankAccountsTableContainer} />
				<Route
					path={`${path}/details/:accountCode/:countryCode/:templateId?`}
					component={BankAccountsDetailContainer}
				/>
			</div>
		);
	}
}

const MarketplaceBankAccountsPage = MarketplaceBankAccountsComponent;
export { MarketplaceBankAccountsPage };
