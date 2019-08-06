import { MarketplaceComponent } from '../../common/marketplace-component';
import { incorporationsOperations } from 'common/incorporations';

const MARKETPLACE_INCORPORATIONS_ROOT_PATH = '/main/marketplace-incorporation';

export default class MarketplaceIncorporationsComponent extends MarketplaceComponent {
	paymentCompleteRoute = () => {
		const { countryCode, companyCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_INCORPORATIONS_ROOT_PATH}/payment-complete/${companyCode}/${countryCode}/${templateId}`;
	};

	payRoute = () => {
		const { countryCode, companyCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_INCORPORATIONS_ROOT_PATH}/pay/${companyCode}/${countryCode}/${templateId}`;
	};

	checkoutRoute = () => {
		const { countryCode, companyCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_INCORPORATIONS_ROOT_PATH}/checkout/${companyCode}/${countryCode}/${templateId}`;
	};

	cancelRoute = () => {
		const { countryCode, companyCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_INCORPORATIONS_ROOT_PATH}/details/${companyCode}/${countryCode}/${templateId}`;
	};

	listRoute = () => {
		return MARKETPLACE_INCORPORATIONS_ROOT_PATH;
	};

	rootPath = () => {
		return this.listRoute();
	};

	manageApplicationsRoute = () => {
		return `/main/selfkeyIdApplications`;
	};

	getApplicationStatus = () => {
		if (this.props.rp && this.props.rp.authenticated && this.userHasApplied()) {
			if (this.applicationCompleted()) return 'completed';
			if (this.applicationWasRejected()) return 'rejected';
			if (!this.userHasPaid()) return 'unpaid';
			if (this.applicationRequiresAdditionalDocuments()) return 'additionalRequirements';

			return 'progress';
		}
		return null;
	};

	loadIncorporations = async () => {
		if (!this.props.program) {
			await this.props.dispatch(incorporationsOperations.loadIncorporationsOperation());
		}
	};

	loadTreaties = async () => {
		const { treaties } = this.props;
		const { countryCode } = this.props.match.params;

		if (!treaties || !treaties.length) {
			this.props.dispatch(
				await incorporationsOperations.loadIncorporationsTaxTreatiesOperation(countryCode)
			);
		}
	};

	loadCountry = async () => {
		const { country } = this.props;
		const { countryCode } = this.props.match.params;

		if (!country) {
			this.props.dispatch(
				await incorporationsOperations.loadIncorporationsCountryOperation(countryCode)
			);
		}
	};
}

export { MarketplaceIncorporationsComponent };
