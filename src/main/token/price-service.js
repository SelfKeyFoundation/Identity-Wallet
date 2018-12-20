'use strict';
import EventEmitter from 'events';
import fetch from 'node-fetch';
import { Logger } from 'common/logger';
import io from 'socket.io-client';
import TokenPrice from './token-price';
import Token from './token';
import WalletToken from '../wallet/wallet-token';

const log = new Logger('PriceService');

// Update every 10 minutes
export const PRICE_UPDATE_INTERVAL = 10 * 60 * 60 * 1000;
export class PriceService extends EventEmitter {
	constructor() {
		super();
		this.socket = null;
		this.existing = {};
	}
	async loadPriceData() {
		log.info('fetching price data');
		const response = await fetch('https://coincap.io/front');
		const data = await response.json();

		if (!data.length) {
			return;
		}

		// These should be the first two rows returned,
		// but we'll use "find" in case the order changes
		const btcPriceUsd = +data.find(row => row.short === 'BTC').price;
		const ethPriceUsd = +data.find(row => row.short === 'ETH').price;

		// TODO: We should filter out non-ERC-20/Ethereum
		// coins at some point, but that's low priority
		const dataToInsert = data.map(row => ({
			name: row.long,
			symbol: row.short,
			source: 'https://coincap.io',
			priceUSD: +row.price,
			priceBTC: +row.price / btcPriceUsd,
			priceETH: +row.price / ethPriceUsd
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

				this.emit('pricesUpdated', [await TokenPrice.findBySymbol(tokenPrice.symbol)]);
			}
		});
	}

	async startUpdateData() {
		await this.loadPriceData();
		await this.startStream();
	}

	destroy() {
		if (!this.socket) return;
		this.socket.off();
		this.socket.disconnect();
	}
}
export default PriceService;
