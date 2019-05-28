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
import { DIDService } from './blockchain/did-service';
import { AutoUpdateService } from './auto-update/auto-update-service';

export const registerMainServices = container => {
	container.register({
		app: asFunction(createApp).singleton(),
		networkService: asClass(NetworkService).singleton(),
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
		didService: asClass(DIDService).singleton(),
		autoUpdateService: asClass(AutoUpdateService).singleton()
	});
};
