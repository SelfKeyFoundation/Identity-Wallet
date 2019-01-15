import React from 'react';
import { connect } from 'react-redux';
import { getExchanges } from 'common/exchanges/selectors';
import { Items } from 'selfkey-ui';
import { push } from 'connected-react-router';

const Exchanges = props => {
	const backAction = () => {
		props.dispatch(push('/main/marketplace'));
	};

	const viewAction = name => {
		props.dispatch(push(`/main/marketplaceItem/${name}`));
	};

	return <Items backAction={backAction} viewAction={viewAction} {...props} />;
};

const mapStateToProps = (state, props) => {
	console.log('state', state);
	return {
		items: getExchanges(state),
		category: 'Exchanges'
	};
};

export default connect(mapStateToProps)(Exchanges);
