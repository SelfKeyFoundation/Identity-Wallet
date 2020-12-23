const TRANSACTION_UPDATE = 'app/transaction/UPDATE';
const ADDRESS_ERROR_UPDATE = 'app/transaction/address/error/UPDATE';
const TREZOR_TX_SIGN = 'app/transaction/TREZOR_TX_SIGN';
const CREATE_TX_HISTORY = 'app/transaction/CREATE_TX_HISTORY';

const ADDRESS_SET = 'app/transaction/address/SET';
const AMOUNT_SET = 'app/transaction/amount/SET';
const GAS_PRICE_SET = 'app/transaction/gasPrice/SET';
const LIMIT_PRICE_SET = 'app/transaction/limitPrice/SET';
const INIT = 'app/transaction/init';
const TRANSACTION_FEE_SET = 'app/transaction/fee/SET';
const CONFIRM_SEND = 'app/transaction/comfirmSend';
const INCORPORATION_SEND = 'app/transaction/incorporationSend';
const MARKETPLACE_SEND = 'app/transaction/marketplaceSend';
const SWAP = 'app/transactions/swap';
const CRYPTO_CURRENCY_SET = 'app/transaction/cryptoCurrency/SET';
const LOCKED_SET = 'app/transaction/locked/SET';
const NONCE_SET = 'app/transaction/nonce/SET';

export {
	TRANSACTION_UPDATE,
	ADDRESS_ERROR_UPDATE,
	TREZOR_TX_SIGN,
	CREATE_TX_HISTORY,
	ADDRESS_SET,
	AMOUNT_SET,
	GAS_PRICE_SET,
	LIMIT_PRICE_SET,
	INIT,
	TRANSACTION_FEE_SET,
	CONFIRM_SEND,
	INCORPORATION_SEND,
	MARKETPLACE_SEND,
	CRYPTO_CURRENCY_SET,
	LOCKED_SET,
	SWAP,
	NONCE_SET
};
