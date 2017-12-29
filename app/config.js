'use strict';

const AppConfigConstant = {
	"common": {
		"deskmetricsAppId": "b70b7e71f1",
		"DEFAULT_LANGUAGE": "en",
		"APP_NAME": "IdentityWallet",
		"APP_TITLE": "Identity Wallet",
		"version": "0.0.4",
		"description": "Selfkey Identity Wallet",
		"companyName": "Selfkey",
		"productName": "org.selfkey.wallet",
		"authors": "Edmund Lowell",
		"constants": {
			"localStorageKeys": {
				"APP_OPEN_COUNT": "APP_OPEN_COUNT",
				"USER_DOCUMENTS_STORAGE_PATH": "USER_DOCUMENTS_STORAGE_PATH",
				"LEGAL_TERMS_AND_CONDITIONS": "LEGAL_TERMS_AND_CONDITIONS",
				"SELECTED_LANGUAGE": "SELECTED_LANGUAGE",
				"SELECTED_PRIVATE_KEY": "SELECTED_PRIVATE_KEY"
			},
			"initialIdAttributes": {
				"REQ_1": "name",
				"REQ_2": "email",
				"REQ_3": "proof_of_residence",
				"REQ_4": "national_id"
			},
			"idAttributeTypeAdditions": {
				"selfie": "addition_with_selfie",
				"signature": "addition_with_signature",
				"notary": "addition_with_notary",
				"certified_true_copy": "addition_with_certified_true_copy"
			},
			"primaryToken": "qey"
		}
	},
	"default": {
		"debug": true,
		"dev": true,
		"API_ENDPOINT": "http://localhost:8080/api"
	},
    "production": {
		"API_ENDPOINT": "http://localhost:8080/api",
		"debug": false,
		"dev": false
	}
};

module.exports = AppConfigConstant;
