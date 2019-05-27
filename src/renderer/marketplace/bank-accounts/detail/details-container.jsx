import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { bankAccountsOperations, bankAccountsSelectors } from 'common/bank-accounts';
import { BankingDetailsPage } from './details-page';

const styles = theme => ({});
const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = '/main/marketplace-bank-accounts';

class BankAccountsDetailContainer extends Component {
	componentDidMount() {
		if (!this.props.bankAccount) {
			this.props.dispatch(bankAccountsOperations.loadBankAccountsOperation());
		}
	}

	onBackClick = () => this.props.dispatch(push(MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH));

	render() {
		const { bankAccount, bankDetails, keyRate } = this.props;
		console.log(bankAccount, bankDetails);

		return (
			<BankingDetailsPage
				countryCode={bankAccount.countryCode}
				price="1500"
				keyRate={keyRate}
				region={bankAccount.region}
				onBack={this.onBackClick}
			/>
		);
	}
}

BankAccountsDetailContainer.propTypes = {
	bankAccount: PropTypes.array,
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	const { accountCode } = props.match.params;
	// const notAuthenticated = false;
	return {
		bankAccount: bankAccountsSelectors.getBankByAccountCode(state, accountCode),
		bankDetails: bankAccountsSelectors.getDetailsByAccountCode(state, accountCode),
		isLoading: bankAccountsSelectors.getLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD')
	};
};

const styledComponent = withStyles(styles)(BankAccountsDetailContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsDetailContainer };
