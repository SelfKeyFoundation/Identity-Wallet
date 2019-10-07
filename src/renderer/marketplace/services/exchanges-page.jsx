import React from 'react';
import { connect } from 'react-redux';
import { ExchangeSmallIcon } from 'selfkey-ui';
import { marketplaceSelectors } from 'common/marketplace';
import { marketplacesSelectors } from 'common/marketplaces';
import { MarketplaceServicesPage } from './services-page';

const mapStateToProps = (state, props) => {
	return {
		isLoading: marketplaceSelectors.isLoading(state),
		items: marketplaceSelectors.selectInventoryForCategory(state, 'exchanges'),
		category: {
			...marketplacesSelectors.categorySelector(state, 'exchanges'),
			icon: <ExchangeSmallIcon />
		}
	};
};

export const MarketplaceExchangesPage = connect(mapStateToProps)(MarketplaceServicesPage);

export default MarketplaceExchangesPage;
