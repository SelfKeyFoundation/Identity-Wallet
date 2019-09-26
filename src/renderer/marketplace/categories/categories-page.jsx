import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ethGasStationInfoOperations } from 'common/eth-gas-station';
import { marketplacesSelectors } from 'common/marketplaces';
import { MarketplaceCategoriesList } from './categories-list';
import { push } from 'connected-react-router';
import { ordersOperations } from '../../../common/marketplace/orders';

const mapStateToProps = state => ({
	categories: marketplacesSelectors.categoriesSelectors(state)
});

class MarketplaceCategoriesPageComponent extends Component {
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
		}
	};

	render() {
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

export const MarketplaceCategoriesPage = connect(mapStateToProps)(
	MarketplaceCategoriesPageComponent
);
export default MarketplaceCategoriesPage;
