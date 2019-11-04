import { MarketplaceComponent } from '../../common/marketplace-component';

const MARKETPLACE_NOTARIES_ROOT_PATH = `/main/marketplace/notaries`;

export default class MarketplaceNotariesComponent extends MarketplaceComponent {
	rootPath = () => MARKETPLACE_NOTARIES_ROOT_PATH;
	processPath = () => `${MARKETPLACE_NOTARIES_ROOT_PATH}/process`;
	tocPath = () => `${MARKETPLACE_NOTARIES_ROOT_PATH}/toc`;
	tocDisagreementPath = () => `${MARKETPLACE_NOTARIES_ROOT_PATH}/tocDisagreement`;
	paymentPath = () => `${MARKETPLACE_NOTARIES_ROOT_PATH}/pay`;

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
