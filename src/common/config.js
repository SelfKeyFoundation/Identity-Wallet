/* istanbul ignore file */
'use strict';
const path = require('path');
const {
	isDevMode,
	isTestMode,
	getSetupFilePath,
	getUserDataPath,
	isStorybook
} = require('./utils/common');
if (!isStorybook()) {
	const dotenv = require('dotenv');
	dotenv.config();
}
const pkg = require('../../package.json');

const DEBUG_REQUEST = process.env.DEBUG_REQUEST === '1' && !isStorybook();
if (DEBUG_REQUEST) {
	require('request').debug = true;
}
const CHAIN_ID = process.env.CHAIN_ID_OVERRIDE;
const NODE = process.env.NODE_OVERRIDE;
const PRIMARY_TOKEN = process.env.PRIMARY_TOKEN_OVERRIDE
	? process.env.PRIMARY_TOKEN_OVERRIDE.toUpperCase()
	: null;

// KYCC ENV variables
const KYCC_API_OVERRIDE = process.env.KYCC_API_OVERRIDE;
// Incorporations ENV variables
const INCORPORATIONS_TEMPLATE_OVERRIDE = process.env.INCORPORATIONS_TEMPLATE_OVERRIDE;
const INCORPORATIONS_PRICE_OVERRIDE = process.env.INCORPORATIONS_PRICE_OVERRIDE;
const INCORPORATION_API_URL = process.env.INCORPORATION_API_URL;
const INCORPORATION_TREATIES_URL = process.env.INCORPORATION_TREATIES_URL;
// Bank Accounts ENV variables
const BANKACCOUNTS_TEMPLATE_OVERRIDE = process.env.BANKACCOUNTS_TEMPLATE_OVERRIDE;
const BANKACCOUNTS_PRICE_OVERRIDE = process.env.BANKACCOUNTS_PRICE_OVERRIDE;
const BANKACCOUNTS_API_URL = process.env.BANKACCOUNTS_API_URL;

const COUNTRY_INFO_URL = process.env.COUNTRY_INFO_URL;
const ALL_COUNTRIES_INFO_URL = process.env.ALL_COUNTRIES_INFO_URL;
const MATOMO_SITE = process.env.MATOMO_SITE;
const DEPOSIT_PRICE_OVERRIDE = process.env.DEPOSIT_PRICE_OVERRIDE;

// development or production
const ATTRIBUTE_TYPE_SOURCE_OVERRIDE = process.env.ATTRIBUTE_TYPE_SOURCE_OVERRIDE;

let userDataDirectoryPath = '';
let walletsDirectoryPath = '';

userDataDirectoryPath = getUserDataPath();
walletsDirectoryPath = path.resolve(userDataDirectoryPath, 'wallets');

const common = {
	defaultLanguage: 'en',
	forceUpdateAttributes: process.env.FORCE_UPDATE_ATTRIBUTES === 'true' && !isTestMode(),
	userAgent: `SelfKeyIDW/${pkg.version}`,
	airtableBaseUrl: 'https://us-central1-kycchain-master.cloudfunctions.net/airtable?tableName=',

	kyccUrlOverride: KYCC_API_OVERRIDE,
	incorporationsPriceOverride: INCORPORATIONS_PRICE_OVERRIDE,
	incorporationsTemplateOverride: INCORPORATIONS_TEMPLATE_OVERRIDE,
	incorporationApiUrl: INCORPORATION_API_URL || 'https://passports.io/api/incorporations',
	incorporationTreatiesUrl: INCORPORATION_TREATIES_URL || 'https://passports.io/api/tax-treaties',
	countryInfoUrl: COUNTRY_INFO_URL || 'https://passports.io/api/country',
	allCountriesInfoUrl: ALL_COUNTRIES_INFO_URL || 'https://passports.io/api/countries',
	bankAccountsPriceOverride: BANKACCOUNTS_PRICE_OVERRIDE,
	bankAccountsTemplateOverride: BANKACCOUNTS_TEMPLATE_OVERRIDE,
	bankAccountsApiUrl: BANKACCOUNTS_API_URL || 'https://api.bankaccounts.io/api/bank-accounts',
	depositPriceOverride: DEPOSIT_PRICE_OVERRIDE,

	relyingPartyInfo: {
		incorporations: {
			name: 'Far Horizon Capital Inc',
			email: 'support@flagtheory.com',
			address: '10 Anson Road International Plaza #27-15 Singapore 079903'
		}
	},

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
		primaryToken: PRIMARY_TOKEN || 'KEY'
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
	],
	features: {
		paymentContract: false,
		scheduler: true,
		corporate: false,
		certifiers: false,
		corporateMarketplace: false,
		kyccUsersEndpoint: false,
		walletExport: false,
		transactionsListFilter: false
	}
};

const dev = {
	debug: true,
	dev: true,
	qa: true,
	updateEndpoint: 'http://localhost:5000',
	kycApiEndpoint: 'https://token-sale-demo-api.kyc-chain.com/',
	chainId: 3,
	node: 'infura',
	constants: {
		primaryToken: PRIMARY_TOKEN || 'KI'
	},
	matomoSite: 2,
	ledgerAddress: '0x27332286A2CEaE458b82A1235f7E2a3Aa8945cAB',
	paymentSplitterAddress: '0xb91FF8627f30494d27b91Aac1cB3c7465BE58fF5',
	features: {
		paymentContract: false,
		scheduler: true,
		corporate: true,
		certifiers: true,
		corporateMarketplace: false,
		kyccUsersEndpoint: true,
		walletExport: true,
		transactionsListFilter: true
	},
	testWalletAddress: '0x23d233933c86f93b74705cf0d236b39f474249f8',
	testDidAddress: '0xee10a3335f48e10b444e299cf017d57879109c1e32cec3e31103ceca7718d0ec',
	attributeTypeSource: ATTRIBUTE_TYPE_SOURCE_OVERRIDE || 'development'
};

const prod = {
	debug: false,
	dev: false,
	qa: true,
	updateEndpoint: 'https://release.selfkey.org',
	kycApiEndpoint: 'https://tokensale-api.selfkey.org/',
	chainId: 1,
	node: 'infura',
	constants: {
		primaryToken: PRIMARY_TOKEN || 'KEY'
	},
	matomoSite: 1,
	ledgerAddress: '0x0cb853331293d689c95187190e09bb46cb4e533e',
	paymentSplitterAddress: '0xC3f1fbe8f4BE283426F913f0F2BE8329fC6BE041',
	features: {
		paymentContract: false,
		scheduler: true,
		corporate: true,
		certifiers: false,
		corporateMarketplace: false,
		kyccUsersEndpoint: false,
		walletExport: false,
		transactionsListFilter: false
	},
	attributeTypeSource: ATTRIBUTE_TYPE_SOURCE_OVERRIDE || 'production'
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
	// acquireConnectionTimeout: 6000
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

if (isDevMode()) {
	conf = dev;
}

if (CHAIN_ID) {
	conf.chainId = Number(CHAIN_ID);
}

if (MATOMO_SITE) {
	conf.matomoSite = Number(MATOMO_SITE);
}

if (NODE) {
	conf.node = NODE;
}

module.exports = {
	common,
	...common,
	db,
	...conf,
	userDataDirectoryPath,
	walletsDirectoryPath
};
