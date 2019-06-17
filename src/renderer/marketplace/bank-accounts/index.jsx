import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import { BankAccountsTableContainer } from './list/offers-container';
import { BankAccountsDetailContainer } from './details/details-container';
import { BankAccountsCheckoutContainer } from './checkout/checkout-container';
import { BankAccountsSelectBankContainer } from './select-bank/select-bank-container';
import { BankAccountsProcessStartedContainer } from './process-started/process-started-container';

class MarketplaceBankAccountsPage extends Component {
	render() {
		const { path } = this.props.match;
		return (
			<div>
				<Route exact path={`${path}`} component={BankAccountsTableContainer} />
				<Route
					path={`${path}/details/:accountCode/:countryCode/:templateId?`}
					component={BankAccountsDetailContainer}
				/>
				<Route
					path={`${path}/checkout/:accountCode/:countryCode/:templateId?`}
					component={BankAccountsCheckoutContainer}
				/>
				<Route
					path={`${path}/select-bank/:accountCode/:countryCode/:templateId?`}
					component={BankAccountsSelectBankContainer}
				/>
				<Route
					path={`${path}/process-started/:accountCode/:countryCode/:templateId?`}
					component={BankAccountsProcessStartedContainer}
				/>
			</div>
		);
	}
}

export default MarketplaceBankAccountsPage;
export { MarketplaceBankAccountsPage };
