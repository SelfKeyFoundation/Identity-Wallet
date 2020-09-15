import { asClass, asValue, asFunction } from 'awilix';
import PriceService from './token/price-service';
import ExchangesService from './exchanges/exchanges-service';
import TxHistoryService from './blockchain/tx-history-service';
import Web3Service from './blockchain/web3-service';
import { LWSService } from './lws/lws-service';
import { CrashReportService } from '../common/logger/crash-report-service';
import RpcHandler from './rpc-handler';
import { StakingService } from './blockchain/staking-service';
import AddressBookService from './address-book/address-book-service';
import IdentityService from './identity/identity-service';
import MarketplaceService from './marketplace/marketplace-service';
import { createApp } from './app';
import WalletService from './wallet/wallet-service';
import TokenService from './token/token-service';
import WalletTokenService from './wallet/wallet-token-service';
import IncorporationsService from './marketplace/incorporations-service';
import BankAccountsService from './marketplace/bank-accounts-service';
import GuideSettingsService from './settings/guide-settings-service';
import CountryService from './country/country-service';
import NetworkService from './application/network-service';
import KycApplicationService from './kyc/kyc-application-service';
import { DIDService } from './blockchain/did-service';
import { AutoUpdateService } from './auto-update/auto-update-service';
import { SchedulerService } from './scheduler/scheduler-service';
import { VendorService } from './marketplace/vendors/vendor-service';
import { VendorSyncJobHandler } from './marketplace/vendors/vendor-sync-job-handler';
import { InventoryService } from './marketplace/inventory/inventory-service';
import { InventorySyncJobHandler } from './marketplace/inventory/inventory-sync-job-handler';
import { ListingExchangesSyncJobHandler } from './exchanges/listing-exchanges-sync-job-handler';
import { MarketplaceCountryService } from './marketplace/countries/marketplace-country-service';
import { MarketplaceCountrySyncJobHandler } from './marketplace/countries/marketplace-country-sync-job-handler';
import { TaxTreatiesService } from './marketplace/tax-treaties/tax-treaties-service';
import { TaxTreatiesSyncJobHandler } from './marketplace/tax-treaties/tax-treaties-sync-job-handler';
import { PaymentService } from './blockchain/payment-service';
import { SelfkeyService } from './blockchain/selfkey-service';
import { MarketplaceOrdersService } from './marketplace/orders/orders-service';
import { TotleSwapService } from './token-swap/totle-service';
import { CurrencyService } from './currency/currency-service';
import { MatomoService } from './matomo/matomo-service';
import { ContractService } from './blockchain/contracts/contract-service';
import ContractSyncJobHandler from './blockchain/contracts/contracts-sync-job-handler';

export const registerMainServices = container => {
	container.register({
		app: asFunction(createApp).singleton(),
		networkService: asClass(NetworkService).singleton(),
		schedulerService: asClass(SchedulerService).singleton(),
		vendorService: asClass(VendorService).singleton(),
		vendorSyncJobHandler: asClass(VendorSyncJobHandler).singleton(),
		inventoryService: asClass(InventoryService).singleton(),
		inventorySyncJobHandler: asClass(InventorySyncJobHandler).singleton(),
		marketplaceCountryService: asClass(MarketplaceCountryService).singleton(),
		marketplaceCountrySyncJobHandler: asClass(MarketplaceCountrySyncJobHandler).singleton(),
		taxTreatiesService: asClass(TaxTreatiesService).singleton(),
		taxTreatiesSyncJobHandler: asClass(TaxTreatiesSyncJobHandler).singleton(),
		listingExchangesSyncJobHandler: asClass(ListingExchangesSyncJobHandler).singleton(),
		web3Service: asClass(Web3Service).singleton(),
		walletService: asClass(WalletService).singleton(),
		addressBookService: asClass(AddressBookService).singleton(),
		// TODO: refactor to not use static methods
		CrashReportService: asValue(CrashReportService),
		txHistoryService: asClass(TxHistoryService).singleton(),
		TxHistoryService: asValue(TxHistoryService),
		priceService: asClass(PriceService).singleton(),
		lwsService: asClass(LWSService).singleton(),
		exchangesService: asClass(ExchangesService).singleton(),
		identityService: asClass(IdentityService).singleton(),
		marketplaceService: asClass(MarketplaceService).singleton(),
		paymentService: asClass(PaymentService).singleton(),
		selfkeyService: asClass(SelfkeyService).singleton(),
		rpcHandler: asFunction(cradle => {
			let Handler = RpcHandler(cradle);
			return new Handler();
		}).singleton(),
		stakingService: asClass(StakingService).singleton(),
		tokenService: asClass(TokenService).singleton(),
		walletTokenService: asClass(WalletTokenService).singleton(),
		incorporationsService: asClass(IncorporationsService).singleton(),
		bankAccountsService: asClass(BankAccountsService).singleton(),
		guideSettingsService: asClass(GuideSettingsService).singleton(),
		countryService: asClass(CountryService).singleton(),
		kycApplicationService: asClass(KycApplicationService).singleton(),
		didService: asClass(DIDService).singleton(),
		contractService: asClass(ContractService).singleton(),
		contractSyncJobHandler: asClass(ContractSyncJobHandler).singleton(),
		autoUpdateService: asClass(AutoUpdateService).singleton(),
		marketplaceOrdersService: asClass(MarketplaceOrdersService).singleton(),
		totleSwapService: asClass(TotleSwapService).singleton(),
		currencyService: asClass(CurrencyService).singleton(),
		matomoService: asClass(MatomoService).singleton()
	});
};
