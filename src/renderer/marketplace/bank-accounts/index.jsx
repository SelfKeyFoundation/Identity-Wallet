import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import { BankAccountsTableContainer } from './list/offers-container';
import { BankAccountsDetailContainer } from './details/details-container';

class MarketplaceBankAccountsComponent extends Component {
	render() {
		const { path } = this.props.match;
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

export { MarketplaceBankAccountsComponent as MarketplaceBankAccountsPage };
