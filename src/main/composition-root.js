import { asClass, asValue, asFunction, createContainer, InjectionMode } from 'awilix';

import PriceService from './token/price-service';
import ExchangesService from './exchanges/exchanges-service';
import IdAttributeTypeService from './identity/id-attribute-type-service';
import TxHistoryService from './blockchain/tx-history-service';
import Web3Service from './blockchain/web3-service';
import LedgerService from './blockchain/leadger-service';
import { CrashReportService } from '../common/logger/crash-report-service';
import TrezorService from './blockchain/trezor-service';
import RpcHandler from './rpc-handler';

export const configureContrainer = (store, app) => {
	const container = createContainer({
		injectionMode: InjectionMode.PROXY
	});
	container.register({
		app: asValue(app),
		store: asValue(store),
		web3Service: asClass(Web3Service).singleton(),
		ledgerService: asClass(LedgerService).singleton(),
		CrashReportService: asValue(CrashReportService),
		txHistoryService: asClass(TxHistoryService).singleton(),
		TxHistoryService: asValue(TxHistoryService),
		priceService: asClass(PriceService).singleton(),
		IdAttributeTypeService: asValue(IdAttributeTypeService),
		ExchangesService: asValue(ExchangesService),
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

export default configureContrainer;
