import { createStore, applyMiddleware, compose } from 'redux';
import locale from './locale';
import {
	forwardToMain,
	forwardToRenderer,
	triggerAlias,
	replayActionMain,
	replayActionRenderer
} from 'electron-redux';

export default (initialState, scope = 'main') => {
	let middleware = [];

	if (scope === 'renderer') {
		middleware = [forwardToMain];
	}

	if (scope === 'main') {
		middleware = [triggerAlias, forwardToRenderer];
	}

	const enhanced = [applyMiddleware(...middleware)];

	const rootReducer = locale;
	const enhancer = compose(...enhanced);
	const store = createStore(rootReducer, initialState, enhancer);

	if (scope === 'main') {
		replayActionMain(store);
	} else {
		replayActionRenderer(store);
	}

	return store;
};
