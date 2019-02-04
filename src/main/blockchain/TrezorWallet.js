// import EthereumTx from 'ethereumjs-tx';
import { publicToAddress } from 'ethereumjs-util';
// import BigNumber from 'bignumber.js';
// import { timeout, TimeoutError } from 'promise-timeout';
import HDKey from 'hdkey';
const trezor = require('trezor.js');

let currentSession = null;
let currentDevice = null;
// const CUSTOM_TIME_OUT = 30000;

const hardeningConstant = 0x80000000;
const defaultAddress = [
	(44 | hardeningConstant) >>> 0,
	(60 | hardeningConstant) >>> 0,
	(0 | hardeningConstant) >>> 0,
	0
];
const deviceList = new trezor.DeviceList();

export default class TrezorWallet {
	constructor(networkId, accountsOffset = 0, accountsQuantity = 6, eventEmitter) {
		this.networkId = networkId; // Function which should return networkId
		// this.getAccounts = this.getAccounts.bind(this);
		// this.signTransaction = this.signTransaction.bind(this);
		this.accountsOffset = accountsOffset;
		this.accountsQuantity = accountsQuantity;
		this.eventEmitter = eventEmitter;
		this.wallets = [];
	}

	_getAccountIndex(address) {
		return this.wallets.filter(wallet => {
			return wallet.address === address;
		})[0].index;
	}

	_getAddressByIndex(index) {
		return defaultAddress.concat([+index]);
	}

	_pinCallback(type, callback) {
		/* this.eventEmitter.on('ON_PIN', (err, enteredPin) => {
			callback(err, enteredPin);
		});
		*/
		this.eventEmitter.emit('TREZOR_PIN_REQUEST');
	}

	_passphraseCallback(callback) {
		this.eventEmitter.on('ON_PASSPHRASE', (err, enteredPassphrase) => {
			callback(err, enteredPassphrase);
		});

		this.eventEmitter.emit('TREZOR_PASSPHRASE_REQUEST');
	}

	async _getCurrentSession() {
		if (!deviceList.transport) {
			throw new Error('TREZOR_BRIDGE_NOT_FOUND');
		}

		if (currentSession) {
			return currentSession;
		}
		if (currentDevice) {
			await currentDevice.steal();
		}

		const { device, session } = await deviceList.acquireFirstDevice(true);

		device.on('disconnect', () => {
			currentDevice = null;
			currentSession = null;
		});
		device.on('changedSessions', (isUsed, isUsedHere) => {
			if (isUsedHere) {
				currentSession = null;
			}
		});

		device.on('pin', this._pinCallback.bind(this));
		device.on('passphrase', this._passphraseCallback.bind(this));

		currentDevice = device;
		currentSession = session;

		return currentSession;
	}

	/* async signTransactionAsync(txData) {
		const accountIndex = this.getAccountIndex(txData.from);

		Object.keys(txData).forEach(key => {
			let val = txData[key];
			val = val.replace(hexPrefix, '').toLowerCase();
			txData[key] = val.length % 2 !== 0 ? `0${val}` : val;
		});

		let session = await _getCurrentSession();
		let signPromise = session.signEthTx(
			_getAddressByIndex(accountIndex),
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
			signed = await timeout(signPromise, CUSTOM_TIME_OUT);
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
	} */

	/**
	 * Gets a list of accounts from a device - currently it's returning just
	 * first one according to derivation path
	 * @param {failableCallback} callback
	 */
	async getAccounts(callback) {
		try {
			let session = await this._getCurrentSession();

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
			for (let i = 0; i < this.accountsQuantity; i++) {
				const index = i + this.accountsOffset;
				const dkey = hdk.derive(`${pathBase}/${index}`);
				const address = `0x${publicToAddress(dkey.publicKey, true).toString('hex')}`;
				wallets.push({
					address,
					index
				});
			}
			callback(null, wallets);
		} catch (error) {
			callback(error, null);
		}
	}

	/**
	 * Signs txData in a format that ethereumjs-tx accepts
	 * @param {object} txData - transaction to sign
	 * @param {failableCallback} callback - callback
	 */
	/*	signTransaction(txData, callback) {
		this.signTransactionAsync(txData)
			.then(res => callback(null, res))
			.catch(err => callback(err, null));
	} */
}
