import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import locale from './locale';
import fiatCurrency from './fiatCurrency';
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

	const rootReducer = combineReducers({ locale, fiatCurrency });
	const enhancer = compose(...enhanced);
	const store = createStore(rootReducer, initialState, enhancer);

	if (scope === 'main') {
		replayActionMain(store);
	} else {
		replayActionRenderer(store);
	}

	return store;
};
