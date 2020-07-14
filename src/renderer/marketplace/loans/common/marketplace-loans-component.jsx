import { PureComponent } from 'react';
import { getGlobalContext } from 'common/context';

const MARKETPLACE_LOANS_ROOT_PATH = '/main/marketplace/loans';

export default class MarketplaceLoansComponent extends PureComponent {
	marketplaceRootPath = () => `/main/marketplace`;
	rootPath = () => MARKETPLACE_LOANS_ROOT_PATH;
	listRoute = () => MARKETPLACE_LOANS_ROOT_PATH;
	detailsRoute = vendorId => `${MARKETPLACE_LOANS_ROOT_PATH}/details/${vendorId}`;

	inventoryUniqueTokens = inventory => {
		const tokens = inventory.reduce((acc, offer) => {
			const { assets } = offer.data;
			assets.forEach(t => acc.add(t));
			return acc;
		}, new Set());

		return [...tokens];
	};

	filterLoanType = (inventory, type) =>
		inventory
			.filter(offer => offer.data.loanType && offer.data.loanType.includes(type))
			.map(offer => {
				offer.data.interestRate =
					type === 'lending'
						? offer.data.interestRateLending
						: offer.data.interestRateBorrowing;
				offer.data.maxLoan =
					type === 'lending' ? offer.data.maxLoanLending : offer.data.maxLoanBorrowing;
				offer.data.minLoan =
					type === 'lending' ? offer.data.minLoanLending : offer.data.minLoanBorrowing;
				offer.data.maxLoanTerm =
					type === 'lending'
						? offer.data.maxLoanTermLending
						: offer.data.maxLoanTermBorrowing;
				return offer;
			});
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
}

export { MarketplaceLoansComponent };
