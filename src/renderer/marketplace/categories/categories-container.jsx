import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ethGasStationInfoOperations } from 'common/eth-gas-station';
import { marketplacesSelectors } from 'common/marketplaces';
import { MarketplaceCategoriesList } from './categories-list';
import { identitySelectors } from 'common/identity';
import { MarketplaceCorporatePreviewContainer } from './corporate-preview-container';
import { push } from 'connected-react-router';
import { ordersOperations } from '../../../common/marketplace/orders';

class MarketplaceCategoriesContainer extends Component {
	componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
		this.props.dispatch(ordersOperations.ordersLoadOperation());
	}

	actions = {
		exchanges: () => {
			this.props.dispatch(push('/main/marketplace-exchanges'));
		},
		incorporation: () => {
			this.props.dispatch(push('/main/marketplace-incorporation'));
		},
		bank_accounts: () => {
			this.props.dispatch(push('/main/marketplace-bank-accounts'));
		},
		notaries: () => {
			this.props.dispatch(push('/main/marketplace-notaries'));
		}
	};

	render() {
		if (this.props.identity.type !== 'individual') {
			return <MarketplaceCorporatePreviewContainer />;
		}

		return (
			<MarketplaceCategoriesList
				items={this.props.categories.map(cat => ({
					...cat,
					learnMoreAction: this.actions[cat.id]
				}))}
			/>
		);
	}
}

const mapStateToProps = state => ({
	categories: marketplacesSelectors.categoriesSelectors(state),
	identity: identitySelectors.selectCurrentIdentity(state)
});

const connectedComponent = connect(mapStateToProps)(MarketplaceCategoriesContainer);
export { connectedComponent as MarketplaceCategoriesContainer };
export default connectedComponent;
