import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors, kycOperations } from 'common/kyc';
import { bankAccountsOperations, bankAccountsSelectors } from 'common/bank-accounts';
import { OptionSelection } from '../common/option-selection';

const styles = theme => ({});
const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = '/main/marketplace-bank-accounts';
// const VENDOR_NAME = 'Far Horizon Capital Inc';

class BankAccountsSelectBankContainer extends Component {
	async componentDidMount() {
		const authenticated = true;
		// If session is not authenticated, reauthenticate with KYC-Chain
		// Otherwise, just check if user has already applied to redirect
		// back to incorporations page

		if (this.props.rpShouldUpdate) {
			await this.props.dispatch(
				kycOperations.loadRelyingParty('incorporations', authenticated)
			);
		} else {
			await this.checkIfUserCanOpenBankAccount();
		}

		if (!this.props.accountType) {
			await this.props.dispatch(bankAccountsOperations.loadBankAccountsOperation());
		}
	}

	getCancelRoute = () => {
		const { accountCode, countryCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/details/${accountCode}/${countryCode}/${templateId}`;
	};

	onBackClick = () => this.props.dispatch(push(this.getCancelRoute()));

	onStartClick = selection => {
		console.log(selection);
		// TODO: update current application with selected option
	};

	render() {
		console.log(this.props.rp);

		const { accountType, banks } = this.props;
		const { region } = accountType;
		const { countryCode } = this.props.match.params;
		return (
			<OptionSelection
				accountType={accountType}
				title={`Choose your preferred Bank in ${region}`}
				description1={
					'Please, choose a preferred bank and an account type to continue with the process. Make sure to check whether you fulfill the requirements below and whether you are required or not to make a personal visit to the banker to finalize the account opening.'
				}
				description2={
					'Selecting a preferred option does not guarantee opening an account with that specific bank. We start the process with your option first, but if you are not eligible for that specific bank we will suggest another bank from those available in the specific jurisdiction.'
				}
				options={banks}
				countryCode={countryCode}
				onBackClick={this.onBackClick}
				onStartClick={this.onStartClick}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { accountCode, countryCode } = props.match.params;
	const authenticated = true;
	return {
		accountType: bankAccountsSelectors.getTypeByAccountCode(state, accountCode),
		banks: bankAccountsSelectors.getDetailsByAccountCode(state, accountCode),
		jurisdiction: bankAccountsSelectors.getJurisdictionsByCountryCode(state, countryCode),
		publicKey: getWallet(state).publicKey,
		currentApplication: kycSelectors.selectCurrentApplication(state),
		rp: kycSelectors.relyingPartySelector(state, 'incorporations'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'incorporations',
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(BankAccountsSelectBankContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsSelectBankContainer };
