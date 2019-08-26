import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors, kycOperations } from 'common/kyc';
import { bankAccountsOperations, bankAccountsSelectors } from 'common/bank-accounts';
import { MarketplaceBankAccountsComponent } from '../common/marketplace-bank-accounts-component';
import { OptionSelection } from '../common/option-selection';

const styles = theme => ({});
const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = '/main/marketplace-bank-accounts';

class BankAccountsSelectBankContainer extends MarketplaceBankAccountsComponent {
	async componentDidMount() {
		await this.loadRelyingParty({ rp: 'incorporations', authenticated: true });

		if (!this.props.accountType) {
			await this.props.dispatch(bankAccountsOperations.loadBankAccountsOperation());
		}
	}

	getNextRoute = () => {
		const { accountCode, countryCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/process-started/${accountCode}/${countryCode}/${templateId}`;
	};

	onBackClick = () => this.props.dispatch(push(this.cancelRoute()));

	onStartClick = async selection => {
		const { templateId } = this.props.match.params;
		const application = this.getLastApplication();
		let questions = [];

		const templateQuestionId = this.getBankQuestionId(application.questions);
		if (templateQuestionId) {
			questions = [
				{
					id: templateQuestionId,
					data: [selection]
				}
			];
		}

		await this.props.dispatch(
			kycOperations.updateRelyingPartyKYCApplication(
				'incorporations',
				templateId,
				application.id,
				false,
				questions
			)
		);

		this.props.dispatch(push(this.getNextRoute()));
	};

	render() {
		const { countryCode } = this.props.match.params;
		const { accountType, banks } = this.props;
		const { region } = accountType;

		return (
			<OptionSelection
				accountType={accountType}
				title={`Choose your preferred Bank in ${region}`}
				description1={`Please, choose a preferred bank and an account type to continue with the process. Make sure to check
					whether you fulfill the requirements below and whether you are required or not to make a personal
					visit to the banker to finalize the account opening.`}
				description2={`Selecting a preferred option does not guarantee opening an account with that specific bank. We
					start the process with your option first, but if you are not eligible for that specific bank we
					will suggest another bank from those available in the specific jurisdiction.`}
				options={banks}
				selected={this.getExistingBankPreferenceSelection(this.getLastApplication())}
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
		address: getWallet(state).address,
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
