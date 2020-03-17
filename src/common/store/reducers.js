import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
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
import app from '../app';
import gas from '../gas';
import scheduler from '../scheduler';
import marketplace from '../marketplace';
import tokenSwap from '../token-swap';

export const createReducers = (scope = 'main') => {
	let scopedReducers = {};
	if (scope === 'renderer') {
		let router = connectRouter(history.getHistory());
		scopedReducers = { router };
	}
	return combineReducers({
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
		...scopedReducers
	});
};
export default createReducers;
