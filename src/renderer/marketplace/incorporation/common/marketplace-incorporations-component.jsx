import { MarketplaceComponent } from '../../common/marketplace-component';

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
		const { companyCode, countryCode, templateId } = this.props.match.params;
		return this.detailsRoute({ companyCode, countryCode, templateId });
	};

	detailsRoute = ({ companyCode, countryCode, templateId }) =>
		`${MARKETPLACE_INCORPORATIONS_ROOT_PATH}/details/${companyCode}/${countryCode}/${templateId}`;

	listRoute = () => MARKETPLACE_INCORPORATIONS_ROOT_PATH;

	rootPath = () => this.listRoute();

	manageApplicationsRoute = () => `/main/selfkeyIdApplications`;

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
}

export { MarketplaceIncorporationsComponent };
