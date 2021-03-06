import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { pricesSelectors } from 'common/prices';
import { identitySelectors } from 'common/identity';
import { marketplaceSelectors } from 'common/marketplace';
import { BankingOffersPage } from './offers-page';
import { MarketplaceBankAccountsComponent } from '../common/marketplace-bank-accounts-component';

const styles = theme => ({});

class BankAccountsTableContainer extends MarketplaceBankAccountsComponent {
	state = {
		accountType: 'personal'
	};

	componentDidMount() {
		this.trackMarketplaceVisit('bank_accounts');
		this.trackMatomoGoal(
			'MarketplaceVisitIndividualBankAccounts',
			'MarketplaceVisitCorporateBankAccounts'
		);
	}

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
		const { isLoading, keyRate, vendors, inventory, identity } = this.props;
		let { accountType: selectedType } = this.state;

		if (identity.type === 'corporate') {
			selectedType = 'business';
		}

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
		identity,
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
