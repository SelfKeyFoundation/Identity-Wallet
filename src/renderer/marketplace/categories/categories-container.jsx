import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ethGasStationInfoOperations } from 'common/eth-gas-station';
import { marketplacesSelectors } from 'common/marketplaces';
import { MarketplaceCategoriesList } from './categories-list';
import { push } from 'connected-react-router';

class MarketplaceCategoriesContainer extends Component {
	componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
	}

	actions = {
		exchanges: () => {
			console.log('/main/marketplace/exchanges');
			this.props.dispatch(push('/main/marketplace/exchanges'));
		},
		incorporation: () => {
			this.props.dispatch(push('/main/marketplace/incorporation'));
		},
		bank_accounts: () => {
			this.props.dispatch(push('/main/marketplace/bank-accounts'));
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

const mapStateToProps = state => ({
	categories: marketplacesSelectors.categoriesSelectors(state)
});

const connectedComponent = connect(mapStateToProps)(MarketplaceCategoriesContainer);
export { connectedComponent as MarketplaceCategoriesContainer };
export default connectedComponent;
