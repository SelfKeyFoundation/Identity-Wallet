import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { marketplaceSelectors } from 'common/marketplace';
import { MarketplaceExchangesComponent } from './common/marketplace-exchanges-component';
import { ExchangesList } from './exchanges-list';
import { ExchangeSmallIcon } from 'selfkey-ui';

const styles = theme => ({});

class ExchangesListContainer extends MarketplaceExchangesComponent {
	onBackClick = () => this.props.dispatch(push(this.marketplaceRootPath()));

	onDetailsClick = id => this.props.dispatch(push(this.detailsRoute(id)));

	render() {
		return (
			<ExchangesList
				backAction={this.onBackClick}
				viewAction={this.onDetailsClick}
				{...this.props}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		isLoading: marketplaceSelectors.isLoading(state),
		items: marketplaceSelectors.selectInventoryForCategory(state, 'exchanges'),
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
