import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { bankAccountsOperations, bankAccountsSelectors } from 'common/bank-accounts';
import { BankingOffersPage } from './offers-page';

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

	activeBank = bank => bank.accountType === this.state.accountType && bank.showWallet === true;

	render() {
		const { isLoading, bankAccounts, keyRate } = this.props;
		const { accountType } = this.state;

		const data = bankAccounts.filter(this.activeBank);

		return (
			<BankingOffersPage
				keyRate={keyRate}
				data={data}
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
	bankAccounts: PropTypes.array,
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	return {
		bankAccounts: bankAccountsSelectors.getMainBankAccounts(state),
		isLoading: bankAccountsSelectors.getLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD')
	};
};

const styledComponent = withStyles(styles)(BankAccountsTableContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as BankAccountsTableContainer };
