import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { LoansListPage } from './list-page';
import { marketplaceSelectors } from 'common/marketplace';
import { MarketplaceLoansComponent } from '../common/marketplace-loans-component';
import { identitySelectors } from 'common/identity';
import { getTokens } from 'common/wallet-tokens/selectors';

const styles = theme => ({});

class LoansListContainer extends MarketplaceLoansComponent {
	onBackClick = () => this.props.dispatch(push(this.marketplaceRootPath()));

	onDetailsClick = offer => {
		this.props.dispatch(push(this.detailsRoute(offer.id)));
	};

	render() {
		const { isLoading, rates, vendors, inventory, tokens } = this.props;

		return (
			<LoansListPage
				vendors={vendors}
				inventory={inventory}
				onBackClick={this.onBackClick}
				onDetailsClick={this.onDetailsClick}
				rates={rates}
				loading={isLoading}
				tokens={tokens}
			/>
		);
	}
}

LoansListContainer.propTypes = {
	identity: PropTypes.object,
	inventory: PropTypes.array,
	vendors: PropTypes.array,
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number,
	tokens: PropTypes.array,
	rates: PropTypes.array
};

const mapStateToProps = (state, props) => {
	const identity = identitySelectors.selectIdentity(state);
	return {
		identity,
		vendors: marketplaceSelectors.selectVendorsForCategory(state, 'loans'),
		inventory: marketplaceSelectors.selectLoansInventory(state, identity.type),
		isLoading: marketplaceSelectors.isInventoryLoading(state),
		rates: pricesSelectors.getPrices(state).prices,
		tokens: getTokens(state)
	};
};

const styledComponent = withStyles(styles)(LoansListContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as LoansListContainer };
