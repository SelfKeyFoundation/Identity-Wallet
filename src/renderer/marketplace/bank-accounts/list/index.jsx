import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { bankAccountsOperations, bankAccountsSelectors } from 'common/bank-accounts';
/*
import { Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
*/
import { BankingOffersPage } from './offers-page';

const styles = theme => ({});
const MARKETPLACE_ROOT_PATH = '/main/marketplace-categories';

class BankAccountsTable extends Component {
	state = {
		accountType: 'personal',
		loading: false
	};

	componentDidMount() {
		if (!this.props.bankAccounts || !this.props.bankAccounts.length) {
			this.props.dispatch(bankAccountsOperations.loadBankAccountsOperation());
		}
	}

	onBackClick = () => this.props.dispatch(push(MARKETPLACE_ROOT_PATH));

	onAccountTypeChange = accountType => this.setState({ accountType });

	onDetailsClick = bank => console.log('TODO', bank);

	render() {
		const { isLoading, bankAccounts, keyRate } = this.props;
		console.log(keyRate, bankAccounts, isLoading);
		const data = bankAccounts.filter(bank => bank.type === this.state.accountType);

		return (
			<BankingOffersPage
				keyRate={keyRate}
				data={data}
				onBackClick={this.onBackClick}
				accountType={this.state.accountType}
				onAccountTypeChange={this.onAccountTypeChange}
				onDetails={this.onDetailsClick}
				loading={isLoading}
			/>
		);
	}
}

BankAccountsTable.propTypes = {
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

const styledComponent = withStyles(styles)(BankAccountsTable);
export default connect(mapStateToProps)(styledComponent);
