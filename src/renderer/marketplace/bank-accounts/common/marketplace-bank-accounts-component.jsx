import { MarketplaceComponent } from '../../common/marketplace-component';

const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = '/main/marketplace-bank-accounts';

export default class MarketplaceBankAccountsComponent extends MarketplaceComponent {
	processStartedRoute = () => {
		const { accountCode, countryCode, templateId, vendorId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/process-started/${accountCode}/${countryCode}/${templateId}/${vendorId}`;
	};

	selectBankRoute = () => {
		const { countryCode, accountCode, templateId, vendorId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/select-bank/${accountCode}/${countryCode}/${templateId}/${vendorId}`;
	};

	paymentCompleteRoute = () => {
		const { countryCode, accountCode, templateId, vendorId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/payment-complete/${accountCode}/${countryCode}/${templateId}/${vendorId}`;
	};

	payRoute = () => {
		const { countryCode, accountCode, templateId, vendorId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/pay/${accountCode}/${countryCode}/${templateId}/${vendorId}`;
	};

	checkoutRoute = () => {
		const { countryCode, accountCode, templateId, vendorId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/checkout/${accountCode}/${countryCode}/${templateId}/${vendorId}`;
	};

	cancelRoute = () => {
		const { countryCode, accountCode, templateId, vendorId } = this.props.match.params;
		return this.detailsRoute({ countryCode, accountCode, templateId, vendorId });
	};

	detailsRoute = ({ accountCode, countryCode, templateId, vendorId }) =>
		`${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/details/${accountCode}/${countryCode}/${templateId}/${vendorId}`;

	listRoute = () => MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH;

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
