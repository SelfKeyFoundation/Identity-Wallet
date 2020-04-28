import { MarketplaceComponent } from '../../common/marketplace-component';

const MARKETPLACE_LOANS_ROOT_PATH = '/main/marketplace/loans';

export default class MarketplaceLoansComponent extends MarketplaceComponent {
	rootPath = () => MARKETPLACE_LOANS_ROOT_PATH;
	listRoute = () => MARKETPLACE_LOANS_ROOT_PATH;
	detailsRoute = vendorId => `${MARKETPLACE_LOANS_ROOT_PATH}/details/${vendorId}`;
}

export { MarketplaceLoansComponent };
