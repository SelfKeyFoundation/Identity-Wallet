import React from 'react';
import { connect } from 'react-redux';
import { MarketplaceServicesList } from './services-list.jsx';
import { push } from 'connected-react-router';

export const MarketplaceServicesPage = connect()(props => {
	const { dispatch } = props;
	const backAction = () => {
		dispatch(push('/main/marketplace-categories'));
	};

	const viewAction = name => {
		dispatch(push(`/main/marketplace-services/${name}`));
	};

	return <MarketplaceServicesList backAction={backAction} viewAction={viewAction} {...props} />;
});

export default MarketplaceServicesPage;
