import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { BankingOffersPage } from './offers-page';
import { marketplaceSelectors } from 'common/marketplace';
import { MarketplaceBankAccountsComponent } from '../common/marketplace-bank-accounts-component';

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
		const { accountType } = this.state;

		const data = inventory.filter(bank => bank.data.type === this.state.accountType);

		return (
			<BankingOffersPage
				keyRate={keyRate}
				vendors={vendors}
				inventory={data}
				onBackClick={this.onBackClick}
				accountType={accountType}
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
	return {
		vendors: marketplaceSelectors.selectVendorsForCategory(state, 'banking'),
		inventory: marketplaceSelectors.selectBanks(state),
		isLoading: marketplaceSelectors.isLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD')
	};
};

const styledComponent = withStyles(styles)(BankAccountsTableContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as BankAccountsTableContainer };
