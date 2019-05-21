import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { bankAccountsOperations, bankAccountsSelectors } from 'common/bank-accounts';
/*
import { Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
*/
import { BankingOffersPage } from './offers-page';

const styles = theme => ({});

class BankAccountsTable extends Component {
	componentDidMount() {
		if (!this.props.bankAccounts || !this.props.bankAccounts.length) {
			this.props.dispatch(bankAccountsOperations.loadBankAccountsOperation());
		}
	}

	render() {
		// const { classes, isLoading, bank_accounts, keyRate } = this.props;
		const { isLoading, bankAccounts, keyRate } = this.props;
		console.log(keyRate, bankAccounts);

		return (
			<BankingOffersPage
				keyRate={keyRate}
				data={bankAccounts}
				onDetails={null}
				onBackClick={null}
				isLoading={isLoading}
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
