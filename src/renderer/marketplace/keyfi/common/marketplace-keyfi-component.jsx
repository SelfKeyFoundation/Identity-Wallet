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

	userHasPaid = () => {
		const { product } = this.props;
		if (product && +product.price === 0) {
			return 1;
		}
		const application = this.getLastApplication();
		if (!application || !application.payments) {
			return false;
		}
		return !!application.payments.length;
	};

	getApplicationStatus = () => {
		const { rp } = this.props;
		if (rp && rp.authenticated && this.userHasApplied()) {
			if (this.applicationCompleted()) return 'completed';
			if (this.applicationWasRejected()) return 'rejected';
			if (!this.userHasPaid()) return 'unpaid';
			if (this.applicationRequiresAdditionalDocuments()) return 'additionalRequirements';

			return 'progress';
		}
		return null;
	};
}

export { MarketplaceKeyFiComponent };
