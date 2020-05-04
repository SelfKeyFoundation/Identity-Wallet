import { MarketplaceComponent } from '../../common/marketplace-component';

const MARKETPLACE_LOANS_ROOT_PATH = '/main/marketplace/loans';

export default class MarketplaceLoansComponent extends MarketplaceComponent {
	rootPath = () => MARKETPLACE_LOANS_ROOT_PATH;
	listRoute = () => MARKETPLACE_LOANS_ROOT_PATH;
	detailsRoute = vendorId => `${MARKETPLACE_LOANS_ROOT_PATH}/details/${vendorId}`;

	filterLoanType = (inventory, type) =>
		inventory
			.filter(offer => offer.data.loanType.includes(type))
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
}

export { MarketplaceLoansComponent };
