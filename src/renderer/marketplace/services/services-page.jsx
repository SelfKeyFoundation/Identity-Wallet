import React from 'react';
import { connect } from 'react-redux';
import { MarketplaceServicesList } from './services-list.jsx';
import { marketplaceOperations } from 'common/marketplace';
import { push } from 'connected-react-router';

export const MarketplaceServicesPage = connect()(props => {
	const { dispatch } = props;

	dispatch(marketplaceOperations.loadMarketplaceOperation());

	const backAction = () => {
		dispatch(push('/main/marketplace-categories'));
	};

	const viewAction = id => {
		dispatch(push(`/main/marketplace-services/${id}`));
	};

	return <MarketplaceServicesList backAction={backAction} viewAction={viewAction} {...props} />;
});

export default MarketplaceServicesPage;
