import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { marketplaceOperations } from 'common/marketplace';
import { PassportsListContainer } from './list/passports-list-container';
import { PassportsDetailsContainer } from './details/passports-details-container';
import { PassportsCheckoutContainer } from './checkout/passports-checkout-container';
import { PassportsPaymentContainer } from './checkout/passports-payment-container';
import { PassportsPaymentCompleteContainer } from './checkout/passports-payment-complete-container';
import { PassportsProcessStartedContainer } from './checkout/passports-process-started-container';

class MarketplacePassportsComponent extends PureComponent {
	async componentDidMount() {
		await this.props.dispatch(marketplaceOperations.loadMarketplaceOperation());
	}
	render() {
		const { path } = this.props.match;
		return (
			<>
				<Route exact path={`${path}`} component={PassportsListContainer} />
				<Route
					path={`${path}/details/:programCode/:countryCode/:templateId?/:vendorId?`}
					component={PassportsDetailsContainer}
				/>
				<Route
					path={`${path}/checkout/:programCode/:countryCode/:templateId/:vendorId`}
					component={PassportsCheckoutContainer}
				/>
				<Route
					path={`${path}/pay/:programCode/:countryCode/:templateId/:vendorId`}
					component={PassportsPaymentContainer}
				/>
				<Route
					path={`${path}/payment-complete/:programCode/:countryCode/:templateId/:vendorId/:orderId?`}
					component={PassportsPaymentCompleteContainer}
				/>
				<Route
					path={`${path}/process-started/:programCode/:countryCode/:templateId/:vendorId`}
					component={PassportsProcessStartedContainer}
				/>
			</>
		);
	}
}

const MarketplacePassports = connect()(MarketplacePassportsComponent);
export { MarketplacePassports };
