import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import _ from 'lodash';
import history from './history';
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
import marketplaces from '../marketplaces';
import kyc from '../kyc';
import identity from '../identity';
import createWallet from '../create-wallet';
import did from '../did';
import transactionHistory from '../transaction-history';
import app, { appTypes } from '../app';
import gas from '../gas';
import scheduler from '../scheduler';
import marketplace from '../marketplace';
import tokenSwap from '../token-swap';
import contracts from '../contract';
import walletConnect from '../wallet-connect';
import { moonPayAuth } from '../moonpay';
import hardwareWallet from '../hardware-wallet';
import navigationFlow from '../navigation/flow';

export const createReducers = (scope = 'main') => {
	let scopedReducers = {};
	if (scope === 'renderer') {
		let router = connectRouter(history.getHistory());
		scopedReducers = { router };
	}
	const combined = combineReducers({
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
		tokenSwap,
		contracts,
		walletConnect,
		moonPayAuth,
		hardwareWallet,
		navigationFlow,
		...scopedReducers
	});

	return (state, action) => {
		if (action.type === appTypes.APP_RESET) {
			state = _.pick(state, [
				'locale',
				'fiatCurrency',
				'prices',
				'ethGasStationInfo',
				'incorporations',
				'bankAccounts',
				'exchanges',
				'createWallet',
				'identity',
				'gas',
				'tokens',
				'scheduler',
				'contracts',
				'walletConnect',
				'router'
			]);
		}
		return combined(state, action);
	};
};
export default createReducers;
