'use strict';

const EventEmitter = require('events');
const fetch = require('node-fetch');
const log = require('electron-log');

const TokenPrice = require('./models/token-price');

const emitter = new EventEmitter();
const io = require('socket.io-client');

let existing = [];

const getTokenPriceObject = (data, btcPriceUsd, ethPriceUsd, id) => {
	const tokenPrice = {
		name: data.long,
		symbol: data.short,
		source: 'https://coincap.io',
		priceUSD: +data.price,
		priceBTC: +data.price / btcPriceUsd,
		priceETH: +data.price / ethPriceUsd,
		updatedAt: Date.now()
	};
	if (id) {
		tokenPrice.id = id;
	} else {
		tokenPrice.createdAt = Date.now();
	}
	return tokenPrice;
};

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

	const dataToInsert = data.map(row => getTokenPriceObject(row, btcPriceUsd, ethPriceUsd));

	existing = (await TokenPrice.all()).reduce(
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

const startStream = async () => {
	const socket = io('https://coincap.io');

	socket.on('trades', async tradeMsg => {
		if (existing[tradeMsg.coin]) {
			const btcPriceUsd = await TokenPrice.findBySymbol('BTC');
			const ethPriceUsd = await TokenPrice.findBySymbol('ETC');

			const tokenData = tradeMsg.message.msg;

			const tokenPrice = {
				id: existing[tokenData.short],
				name: tokenData.long,
				symbol: tokenData.short,
				source: 'https://coincap.io',
				priceUSD: +tokenData.price,
				priceBTC: +tokenData.price / btcPriceUsd,
				priceETH: +tokenData.price / ethPriceUsd,
				updatedAt: Date.now()
			};
			await TokenPrice.edit(tokenPrice);

			emitter.emit('pricesUpdated', await TokenPrice.all());
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
