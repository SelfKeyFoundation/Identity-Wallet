import { Component } from 'react';

class MarketplaceComponent extends Component {
	getLastApplication = () => {
		const { rp } = this.props;
		const { templateId } = this.props.match.params;

		if (!rp || !rp.authenticated) return false;
		const { applications } = this.props.rp;
		if (!applications || applications.length === 0) return false;

		applications.sort((a, b) => {
			const aDate = new Date(a.createdAt);
			const bDate = new Date(b.createdAt);
			return aDate > bDate ? 1 : -1;
		});

		let application;
		let index = applications.length - 1;
		for (; index >= 0; index--) {
			if (applications[index].template === templateId) {
				application = applications[index];
				break;
			}
		}
		return application;
	};

	getApplicationStatus = () => {
		if (this.props.rp && this.props.rp.authenticated && this.userHasApplied()) {
			if (this.applicationCompleted()) return 'completed';
			if (this.applicationWasRejected()) return 'rejected';
			if (!this.userHasPaid()) return 'unpaid';
			if (this.applicationRequiresAdditionalDocuments()) return 'progress';

			return 'progress';
		}
		return null;
	};

	userHasApplied = () => {
		const application = this.getLastApplication();
		return !!application;
	};

	userHasPaid = () => {
		const application = this.getLastApplication();
		if (!application || !application.payments) {
			return false;
		}
		return !!application.payments.length;
	};

	applicationWasRejected = () => {
		const application = this.getLastApplication();
		if (!application) {
			return false;
		}
		// Process is cancelled or Process is rejected
		return application.currentStatus === 3 || application.currentStatus === 8;
	};

	applicationCompleted = () => {
		const application = this.getLastApplication();
		if (!application) {
			return false;
		}
		return application.currentStatus === 2;
	};

	applicationRequiresAdditionalDocuments = () => {
		const application = this.getLastApplication();
		if (!application) {
			return false;
		}
		return application.currentStatus === 9;
	};

	// Can only apply if:
	// - store data has loaded (isLoading prop)
	// - there is a valid price for this jurisdiction (from airtable)
	// - templateId exists for this jurisdiction (from airtable)
	// - user has not applied before or previous application was rejected
	canApply = price => {
		const { templateId } = this.props.match.params;

		if (this.props.rp && this.props.rp.authenticated) {
			return !!(
				templateId &&
				price &&
				(!this.userHasApplied() || this.applicationWasRejected())
			);
		} else {
			return !!(templateId && price);
		}
	};
}

export { MarketplaceComponent };
