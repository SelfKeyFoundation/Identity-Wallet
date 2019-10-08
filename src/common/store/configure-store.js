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
import tokens from '../tokens';
import ethGasStationInfo from '../eth-gas-station';
import transaction from '../transaction';
import addressBook from '../address-book';
import incorporations from '../incorporations';
import bankAccounts from '../bank-accounts';
import exchanges from '../exchanges';
import { createLogger } from 'redux-logger';
import marketplaces from '../marketplaces';
import kyc from '../kyc';
import identity from '../identity';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import history from './history';
import createWallet from '../create-wallet';
import did from '../did';
import transactionHistory from '../transaction-history';
import app from '../app';
import gas from '../gas';
import scheduler from '../scheduler';
import marketplace from '../marketplace';
// eslint-disable-next-line
import { closeOperations } from '../close';

import {
	forwardToMain,
	forwardToRenderer,
	triggerAlias,
	replayActionMain,
	replayActionRenderer
} from 'electron-redux';

export default (initialState, scope = 'main') => {
	let middleware = [thunk, promise];
	let scopedReducers = {};
	if (scope === 'renderer') {
		if (process.env.ENABLE_REDUX_LOGGER) {
			const logger = createLogger({ collapsed: (getState, actions) => true });
			middleware.push(logger);
		}
		middleware = [forwardToMain, ...middleware];

		history.create();
		let router = connectRouter(history.getHistory());

		middleware = [forwardToMain, ...middleware, routerMiddleware(history.getHistory())];
		scopedReducers = {
			router
		};
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
		ethGasStationInfo,
		transaction,
		addressBook,
		incorporations,
		bankAccounts,
		exchanges,
		marketplaces,
		marketplace,
		identity,
		createWallet,
		transactionHistory,
		app,
		gas,
		kyc,
		tokens,
		scheduler,
		did,
		...scopedReducers
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
