'use strict';
const trezor = require('trezor.js');
const EventEmitter = require('events');
const { publicToAddress } = require('ethereumjs-util');
const EthereumTx = require('ethereumjs-tx');
const BigNumber = require('bignumber.js');
const { timeout, TimeoutError } = require('promise-timeout');
const HDKey = require('hdkey');

const _emitter = new EventEmitter();
const list = new trezor.DeviceList();

let currentSession = null;
let currentDevice = null;
const hexPrefix = '0x';

const hardeningConstant = 0x80000000;
const defaultAddress = [
	(44 | hardeningConstant) >>> 0,
	(60 | hardeningConstant) >>> 0,
	(0 | hardeningConstant) >>> 0,
	0
];

const getAddressByIdex = index => {
	return defaultAddress.concat([+index]);
};

const addHexPrefix = val => {
	if (typeof val !== 'string') {
		return val;
	}
	return val.substring(0, 2) === hexPrefix ? val : hexPrefix + val;
};

module.exports = function() {
	const controller = function() {};

	async function _getAccounts(args) {
		let start = args.start || 0;
		let quantity = args.quantity || 6;
		let session = await getCurrentSession();

		let addressN = {
			address_n: defaultAddress
		};

		let result = await session.typedCall('GetPublicKey', 'PublicKey', addressN);
		let chainCode = result.message.node.chain_code;
		let publicKey = result.message.node.public_key;

		let hdk = new HDKey();
		hdk.publicKey = Buffer.from(publicKey, 'hex');
		hdk.chainCode = Buffer.from(chainCode, 'hex');
		let pathBase = 'm';
		let wallets = [];
		for (let i = 0; i < quantity; i++) {
			const index = i + start;
			const dkey = hdk.derive(`${pathBase}/${index}`);
			const address = hexPrefix + publicToAddress(dkey.publicKey, true).toString('hex');
			wallets.push({
				address,
				index
			});
		}
		return wallets;
	}
	function pinCallback(type, callback) {
		_emitter.on('ON_PIN', (err, enteredPin) => {
			callback(err, enteredPin);
		});

		_emitter.emit('TREZOR_PIN_REQUEST');
	}

	async function getCurrentSession() {
		if (currentSession) {
			return currentSession;
		}
		if (currentDevice) {
			await currentDevice.steal();
		}

		const { device, session } = await list.acquireFirstDevice(true);

		device.on('disconnect', () => {
			currentDevice = null;
			currentSession = null;
		});
		device.on('changedSessions', (isUsed, isUsedHere) => {
			if (isUsedHere) {
				currentSession = null;
			}
		});

		device.on('pin', pinCallback);

		currentDevice = device;
		currentSession = session;

		return currentSession;
	}

	async function _signTransaction(args) {
		let { accountIndex } = args;
		let { chainId, ...txData } = args.dataToSign;

		Object.keys(txData).forEach(key => {
			let val = txData[key];
			val = val.replace(hexPrefix, '').toLowerCase();
			txData[key] = val.length % 2 !== 0 ? `0${val}` : val;
		});

		let session = await getCurrentSession();
		let signPromise = session.signEthTx(
			getAddressByIdex(accountIndex),
			txData.nonce,
			txData.gasPrice,
			txData.gasLimit,
			txData.to,
			txData.value,
			txData.data,
			chainId
		);

		let signed = null;
		try {
			signed = await timeout(signPromise, 10000);
		} catch (err) {
			if (err instanceof TimeoutError) {
				currentSession = null;
			}
			throw err;
		}

		const signedTx = new EthereumTx({
			s: addHexPrefix(signed.s),
			v: addHexPrefix(new BigNumber(signed.v).toString(16)),
			r: addHexPrefix(signed.r.toString()),
			...args.dataToSign
		});
		return {
			raw: hexPrefix + signedTx.serialize().toString('hex')
		};
	}

	async function _testConnection() {
		let addressN = {
			address_n: defaultAddress
		};
		let session = await getCurrentSession();
		await session.typedCall('GetPublicKey', 'PublicKey', addressN);
		return {
			success: true
		};
	}

	controller.prototype.eventEmitter = _emitter;
	controller.prototype.getAccounts = _getAccounts;
	controller.prototype.signTransaction = _signTransaction;
	controller.prototype.testConnection = _testConnection;

	process.on('exit', () => {
		list.onbeforeunload();
	});

	return controller;
};
