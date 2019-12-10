import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { featureIsDisabled } from 'common/feature-flags';
import { identitySelectors } from 'common/identity';
import { ordersOperations } from 'common/marketplace/orders';
import {
	MarketplaceCategoriesContainer,
	MarketplaceExchangesContainer,
	MarketplaceIncorporationPage,
	MarketplaceBankAccountsPage,
	MarketplaceSelfkeyIdRequired,
	MarketplaceSelfkeyDIDRequiredContainer,
	MarketplaceOrdersPage,
	MarketplaceNotariesPage
} from '../marketplace';
import { MarketplaceCorporatePreviewContainer } from './corporate-preview-container';
import { inventorySelectors } from '../../common/marketplace/inventory/index';
import MarketplaceLoadingErrorContainer from './marketplace-loading-error-container';
import { vendorSelectors } from '../../common/marketplace/vendors/index';
import { PageLoading } from './common';

class MarketplaceContainerComponent extends PureComponent {
	componentDidMount() {
		this.props.dispatch(ordersOperations.ordersLoadOperation());
	}

	render() {
		const { match, identity, isLoadingError, isLoading } = this.props;

		if (identity.type !== 'individual' && featureIsDisabled('corporateMarketplace')) {
			return <MarketplaceCorporatePreviewContainer />;
		}

		if (isLoading) {
			return <PageLoading />;
		}

		if (isLoadingError) {
			return <MarketplaceLoadingErrorContainer />;
		}

		return (
			<React.Fragment>
				<Route
					exact="1"
					path={`${match.path}`}
					component={MarketplaceCategoriesContainer}
				/>
				<Route
					path={`${match.path}/categories`}
					component={MarketplaceCategoriesContainer}
				/>
				<Route
					path={`${match.path}/selfkey-id-required`}
					component={MarketplaceSelfkeyIdRequired}
				/>
				<Route
					path={`${match.path}/selfkey-did-required`}
					component={MarketplaceSelfkeyDIDRequiredContainer}
				/>
				<Route path={`${match.path}/exchanges`} component={MarketplaceExchangesContainer} />
				<Route
					path={`${match.path}/incorporation`}
					component={MarketplaceIncorporationPage}
				/>
				<Route
					path={`${match.path}/bank-accounts`}
					component={MarketplaceBankAccountsPage}
				/>
				<Route path={`${match.path}/orders`} component={MarketplaceOrdersPage} />
				<Route path={`${match.path}/notaries`} component={MarketplaceNotariesPage} />
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	identity: identitySelectors.selectIdentity(state),
	isLoadingError: inventorySelectors.isInventoryLoadingError(state),
	isLoading: vendorSelectors.isVendorsLoading(state)
});

const connectedComponent = connect(mapStateToProps)(MarketplaceContainerComponent);
export { connectedComponent as MarketplaceContainer };
export default connectedComponent;
