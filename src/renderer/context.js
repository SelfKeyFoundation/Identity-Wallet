import { asValue, asClass } from 'awilix';
import history from 'common/store/history';
import { MatomoService } from 'renderer/matomo/matomo-service';

export const registerRendererServices = (container, options = {}) => {
	container.register({
		history: asValue(history),
		matomoService: asClass(MatomoService)
	});
	container.resolve('matomoService');
	return container;
};
