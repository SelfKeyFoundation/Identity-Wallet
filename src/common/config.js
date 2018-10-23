/* istanbul ignore file */
'use strict';
const path = require('path');
const dotenv = require('dotenv');
const {
	isDevMode,
	isDebugMode,
	isTestMode,
	getSetupFilePath,
	getUserDataPath
} = require('./utils/common');

dotenv.config();

const CHAIN_ID = process.env.CHAIN_ID_OVERRIDE;
const NODE = process.env.NODE_OVERRIDE;
const PRIMARY_TOKEN = process.env.PRIMARY_TOKEN_OVERRIDE;

const common = {
	defaultLanguage: 'en',
	constants: {
		initialIdAttributes: {
			REQ_1: { id: '1', attributeType: 'name' },
			REQ_2: { id: '1', attributeType: 'email' },
			REQ_3: { id: '1', attributeType: 'country_of_residency' },
			REQ_4: { id: '1', attributeType: 'national_id' },
			REQ_5: { id: '2', attributeType: 'national_id', selfie: true }
		},
		idAttributeTypeAdditions: {
			selfie: 'addition_with_selfie',
			signature: 'addition_with_signature',
			notary: 'addition_with_notary',
			certified_true_copy: 'addition_with_certified_true_copy'
		},
		primaryToken: PRIMARY_TOKEN || 'key'
	},
	notificationTypes: {
		wallet: {
			icon: 'wallet-without-color',
			title: 'the wallet title',
			color: 'green'
		},
		notification: {
			icon: 'appointment-reminders-without-color',
			title: 'you got a notification',
			color: 'yellow'
		}
	},
	reminderTypes: {
		regular: {
			icon: 'appointment-reminders-without-color',
			title: 'you got a reminder',
			color: 'blue'
		}
	},
	allowedUrls: [
		'https://youtube.com/',
		'https://etherscan.io/',
		'https://selfkey.org/',
		'https://help.selfkey.org/',
		'https://help.selfkey.org/',
		'https://blog.selfkey.org/',
		'https://selfkey.org/wp-content/uploads/2017/11/selfkey-whitepaper-en.pdf',
		'https://t.me/selfkeyfoundation'
	]
};

const dev = {
	debug: true,
	dev: true,
	updateEndpoint: 'http://localhost:5000',
	kycApiEndpoint: 'https://token-sale-demo-api.kyc-chain.com/',
	chainId: 3,
	node: 'infura'
};

const prod = {
	debug: false,
	dev: false,
	updateEndpoint: 'https://release.selfkey.org',
	kycApiEndpoint: 'https://tokensale-api.selfkey.org/',
	chainId: 1,
	node: 'infura'
};

const setupFilesPath = getSetupFilePath();
let dbFileName = path.join(getUserDataPath(), 'IdentityWalletStorage.sqlite');

const db = {
	client: 'sqlite3',
	useNullAsDefault: true,
	connection: {
		filename: dbFileName
	},
	migrations: {
		directory: path.join(setupFilesPath, 'main', 'migrations')
	},
	seeds: {
		directory: path.join(setupFilesPath, 'main', 'seeds')
	}
};
if (isTestMode()) {
	db.connection = ':memory:';
	db.pool = {
		min: 1,
		max: 1,
		disposeTiemout: 360000 * 1000,
		idleTimeoutMillis: 360000 * 1000
	};
}

let conf = prod;

if (isDevMode() || isDebugMode()) {
	conf = dev;
}

if (CHAIN_ID) {
	conf.chainId = Number(CHAIN_ID);
}

if (NODE) {
	conf.node = NODE;
}

module.exports = {
	common,
	...common,
	db,
	...conf
};
