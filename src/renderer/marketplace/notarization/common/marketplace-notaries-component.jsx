import { MarketplaceComponent } from '../../common/marketplace-component';

const MARKETPLACE_NOTARIES_ROOT_PATH = `/main/marketplace/notaries`;

export default class MarketplaceNotariesComponent extends MarketplaceComponent {
	rootPath = () => MARKETPLACE_NOTARIES_ROOT_PATH;

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

export { MarketplaceNotariesComponent };
