import { MarketplaceComponent } from '../../common/marketplace-component';

const MARKETPLACE_NOTARIES_ROOT_PATH = `/main/marketplace/notaries`;

export default class MarketplaceNotariesComponent extends MarketplaceComponent {
	rootPath = () => MARKETPLACE_NOTARIES_ROOT_PATH;
	productRoute = () => {
		const { templateId, vendorId, productId } = this.props;
		return `${MARKETPLACE_NOTARIES_ROOT_PATH}/detail/${templateId}/${vendorId}/${productId}`;
	};
	processPath = () => {
		const { templateId, vendorId, productId } = this.props;
		return `${MARKETPLACE_NOTARIES_ROOT_PATH}/process/${templateId}/${vendorId}/${productId}`;
	};
	requestNotarizationRoute = () => this.processPath();
	checkoutRoute = () => this.processPath();

	payRoute = documentList => {
		const { templateId, vendorId, productId } = this.props;
		return `${MARKETPLACE_NOTARIES_ROOT_PATH}/pay/${templateId}/${vendorId}/${productId}/${documentList}`;
	};
	cancelRoute = () => `${MARKETPLACE_NOTARIES_ROOT_PATH}`;
	paymentCompleteRoute = () => {
		const { templateId, vendorId, productId } = this.props;
		return `${MARKETPLACE_NOTARIES_ROOT_PATH}/payment-complete/${templateId}/${vendorId}/${productId}`;
	};
	tocRoute = () => {
		const { templateId, vendorId, productId } = this.props;
		return `${MARKETPLACE_NOTARIES_ROOT_PATH}/toc/${templateId}/${vendorId}/${productId}`;
	};
	tocDisagreementRoute = () => `${MARKETPLACE_NOTARIES_ROOT_PATH}/toc-disagreement`;

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
