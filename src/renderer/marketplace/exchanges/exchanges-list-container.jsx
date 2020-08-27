import React from 'react';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { marketplaceSelectors } from 'common/marketplace';
import { MarketplaceExchangesComponent } from './common/marketplace-exchanges-component';
import { ExchangesList } from './exchanges-list';
import { ExchangeSmallIcon } from 'selfkey-ui';
import { identitySelectors } from 'common/identity';

const styles = theme => ({});

class ExchangesListContainer extends MarketplaceExchangesComponent {
	state = {
		type: 'List'
	};

	componentDidMount() {
		window.scrollTo(0, 0);
		this.trackMatomoGoal(
			'MarketplaceVisitIndividualExchange',
			'MarketplaceVisitCorporateExchange'
		);
		this.trackMarketplaceVisit('exchanges');
	}

	onBackClick = () => this.props.dispatch(push(this.marketplaceRootPath()));

	onDetailsClick = id => this.props.dispatch(push(this.detailsRoute(id)));

	exchangesListLayoutChange = (e, value) => {
		let selectedType = value;
		this.setState({ selectedType });
	};

	render() {
		const { selectedType } = this.state;
		return (
			<ExchangesList
				backAction={this.onBackClick}
				viewAction={this.onDetailsClick}
				exchangesListLayoutChange={this.exchangesListLayoutChange}
				selectedType={selectedType}
				{...this.props}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const identity = identitySelectors.selectIdentity(state);
	return {
		isLoading: marketplaceSelectors.isInventoryLoading(state),
		identity,
		items: marketplaceSelectors.selectInventoryForCategory(
			state,
			'exchanges',
			'active',
			identity.type
		),
		category: {
			title: 'Exchanges',
			icon: <ExchangeSmallIcon />
		}
	};
};

const styledComponent = withStyles(styles)(ExchangesListContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as ExchangesListContainer };
