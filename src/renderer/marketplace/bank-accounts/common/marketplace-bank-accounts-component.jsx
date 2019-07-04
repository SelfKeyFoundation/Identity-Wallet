import { MarketplaceComponent } from '../../common/marketplace-component';
const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = '/main/marketplace-bank-accounts';

export default class MarketplaceBankAccountsComponent extends MarketplaceComponent {
	selectBankRoute = () => {
		const { countryCode, accountCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/select-bank/${accountCode}/${countryCode}/${templateId}`;
	};

	cancelRoute = () => {
		const { countryCode, accountCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/details/${accountCode}/${countryCode}/${templateId}`;
	};

	getApplicationStatus = () => {
		if (this.props.rp && this.props.rp.authenticated && this.userHasApplied()) {
			if (this.applicationCompleted()) return 'completed';
			if (this.applicationWasRejected()) return 'rejected';
			if (!this.userHasPaid()) return 'unpaid';
			if (!this.userHasSelectedBankPreference()) return 'additionalRequirements';
			if (this.applicationRequiresAdditionalDocuments()) return 'additionalRequirements';

			return 'progress';
		}
		return null;
	};

	getBankQuestionId = questions => {
		if (!questions) {
			console.error(
				'Expecting questions in bank account template',
				this.props.match.params.templateId
			);
			return false;
		}
		const keys = Object.keys(questions);
		const questionId = keys.filter(
			k => questions[k].question.toLowerCase() === 'bank preference'
		);
		return questionId ? questionId[0] : false;
	};

	getExistingBankPreferenceSelection = application => {
		const questions = application.questions;
		const questionId = this.getBankQuestionId(questions);
		return questions[questionId].value ? questions[questionId].value[0] : '';
	};

	userHasSelectedBankPreference = () => {
		const application = this.getLastApplication();
		return !!this.getExistingBankPreferenceSelection(application);
	};
}

export { MarketplaceBankAccountsComponent };
