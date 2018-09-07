/* istanbul ignore file */
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import locale from '../locale';
import fiatCurrency from '../fiatCurrency';
import wallet from '../wallet';
import prices from '../prices';
import walletTokens from '../wallet-tokens';
import viewAll from '../view-all-tokens';
import ethGasStationInfo from '../eth-gas-station';

import {
	forwardToMain,
	forwardToRenderer,
	triggerAlias,
	replayActionMain,
	replayActionRenderer
} from 'electron-redux';

export default (initialState, scope = 'main') => {
	let middleware = [thunk, promise];

	if (scope === 'renderer') {
		middleware = [forwardToMain, ...middleware];
	}

	if (scope === 'main') {
		middleware = [triggerAlias, ...middleware, forwardToRenderer];
	}

	const enhanced = [applyMiddleware(...middleware)];

	const rootReducer = combineReducers({
		locale,
		fiatCurrency,
		wallet,
		walletTokens,
		viewAll,
		prices,
		ethGasStationInfo
	});
	const enhancer = compose(...enhanced);
	const store = createStore(rootReducer, initialState, enhancer);

	if (scope === 'main') {
		replayActionMain(store);
	} else {
		replayActionRenderer(store);
	}

	return store;
};
