import { asValue } from 'awilix';
import history from 'common/store/history';

export const registerRendererServices = (container, options = {}) => {
	container.register({
		history: asValue(history)
	});
	return container;
};
