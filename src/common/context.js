import { asClass, asValue, asFunction, createContainer, InjectionMode } from 'awilix';
import EthGasStationService from '../main/blockchain/eth-gas-station-service';
import configureStore from './store/configure-store';
import config from './config';

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
		ethGasStationService: asClass(EthGasStationService).singleton(),
		config: asValue(config)
	});
	return container;
};

export const configureContext = thread => {
	const container = createContainer({
		injectionMode: InjectionMode.PROXY
	});

	registerCommonServices(container, thread);

	if (thread === 'main') {
		require('../main/context').registerMainServices(container);
	}
	if (thread === 'renderer') {
		require('../renderer/context').registerRendererServices(container);
	}

	return container;
};

export default configureContext;
