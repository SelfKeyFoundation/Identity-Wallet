import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { bankAccountsOperations, bankAccountsSelectors } from 'common/bank-accounts';
import { BankingOffersPage } from './offers-page';
import { marketplaceSelectors } from 'common/marketplace';
import NoConnection from 'renderer/no-connection';

const styles = theme => ({});
const MARKETPLACE_ROOT_PATH = '/main/marketplace-categories';
const BANK_ACCOUNTS_DETAIL_PATH = '/main/marketplace-bank-accounts/details';

class BankAccountsTableContainer extends Component {
	state = {
		accountType: 'business'
	};

	componentDidMount() {
		if (!this.props.bankAccounts || !this.props.bankAccounts.length) {
			this.props.dispatch(bankAccountsOperations.loadBankAccountsOperation());
		}
	}

	onBackClick = () => this.props.dispatch(push(MARKETPLACE_ROOT_PATH));

	onAccountTypeChange = accountType => this.setState({ accountType });

	onDetailsClick = bank =>
		this.props.dispatch(
			push(
				`${BANK_ACCOUNTS_DETAIL_PATH}/${bank.accountCode}/${bank.countryCode}/${
					bank.templateId
				}`
			)
		);

	activeBank = bank => bank.data.type === this.state.accountType;

	render() {
		const { isLoading, keyRate, isError, vendors, inventory } = this.props;
		const { accountType } = this.state;

		if (!isLoading && isError) {
			return <NoConnection onBackClick={this.onBackClick} />;
		}
		console.log('XXX', JSON.stringify(vendors), JSON.stringify(inventory));
		const data = inventory.filter(this.activeBank);

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
	keyRate: PropTypes.number,
	isError: PropTypes.any
};

const mapStateToProps = (state, props) => {
	return {
		vendors: marketplaceSelectors.selectVendorsForCategory(state, 'banking'),
		inventory: marketplaceSelectors.selectInventoryForCategory(state, 'banking'),
		isLoading: marketplaceSelectors.isLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		isError: bankAccountsSelectors.getError(state)
	};
};

const styledComponent = withStyles(styles)(BankAccountsTableContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as BankAccountsTableContainer };
