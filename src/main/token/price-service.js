'use strict';
import EventEmitter from 'events';
import fetch from 'node-fetch';
import { Logger } from 'common/logger';
import io from 'socket.io-client';
import TokenPrice from './token-price';
import Token from './token';
import WalletToken from '../wallet/wallet-token';

const log = new Logger('PriceService');

// Update every 1 minutes
export const PRICE_UPDATE_INTERVAL = 60 * 1000;
export class PriceService extends EventEmitter {
	constructor() {
		super();
		this.socket = null;
		this.existing = {};
		this.updatedPrices = [];
		this.broadcastTimeout = null;
	}
	async loadPriceData() {
		log.debug('fetching price data');
		const response = await fetch('https://api.coincap.io/v2/assets?limit=2000');
		const json = await response.json();

		if (!json) {
			log.error('Unable to fetch price data');
			return;
		}

		let data = json.data;
		if (!data || !data.length) {
			log.error('Unable to fetch price data');
			return;
		}

		// FIXME: this doesn't look good
		// Remove the other KEY, this one shows up as well:
		// https://coinmarketcap.com/currencies/key/
		// this is the correct one:
		// https://coinmarketcap.com/currencies/selfkey/
		data = data.filter(token => token.id !== 'key');

		// KEY is mandatory, if doesn't get fetch in global list
		// it needs to get fetched individually
		if (!data.find(row => row.symbol === 'KEY')) {
			const responseKey = await fetch('https://api.coincap.io/v2/assets/selfkey');
			const jsonKey = await responseKey.json();
			if (!jsonKey) {
				log.error('Unable to fetch KEY price data');
				return;
			}

			const dataKey = jsonKey.data;
			if (!dataKey || !dataKey.length) {
				log.error('Unable to fetch KEY price data');
				return;
			}
			data.push(dataKey[0]);
		}

		// These should be the first two rows returned,
		// but we'll use "find" in case the order changes
		const btcPriceUsd = +data.find(row => row.symbol === 'BTC').priceUsd;
		const ethPriceUsd = +data.find(row => row.symbol === 'ETH').priceUsd;

		// TODO: We should filter out non-ERC-20/Ethereum
		// coins at some point, but that's low priority
		const dataToInsert = data.map(row => ({
			name: row.name,
			symbol: row.symbol,
			source: 'https://coincap.io',
			priceUSD: +row.priceUsd,
			priceBTC: +row.priceUsd / btcPriceUsd,
			priceETH: +row.priceUsd / ethPriceUsd
		}));

		this.existing = (await TokenPrice.findAll()).reduce(
			(lookup, row) =>
				Object.assign(lookup, {
					[row.symbol]: row
				}),
			{}
		);

		const updates = [];
		const inserts = [];

		dataToInsert.forEach(row => {
			if (this.existing[row.symbol]) {
				updates.push(Object.assign(row, { id: this.existing[row.symbol].id }));
				return;
			}

			inserts.push(row);
		});
		await TokenPrice.bulkAdd(inserts);
		await TokenPrice.bulkEdit(updates);

		this.emit('pricesUpdated', dataToInsert);
	}
	async startStream() {
		const socket = (this.socket = io('https://coincap.io'));

		socket.on('trades', async tradeMsg => {
			const tokenData = tradeMsg.message.msg;

			if (tokenData.short !== 'ETH') {
				const token = await Token.findBySymbol(tokenData.short);
				if (!token.length) {
					return;
				}
				const walletToken = await WalletToken.findByTokenId(token[0].id);
				if (!walletToken.length) {
					return;
				}
			}

			if (
				this.existing[tokenData.short] &&
				this.existing[tokenData.short].price !== tokenData.price
			) {
				const btcPriceUsd = await TokenPrice.findBySymbol('BTC');
				const ethPriceUsd = await TokenPrice.findBySymbol('ETC');

				const tokenData = tradeMsg.message.msg;

				const tokenPrice = {
					id: this.existing[tokenData.short].id,
					name: tokenData.long,
					symbol: tokenData.short,
					source: 'https://coincap.io',
					priceUSD: +tokenData.price,
					priceBTC: +tokenData.price / btcPriceUsd.price,
					priceETH: +tokenData.price / ethPriceUsd.price,
					updatedAt: Date.now()
				};
				await TokenPrice.bulkEdit([tokenPrice]);
				this.updatedPrices.push(await TokenPrice.findBySymbol(tokenPrice.symbol));
			}
		});
	}

	startPriceBroadcast() {
		if (this.broadcastTimeout) {
			clearTimeout(this.broadcastTimeout);
		}
		if (this.updatedPrices.length) {
			this.emit('pricesUpdated', this.updatedPrices);
			this.updatedPrices = [];
		}
		this.broadcastTimeout = setTimeout(() => this.startPriceBroadcast(), PRICE_UPDATE_INTERVAL);
	}

	async startUpdateData() {
		await this.loadPriceData();
		await this.startStream();
		this.startPriceBroadcast();
	}

	destroy() {
		if (!this.socket) return;
		this.socket.off();
		this.socket.disconnect();
		if (this.broadcastTimeout) {
			clearTimeout(this.broadcastTimeout);
		}
	}
}
export default PriceService;
