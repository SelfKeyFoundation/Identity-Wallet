import { asClass, asValue, asFunction, createContainer, InjectionMode } from 'awilix';

import PriceService from 'main/token/price-service';
import ExchangesService from 'main/exchanges/exchanges-service';
import TxHistoryService from 'main/blockchain/tx-history-service';
import Web3Service from 'main/blockchain/web3-service';
import { LWSService } from 'main/lws/lws-service';
import LedgerService from 'main/blockchain/leadger-service';
import { CrashReportService } from './logger/crash-report-service';
import TrezorService from 'main/blockchain/trezor-service';
import RpcHandler from 'main/rpc-handler';
import { StakingService } from 'main/blockchain/staking-service';
import EthGasStationService from 'main/blockchain/eth-gas-station-service';
import AddressBookService from 'main/address-book/address-book-service';
import IdentityService from 'main/identity/identity-service';

let globalContext = null;

export const setGlobalContext = ctx => {
	globalContext = ctx;
};
export const getGlobalContext = () => globalContext;

export const registerCommonServices = (container, thread) => {
	container.register({
		initialState: asValue(global.state),
		threadName: asValue(thread),
		store: asFunction(({ initialState, threadName }) =>
			configureStore(initialState, threadName)
		).singleton(),
		ethGasStationService: asClass(EthGasStationService).singleton()
	});
	container.register({
		app: asValue(app),
		store: asValue(store),
		web3Service: asClass(Web3Service).singleton(),
		ledgerService: asClass(LedgerService).singleton(),
		addressBookService: asClass(AddressBookService).singleton(),
		// TODO: refactor to not use static methods
		CrashReportService: asValue(CrashReportService),
		txHistoryService: asClass(TxHistoryService).singleton(),
		TxHistoryService: asValue(TxHistoryService),
		priceService: asClass(PriceService).singleton(),
		lwsService: asClass(LWSService).singleton(),
		exchangesService: asClass(ExchangesService).singleton(),
		ethGasStationService: asClass(EthGasStationService).singleton(),
		IdentityService: asClass(IdentityService).singleton(),
		trezorService: asFunction(() => {
			let Service = TrezorService();
			return new Service();
		}).singleton(),
		rpcHandler: asFunction(cradle => {
			let Handler = RpcHandler(cradle);
			return new Handler();
		}).singleton(),
		stakingService: asClass(StakingService).singleton()
	});
	return container;
};

export default configureContext;
