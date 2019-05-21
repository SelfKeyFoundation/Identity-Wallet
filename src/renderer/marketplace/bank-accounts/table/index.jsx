import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { bankAccountsOperations, bankAccountsSelectors } from 'common/bank-accounts';
import { Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
	loading: {
		marginTop: '5em'
	}
});

class BankAccountsTable extends Component {
	componentDidMount() {
		if (!this.props.bankAccounts || !this.props.bankAccounts.length) {
			this.props.dispatch(bankAccountsOperations.loadBankAccountsOperation());
		}
	}

	renderLoadingScreen = () => (
		<Grid container justify="center" alignItems="center">
			<CircularProgress size={50} className={this.props.classes.loading} />
		</Grid>
	);

	render() {
		// const { classes, isLoading, bank_accounts, keyRate } = this.props;
		const { isLoading, bankAccounts, keyRate } = this.props;
		if (isLoading) {
			return this.renderLoadingScreen();
		}
		console.log(keyRate, bankAccounts);
		// TODO: placeholder
		return null;
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
