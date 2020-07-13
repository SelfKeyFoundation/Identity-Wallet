import { asClass, asValue, asFunction, createContainer, InjectionMode } from 'awilix';
import EthGasStationService from '../main/blockchain/eth-gas-station-service';
import configureStore from './store/configure-store';
import config from './config';
import { matomoGoals } from './matomo/matomo-goals';

let globalContext = null;

export const setGlobalContext = ctx => {
	globalContext = ctx;
};
export const getGlobalContext = () => globalContext;

export const registerCommonServices = (container, thread, options) => {
	container.register({
		initialState: asValue(global.state),
		threadName: asValue(thread),
		store: options.store
			? options.store
			: asFunction(({ initialState, threadName }) =>
					configureStore(initialState, threadName)
			  ).singleton(),
		ethGasStationService: asClass(EthGasStationService).singleton(),
		config: asValue(config),
		matomoGoals: asValue(matomoGoals)
	});
	return container;
};

export const configureContext = (thread, options = {}) => {
	const container = createContainer({
		injectionMode: InjectionMode.PROXY
	});

	registerCommonServices(container, thread, options);

	if (thread === 'main') {
		require('../main/context').registerMainServices(container, options);
	}
	if (thread === 'renderer') {
		require('../renderer/context').registerRendererServices(container, options);
	}

	return container;
};

export default configureContext;
