import _ from 'lodash';
import BN from 'bignumber.js';
import { exchangesSelectors } from '../exchanges';
import { ethGasStationInfoSelectors } from '../eth-gas-station';
import { fiatCurrencySelectors } from '../fiatCurrency';
import { pricesSelectors } from '../prices';
import { identitySelectors } from '../identity';
import * as serviceSelectors from '../exchanges/selectors';

export const RP_UPDATE_INTERVAL = 1000 * 60 * 60 * 3; // 3h

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
		let fiatRate = pricesSelectors.getRate(state, 'ETH', fiat);
		let tx = this.marketplacesSelector(state).currentTransaction;
		if (!tx) tx = { action: 'none', gasLimit: 0, gasPrice: gasPriceEstimates.average };
		let fee = new BN(tx.gasPrice || 0).multipliedBy(tx.gasLimit || 0).toString();
		let feeFiat = new BN(fee).multipliedBy(fiatRate).toString();
		return { ...tx, gasPriceEstimates, fiat, fiatRate, fee, feeFiat };
	},
	displayedPopupSelector(state) {
		return this.marketplacesSelector(state).displayedPopup;
	},
	categoriesSelectors(state) {
		let { categories, categoriesById } = this.marketplacesSelector(state);
		return categories.map(id => categoriesById[id]);
	},
	categorySelector(state, id) {
		return this.marketplacesSelector(state).categoriesById[id];
	},
	relyingPartySelector(state, rpName) {
		return this.marketplacesSelector(state).relyingPartiesByName[rpName];
	},
	relyingPartyIsActiveSelector(state, rpName) {
		const rp = this.relyingPartySelector(state, rpName);
		if (rp && !rp.disabled) {
			return true;
		}
		const service = serviceSelectors.getServiceDetails(state, rpName);
		const config = service.relying_party_config;

		return service.status === 'Active' && config;
	},
	relyingPartyShouldUpdateSelector(state, rpName) {
		if (!this.relyingPartyIsActiveSelector(state, rpName)) return false;
		const rp = this.relyingPartySelector(state, rpName);
		if (!rp) return true;
		if (Date.now() - rp.lastUpdated > RP_UPDATE_INTERVAL) return true;
		if (!rp.session || !rp.session.ctx || !rp.session.ctx.token) return true;
		if (rp.session.ctx.token.data.exp > Date.now()) return true;

		return false;
	},
	selectKYCAttributes(state, walletId, attributeIds) {
		return identitySelectors
			.selectFullIdAttributesByIds(state, walletId, attributeIds)
			.map(attr => ({
				id: attr.type.url,
				schema: attr.type.schema,
				value: attr.data,
				documents: attr.documents
			}));
	}
};

export default marketplacesSelectors;
