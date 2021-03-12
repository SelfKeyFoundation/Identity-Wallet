import { MarketplaceComponent } from '../../common/marketplace-component';

const MARKETPLACE_PASSPORTS_ROOT_PATH = '/main/marketplace/passports';

export default class MarketplacePassportsComponent extends MarketplaceComponent {
	processStartedRoute = () => {
		const { programCode, countryCode, templateId, vendorId } = this.props.match.params;
		return `${MARKETPLACE_PASSPORTS_ROOT_PATH}/process-started/${programCode}/${countryCode}/${templateId}/${vendorId}`;
	};

	selectBankRoute = () => {
		const { countryCode, programCode, templateId, vendorId } = this.props.match.params;
		return `${MARKETPLACE_PASSPORTS_ROOT_PATH}/select-bank/${programCode}/${countryCode}/${templateId}/${vendorId}`;
	};

	paymentCompleteRoute = () => {
		const { countryCode, programCode, templateId, vendorId } = this.props.match.params;
		return `${MARKETPLACE_PASSPORTS_ROOT_PATH}/payment-complete/${programCode}/${countryCode}/${templateId}/${vendorId}`;
	};

	payRoute = () => {
		const { countryCode, programCode, templateId, vendorId } = this.props.match.params;
		return `${MARKETPLACE_PASSPORTS_ROOT_PATH}/pay/${programCode}/${countryCode}/${templateId}/${vendorId}`;
	};

	checkoutRoute = () => {
		const { countryCode, programCode, templateId, vendorId } = this.props.match.params;
		return `${MARKETPLACE_PASSPORTS_ROOT_PATH}/checkout/${programCode}/${countryCode}/${templateId}/${vendorId}`;
	};

	cancelRoute = () => {
		const { countryCode, programCode, templateId, vendorId } = this.props.match.params;
		return this.detailsRoute({ countryCode, programCode, templateId, vendorId });
	};

	detailsRoute = ({ programCode, countryCode, templateId, vendorId }) =>
		`${MARKETPLACE_PASSPORTS_ROOT_PATH}/details/${programCode}/${countryCode}/${templateId}/${vendorId}`;

	listRoute = () => MARKETPLACE_PASSPORTS_ROOT_PATH;

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
}

export { MarketplacePassportsComponent };
