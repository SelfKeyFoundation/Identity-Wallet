'use strict';

const EventEmitter = require('events');
const fetch = require('node-fetch');

const TokenPrice = require('../models/token-price');
const io = require('socket.io-client');

const emitter = new EventEmitter();

let existing = [];

const loadPriceData = async () => {
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

	const createdTimestamp = Date.now();
	const dataToInsert = data.map(row => ({
		name: row.long,
		symbol: row.short,
		source: 'https://coincap.io',
		priceUSD: +row.price,
		priceBTC: +row.price / btcPriceUsd,
		priceETH: +row.price / ethPriceUsd,
		createdAt: createdTimestamp
	}));

	existing = (await TokenPrice.findAll()).reduce(
		(lookup, row) =>
			Object.assign(lookup, {
				[row.symbol]: { id: row.id, price: row.price }
			}),
		{}
	);

	const updates = [];
	const inserts = [];

	dataToInsert.forEach(row => {
		if (existing[row.symbol]) {
			updates.push(Object.assign(row, { id: existing[row.symbol].id }));
			return;
		}

		inserts.push(row);
	});

	await TokenPrice.bulkAdd(inserts);
	await TokenPrice.bulkEdit(updates);

	emitter.emit('pricesUpdated', dataToInsert);
};

const startStream = async () => {
	const socket = io('https://coincap.io');

	socket.on('trades', async tradeMsg => {
		const tokenData = tradeMsg.message.msg;
		if (existing[tokenData.short] && existing[tokenData.short].price !== tokenData.price) {
			const btcPriceUsd = await TokenPrice.findBySymbol('BTC');
			const ethPriceUsd = await TokenPrice.findBySymbol('ETC');

			const tokenData = tradeMsg.message.msg;

			const tokenPrice = {
				id: existing[tokenData.short].id,
				name: tokenData.long,
				symbol: tokenData.short,
				source: 'https://coincap.io',
				priceUSD: +tokenData.price,
				priceBTC: +tokenData.price / btcPriceUsd,
				priceETH: +tokenData.price / ethPriceUsd,
				updatedAt: Date.now()
			};
			await TokenPrice.bulkEdit([tokenPrice]);

			emitter.emit('pricesUpdated', await TokenPrice.findAll());
		}
	});
};

module.exports = {
	eventEmitter: emitter,

	startUpdateData: async () => {
		await loadPriceData();
		await startStream();
	}
};
