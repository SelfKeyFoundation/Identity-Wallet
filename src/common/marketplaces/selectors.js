import _ from 'lodash';
import BN from 'bignumber.js';
import { exchangesSelectors } from '../exchanges';
import { ethGasStationInfoSelectors } from '../eth-gas-station';
import { fiatCurrencySelectors } from '../fiatCurrency';
import { pricesSelectors } from '../prices';

export const marketplacesSelectors = {
	marketplacesSelector(state) {
		return state.marketplaces;
	},
	servicesSelector(state) {
		let exchanges = exchangesSelectors.getExchanges(state);
		if (!exchanges) return null;
		let services = [];
		let servicesById = {};
		let data = exchanges.reduce(
			(acc, curr) => {
				let id = `${curr.serviceOwner}_${curr.serviceId}`;
				if (id in servicesById) return acc;
				let service = _.pick(curr, 'serviceOwner', 'serviceId', 'amount', 'lockPeriod');
				service.id = id;
				acc.services.push(service);
				acc.servicesById[id] = service;
				return acc;
			},
			{ services, servicesById }
		);
		return data.services;
	},
	stakeSelector(state, id) {
		return this.marketplacesSelector(state).stakesById[id];
	},
	transactionsSelector(state) {
		let { transactions, transactionsById } = this.marketplacesSelector(state);
		return transactions.map(id => transactionsById[id]);
	},
	pendingTransactionSelector(state, serviceOwner, serviceId) {
		let pendingTxs = this.transactionsSelector(state).filter(
			tx =>
				(tx.serviceOwner || tx.serviceAddress) === serviceOwner &&
				tx.serviceId === serviceId &&
				['pending', 'processing'].includes(tx.lastStatus)
		);
		return pendingTxs.length ? pendingTxs[0] : null;
	},
	currentTransactionSelector(state) {
		let gasPriceEstimates = ethGasStationInfoSelectors.getEthGasStationInfoWEI(state);
		let fiat = fiatCurrencySelectors.getFiatCurrency(state);
		let fiatRate = pricesSelectors.getRate(state, 'ETH', fiat.fiatCurrency);
		let tx = this.marketplacesSelector(state).currentTransaction;
		if (!tx)
			tx = {
				action: 'none',
				gasLimit: 0,
				gasPrice: gasPriceEstimates.medium
			};
		let fee = new BN(tx.gasPrice || 0).multipliedBy(tx.gasLimit || 0).toString();
		let feeFiat = new BN(fee).multipliedBy(fiatRate).toString();
		return { ...tx, gasPriceEstimates, fiat, fiatRate, fee, feeFiat };
	},
	displayedPopupSelector(state) {
		return this.marketplacesSelector(state).displayedPopup;
	},
	categoriesSelectors(state, entityType = 'individual') {
		let { categories, categoriesById } = this.marketplacesSelector(state);
		return categories
			.map(id => categoriesById[id])
			.filter(category => category.entityType === entityType);
	},
	categorySelector(state, id) {
		return this.marketplacesSelector(state).categoriesById[id];
	}
};

export default marketplacesSelectors;
