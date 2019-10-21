import { MarketplaceComponent } from '../../common/marketplace-component';

const MARKETPLACE_EXCHANGES_ROOT_PATH = '/main/marketplace-exchanges';

export default class MarketplaceExchangesComponent extends MarketplaceComponent {
	detailsRoute = vendorId => `${MARKETPLACE_EXCHANGES_ROOT_PATH}/details/${vendorId}`;

	rootPath = () => MARKETPLACE_EXCHANGES_ROOT_PATH;

	manageApplicationsRoute = () => `/main/selfkeyIdApplications`;
}

export { MarketplaceExchangesComponent };
