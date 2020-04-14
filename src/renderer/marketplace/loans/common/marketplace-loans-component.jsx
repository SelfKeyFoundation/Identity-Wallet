import { MarketplaceComponent } from '../../common/marketplace-component';

const MARKETPLACE_LOANS_ROOT_PATH = '/main/marketplace/loans';

export default class MarketplaceLoansComponent extends MarketplaceComponent {
	listRoute = () => MARKETPLACE_LOANS_ROOT_PATH;
}

export { MarketplaceLoansComponent };
