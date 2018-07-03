'use strict';
const path = require('path');
const {
	isDevMode,
	isDebugMode,
	isTestMode,
	getSetupFilePath,
	getUserDataPath
} = require('./utils/common');

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
		primaryToken: 'key'
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
		'http://help.selfkey.org/',
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
	chainId: 1,
	node: 'mew'
};

const prod = {
	debug: false,
	dev: false,
	updateEndpoint: 'https://release.selfkey.org',
	kycApiEndpoint: 'https://tokensale-api.selfkey.org/',
	chainId: 1,
	node: 'mew'
};

const setupFilesPath = getSetupFilePath();
let dbFileName = path.join(getUserDataPath(), 'IdentityWalletStorage.sqlite');

if (isTestMode()) {
	dbFileName = ':memory:';
}

const db = {
	client: 'sqlite3',
	useNullAsDefault: true,
	connection: {
		filename: dbFileName
	},
	migrations: {
		directory: path.join(setupFilesPath, 'migrations')
	},
	seeds: {
		directory: path.join(setupFilesPath, 'seeds')
	}
};

let conf = prod;

if (isDevMode() || isDebugMode()) {
	conf = dev;
}

module.exports = {
	common,
	db,
	...conf
};
