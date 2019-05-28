import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { kycSelectors, kycOperations } from 'common/kyc';
import { walletSelectors } from 'common/wallet';
import { withStyles } from '@material-ui/core/styles';
import { bankAccountsOperations, bankAccountsSelectors } from 'common/bank-accounts';
import { BankingDetailsPage } from './details-page';

const styles = theme => ({});
const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = '/main/marketplace-bank-accounts';

class BankAccountsDetailContainer extends Component {
	state = {
		tab: 'types'
	};

	async componentDidMount() {
		const { rpShouldUpdate, bankAccount } = this.props;
		const notAuthenticated = false;

		if (!bankAccount) {
			await this.props.dispatch(bankAccountsOperations.loadBankAccountsOperation());
		}

		if (rpShouldUpdate) {
			await this.props.dispatch(
				kycOperations.loadRelyingParty('incorporations', notAuthenticated)
			);
		}
	}

	onBackClick = () => this.props.dispatch(push(MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH));

	onTabChange = tab => this.setState({ tab });

	render() {
		const { bankAccount, bankDetails, keyRate, jurisdiction, kycRequirements } = this.props;
		console.log(bankAccount, bankDetails, jurisdiction, kycRequirements);

		return (
			<BankingDetailsPage
				countryCode={bankAccount.countryCode}
				price="1500"
				tab={this.state.tab}
				onTabChange={this.onTabChange}
				keyRate={keyRate}
				region={bankAccount.region}
				jurisdiction={jurisdiction}
				kycRequirements={kycRequirements}
				templateId={'test'}
				onBack={this.onBackClick}
			/>
		);
	}
}

BankAccountsDetailContainer.propTypes = {
	bankAccount: PropTypes.object,
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	const { accountCode, countryCode } = props.match.params;
	// FIXME: test template
	const templateId = '5c3f3e9c3075d52f8f4ad613';
	const notAuthenticated = false;

	return {
		bankAccount: bankAccountsSelectors.getBankByAccountCode(state, accountCode),
		bankDetails: bankAccountsSelectors.getDetailsByAccountCode(state, accountCode),
		jurisdiction: bankAccountsSelectors.getJurisdictionsByCountryCode(state, countryCode),
		isLoading: bankAccountsSelectors.getLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		rp: kycSelectors.relyingPartySelector(state, 'incorporations'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'incorporations',
			notAuthenticated
		),
		kycRequirements: kycSelectors.selectRequirementsForTemplate(
			state,
			'incorporations',
			templateId
		),
		wallet: walletSelectors.getWallet(state)
	};
};

const styledComponent = withStyles(styles)(BankAccountsDetailContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsDetailContainer };
