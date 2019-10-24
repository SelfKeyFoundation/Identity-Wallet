import { MarketplaceComponent } from '../../common/marketplace-component';

export default class MarketplaceNotariesComponent extends MarketplaceComponent {
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
