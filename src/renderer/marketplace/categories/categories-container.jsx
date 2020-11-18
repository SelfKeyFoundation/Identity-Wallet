import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { ethGasStationInfoOperations } from 'common/eth-gas-station';
import { marketplacesSelectors } from 'common/marketplaces';
import { MarketplaceCategoriesList } from './categories-list';
import { push } from 'connected-react-router';
import { identitySelectors } from 'common/identity';

class MarketplaceCategoriesContainer extends PureComponent {
	componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
		window.scrollTo(0, 0);
	}

	actions = {
		exchanges: () => this.props.dispatch(push('/main/marketplace/exchanges')),
		incorporation: () => this.props.dispatch(push('/main/marketplace/incorporation')),
		bank_accounts: () => this.props.dispatch(push('/main/marketplace/bank-accounts')),
		notaries: () => this.props.dispatch(push('/main/marketplace/notaries')),
		loans: () => this.props.dispatch(push('/main/marketplace/loans')),
		keyfi: () => this.props.dispatch(push('/main/marketplace/keyfi'))
	};

	render() {
		return (
			<MarketplaceCategoriesList
				items={this.props.categories.map(cat => ({
					...cat,
					learnMoreAction: this.actions[cat.name]
				}))}
			/>
		);
	}
}

const mapStateToProps = state => {
	const identity = identitySelectors.selectIdentity(state);
	return {
		identity,
		categories: marketplacesSelectors.categoriesSelectors(state, identity.type)
	};
};

const connectedComponent = connect(mapStateToProps)(MarketplaceCategoriesContainer);
export { connectedComponent as MarketplaceCategoriesContainer };
export default connectedComponent;
