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

const styles = theme => ({});

class LoansListContainer extends MarketplaceLoansComponent {
	state = {
		accountType: 'personal'
	};

	onBackClick = () => this.props.dispatch(push(this.marketplaceRootPath()));

	onDetailsClick = offer => {
		/*
		const { accountCode, countryCode } = jurisdiction.data;
		const { templateId, vendorId } = jurisdiction;
		this.props.dispatch(
			push(this.detailsRoute({ accountCode, countryCode, templateId, vendorId }))
		);
		*/
	};

	render() {
		const { isLoading, keyRate, vendors, inventory } = this.props;

		return (
			<LoansListPage
				keyRate={keyRate}
				vendors={vendors}
				inventory={inventory}
				onBackClick={this.onBackClick}
				onDetails={this.onDetailsClick}
				loading={isLoading}
			/>
		);
	}
}

LoansListContainer.propTypes = {
	identity: PropTypes.object,
	inventory: PropTypes.array,
	vendors: PropTypes.array,
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	const identity = identitySelectors.selectIdentity(state);
	return {
		identity,
		vendors: marketplaceSelectors.selectVendorsForCategory(state, 'loans'),
		inventory: marketplaceSelectors.selectLoansInventory(state, identity.type),
		isLoading: marketplaceSelectors.isInventoryLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD')
	};
};

const styledComponent = withStyles(styles)(LoansListContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as LoansListContainer };
