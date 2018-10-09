/* istanbul ignore file */
import { asClass, asValue, asFunction, createContainer, InjectionMode } from 'awilix';

import PriceService from 'main/token/price-service';
import ExchangesService from 'main/exchanges/exchanges-service';
import IdAttributeTypeService from 'main/identity/id-attribute-type-service';
import TxHistoryService from 'main/blockchain/tx-history-service';
import Web3Service from 'main/blockchain/web3-service';
import { LWSService } from 'main/lws/lws-service';
import LedgerService from 'main/blockchain/leadger-service';
import { CrashReportService } from './logger/crash-report-service';
import TrezorService from 'main/blockchain/trezor-service';
import RpcHandler from 'main/rpc-handler';
import { StakingService } from 'main/blockchain/staking-service';
import EthGasStationService from 'main/blockchain/eth-gas-station-service';

let globalContext = null;

export const getGlobalContext = () => {
	return globalContext;
};

export const setGlobalContext = ctx => {
	globalContext = ctx;
};

export const configureContext = (store, app) => {
	const container = createContainer({
		injectionMode: InjectionMode.PROXY
	});
	container.register({
		app: asValue(app),
		store: asValue(store),
		web3Service: asClass(Web3Service).singleton(),
		ledgerService: asClass(LedgerService).singleton(),
		// TODO: refactor to not use static methods
		CrashReportService: asValue(CrashReportService),
		txHistoryService: asClass(TxHistoryService).singleton(),
		TxHistoryService: asValue(TxHistoryService),
		priceService: asClass(PriceService).singleton(),
		lwsService: asClass(LWSService).singleton(),
		idAttributeTypeService: asClass(IdAttributeTypeService).singleton(),
		exchangesService: asClass(ExchangesService).singleton(),
		ethGasStationService: asClass(EthGasStationService).singleton(),
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
