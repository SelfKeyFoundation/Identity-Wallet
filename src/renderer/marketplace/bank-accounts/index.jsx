import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { marketplaceOperations } from 'common/marketplace';
import { BankAccountsTableContainer } from './list/offers-container';
import { BankAccountsDetailContainer } from './details/details-container';
import { BankAccountsCheckoutContainer } from './checkout/checkout-container';
import { BankAccountsPaymentContainer } from './checkout/payment-container';
import { BankAccountsPaymentCompleteContainer } from './checkout/payment-complete-container';
import { BankAccountsSelectBankContainer } from './select-bank/select-bank-container';
import { BankAccountsProcessStartedContainer } from './process-started/process-started-container';

class MarketplaceBankAccountsComponent extends Component {
	async componentDidMount() {
		await this.props.dispatch(marketplaceOperations.loadMarketplaceOperation());
	}
	render() {
		const { path } = this.props.match;
		return (
			<div>
				<Route exact path={`${path}`} component={BankAccountsTableContainer} />
				<Route
					path={`${path}/details/:accountCode/:countryCode/:templateId?/:vendorId?`}
					component={BankAccountsDetailContainer}
				/>
				<Route
					path={`${path}/checkout/:accountCode/:countryCode/:templateId/:vendorId`}
					component={BankAccountsCheckoutContainer}
				/>
				<Route
					path={`${path}/pay/:accountCode/:countryCode/:templateId/:vendorId`}
					component={BankAccountsPaymentContainer}
				/>
				<Route
					path={`${path}/payment-complete/:accountCode/:countryCode/:templateId/:vendorId`}
					component={BankAccountsPaymentCompleteContainer}
				/>
				<Route
					path={`${path}/select-bank/:accountCode/:countryCode/:templateId/:vendorId`}
					component={BankAccountsSelectBankContainer}
				/>
				<Route
					path={`${path}/process-started/:accountCode/:countryCode/:templateId/:vendorId`}
					component={BankAccountsProcessStartedContainer}
				/>
			</div>
		);
	}
}

const MarketplaceBankAccountsPage = connect()(MarketplaceBankAccountsComponent);
export { MarketplaceBankAccountsPage };
