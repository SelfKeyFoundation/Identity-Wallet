import { MarketplaceComponent } from '../../common/marketplace-component';

const MARKETPLACE_KEYFI_ROOT_PATH = `/main/marketplace/keyfi`;

export default class MarketplaceKeyFiComponent extends MarketplaceComponent {
	rootPath = () => MARKETPLACE_KEYFI_ROOT_PATH;

	productRoute = () => {
		const { templateId, vendorId, productId } = this.props;
		return `${MARKETPLACE_KEYFI_ROOT_PATH}/detail/${templateId}/${vendorId}/${productId}`;
	};

	checkoutRoute = () => {
		const { templateId, vendorId, productId } = this.props;
		return `${MARKETPLACE_KEYFI_ROOT_PATH}/checkout/${templateId}/${vendorId}/${productId}`;
	};

	cancelRoute = () => `/main/marketplace/`;

	paymentCompleteRoute = () => {
		const { templateId, vendorId, productId } = this.props.match.params;
		return `${MARKETPLACE_KEYFI_ROOT_PATH}/payment-complete/${templateId}/${vendorId}/${productId}`;
	};

	payRoute = (cryptoCurrency = 'KEY') => {
		const { templateId, vendorId, productId } = this.props.match.params;
		return `${MARKETPLACE_KEYFI_ROOT_PATH}/pay/${templateId}/${vendorId}/${productId}/${cryptoCurrency}`;
	};

	getApplicationStatus = () => {
		const { rp, product } = this.props;
		if (rp && rp.authenticated && this.userHasApplied()) {
			if (this.applicationCompleted()) return 'completed';
			if (this.applicationWasRejected()) return 'rejected';
			if (!this.userHasPaid() && product && product.price > 0) return 'unpaid';
			if (this.applicationRequiresAdditionalDocuments()) return 'additionalRequirements';

			return 'progress';
		}
		return null;
	};
}

export { MarketplaceKeyFiComponent };
