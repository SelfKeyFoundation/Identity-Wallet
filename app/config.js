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
				"REQ_1": {"id": "1", "attributeType": "name"},
				"REQ_2": {"id": "1", "attributeType": "email"},
				"REQ_3": {"id": "1", "attributeType": "country_of_residency"},
				"REQ_4": {"id": "1", "attributeType": "national_id"},
				"REQ_5": {"id": "2", "attributeType": "national_id", "selfie": true}
			},
			"idAttributeTypeAdditions": {
				"selfie": "addition_with_selfie",
				"signature": "addition_with_signature",
				"notary": "addition_with_notary",
				"certified_true_copy": "addition_with_certified_true_copy"
			},
			"primaryToken": "qey"
		},
		notificationTypes : {
			wallet : {
				icon : "wallet-without-color",
				title: "the wallet title",
				color: "green"
			},
			notification : {
				icon : "appointment-reminders-without-color",
				title: "you got a notifixation",
				color: "yellow"
			}
		},
		reminderTypes : {
			regular : {
				icon : "appointment-reminders-without-color",
				title: "you got a reminder",
				color: "blue"
			}
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
