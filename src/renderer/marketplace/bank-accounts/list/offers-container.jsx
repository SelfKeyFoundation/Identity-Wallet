import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { BankingOffersPage } from './offers-page';
import { marketplaceSelectors } from 'common/marketplace';
import { MarketplaceBankAccountsComponent } from '../common/marketplace-bank-accounts-component';
import { identitySelectors } from 'common/identity';

const styles = theme => ({});

class BankAccountsTableContainer extends MarketplaceBankAccountsComponent {
	state = {
		accountType: 'business'
	};

	onBackClick = () => this.props.dispatch(push(this.marketplaceRootPath()));

	onAccountTypeChange = accountType => this.setState({ accountType });

	onDetailsClick = jurisdiction => {
		const { accountCode, countryCode } = jurisdiction.data;
		const { templateId, vendorId } = jurisdiction;
		this.props.dispatch(
			push(this.detailsRoute({ accountCode, countryCode, templateId, vendorId }))
		);
	};

	render() {
		const { isLoading, keyRate, vendors, inventory } = this.props;
		const { accountType: selectedType } = this.state;

		const data = inventory
			.filter(bank => bank.data.type === selectedType)
			.filter(bank => Object.keys(bank.data.accounts).length > 0)
			.sort((a, b) =>
				a.data.region < b.data.region ? -1 : a.data.region > b.data.region ? 1 : 0
			);

		return (
			<BankingOffersPage
				keyRate={keyRate}
				vendors={vendors}
				inventory={data}
				onBackClick={this.onBackClick}
				accountType={selectedType}
				onAccountTypeChange={this.onAccountTypeChange}
				onDetails={this.onDetailsClick}
				loading={isLoading}
			/>
		);
	}
}

BankAccountsTableContainer.propTypes = {
	inventory: PropTypes.array,
	vendors: PropTypes.array,
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	const identity = identitySelectors.selectIdentity(state);
	return {
		vendors: marketplaceSelectors.selectVendorsForCategory(state, 'banking'),
		inventory: marketplaceSelectors.selectBanks(state, identity.type),
		isLoading: marketplaceSelectors.isInventoryLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD')
	};
};

const styledComponent = withStyles(styles)(BankAccountsTableContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as BankAccountsTableContainer };
