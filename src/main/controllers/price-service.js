'use strict';

const EventEmitter = require('events');
const fetch = require('node-fetch');

const TokenPrice = require('./models/token-price');

const emitter = new EventEmitter();

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

	const existing = (await TokenPrice.all()).reduce(
		(lookup, row) =>
			Object.assign(lookup, {
				[row.symbol]: row.id
			}),
		{}
	);

	const updates = [];
	const inserts = [];

	dataToInsert.forEach(row => {
		if (existing[row.symbol]) {
			updates.push(Object.assign(row, { id: existing[row.symbol] }));
			return;
		}

		inserts.push(row);
	});

	await TokenPrice.bulkAdd(inserts);
	await TokenPrice.bulkEdit(updates);

	emitter.emit('pricesUpdated', dataToInsert);
};

module.exports = {
	eventEmitter: emitter,

	startUpdateData: () => {
		loadPriceData();
		// Update every 10 minutes
		setInterval(loadPriceData, 10 * 60 * 60 * 1000);
	}
};
