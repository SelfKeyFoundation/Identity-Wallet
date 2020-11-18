import { PureComponent } from 'react';
import {
	APPLICATION_REJECTED,
	APPLICATION_CANCELLED,
	APPLICATION_APPROVED,
	APPLICATION_ANSWER_REQUIRED
} from 'common/kyc/status_codes';
import { kycOperations } from 'common/kyc';
import { getGlobalContext } from 'common/context';

class MarketplaceComponent extends PureComponent {
	marketplaceRootPath = () => `/main/marketplace`;

	selfKeyIdRoute = () => `/main/individual`;

	selfkeyIdRequiredRoute = () => `/main/marketplace/selfkey-id-required`;

	selfkeyDIDRequiredRoute = () => `/main/marketplace/selfkey-did-required`;

	manageApplicationsRoute = () => `/main/individual/dashboard/applications`;

	noKeyErrorRoute = keyPrice => `/main/transaction-no-key-error/${keyPrice}`;

	loadRelyingParty = async ({
		rp,
		authenticated = false,
		nextRoute,
		cancelRoute,
		background = false
	}) => {
		if (this.props.rpShouldUpdate) {
			await this.props.dispatch(
				kycOperations.loadRelyingParty(
					rp,
					authenticated,
					nextRoute,
					cancelRoute,
					background
				)
			);
		}
	};

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
			if (this.applicationRequiresAdditionalDocuments()) return 'additionalRequirements';

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
		return (
			application.currentStatus === APPLICATION_REJECTED ||
			application.currentStatus === APPLICATION_CANCELLED
		);
	};

	applicationCompleted = () => {
		const application = this.getLastApplication();
		if (!application) {
			return false;
		}
		return application.currentStatus === APPLICATION_APPROVED;
	};

	applicationRequiresAdditionalDocuments = () => {
		const application = this.getLastApplication();
		if (!application) {
			return false;
		}
		return application.currentStatus === APPLICATION_ANSWER_REQUIRED;
	};

	// Can only apply if:
	// - store data has loaded (isLoading prop)
	// - there is a valid price for this product (from airtable)
	// - KYCC templateId exists for this product (from airtable)
	// - user has not applied before or previous application was rejected
	// This probably needs some rethinking, some products might not need KYC
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

	// Redirects to KYCC passing a jwt token for auto-login
	redirectToKYCC = rp => {
		const application = this.getLastApplication();
		const instanceUrl = rp.session.ctx.config.rootEndpoint;

		const url = `${instanceUrl}/applications/${application.id}?access_token=${
			rp.session.access_token.jwt
		}`;
		window.openExternal(null, url);
	};

	trackEcommerceTransaction = ({
		transactionHash,
		code,
		jurisdiction,
		rpName,
		price,
		quantity = 1
	}) => {
		const matomoService = getGlobalContext().matomoService;
		matomoService.push(['addEcommerceItem', code, jurisdiction, rpName, price, quantity]);
		matomoService.push(['trackEcommerceOrder', transactionHash, price]);
	};

	trackMatomoGoal = (individualGoalName, corporateGoalName) => {
		if (!this.props.identity) return;
		let goal =
			this.props.identity.type === 'corporate' ? corporateGoalName : individualGoalName;
		const { matomoService } = getGlobalContext();
		if (!matomoService.goals[goal]) return;
		matomoService.trackGoal(matomoService.goals[goal]);
	};

	trackMarketplaceVisit = marketplaceName => {
		if (!this.props.identity) return;
		let prefix = this.props.identity.type;
		const { matomoService } = getGlobalContext();
		matomoService.trackEvent('marketplace', 'visit', `${prefix}_${marketplaceName}`);
	};

	clearRelyingParty = async () => {
		await this.props.dispatch(kycOperations.clearRelyingPartyOperation());
	};
}

export { MarketplaceComponent };
export default MarketplaceComponent;
