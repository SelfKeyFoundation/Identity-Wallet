/* istanbul ignore file */
import { asClass, asValue, asFunction, createContainer, InjectionMode } from 'awilix';

import PriceService from './token/price-service';
import ExchangesService from './exchanges/exchanges-service';
import IdAttributeTypeService from './identity/id-attribute-type-service';
import TxHistoryService from './blockchain/tx-history-service';
import Web3Service from './blockchain/web3-service';
import { LWSService } from './lws/lws-service';
import LedgerService from './blockchain/leadger-service';
import { CrashReportService } from '../common/logger/crash-report-service';
import TrezorService from './blockchain/trezor-service';
import RpcHandler from './rpc-handler';

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
		trezorService: asFunction(() => {
			let Service = TrezorService();
			return new Service();
		}).singleton(),
		rpcHandler: asFunction(cradle => {
			let Handler = RpcHandler(cradle);
			return new Handler();
		}).singleton()
	});
	return container;
};

export default configureContext;
