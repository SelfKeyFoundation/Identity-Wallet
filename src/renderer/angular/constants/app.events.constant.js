'use strict';

const AppEventsConstant = {
	KEYSTORE_OBJECT_LOADED: 'wallet-service:keystore-object-loaded',
	KEYSTORE_OBJECT_UNLOCKED: 'wallet-service:keystore-object-unlocked',
	NEW_TOKEN_ADDED: 'token-service:new-token-added',
	CHAIN_ID_CHANGED: 'app:chain-id-changed',

	/**
	 * on SqlLite
	 */
	APP_DATA_LOAD: 'local-data-load'
};

module.exports = AppEventsConstant;
