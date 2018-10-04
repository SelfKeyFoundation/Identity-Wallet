'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('HardwareWalletService');
const EthUnits = require('../classes/eth-units');

function HardwareWalletService($rootScope, RPCService, CommonService, Web3Service) {
	'ngInject';

	log.info('HardwareWalletService Initialized');
	RPCService.on('TREZOR_PIN_REQUEST', () => {
		$rootScope.openEnterTrezorPinDialog();
	});

	RPCService.on('TREZOR_PASSPHRASE_REQUEST', () => {
		$rootScope.openEnterTrezorPassphraseDialog();
	});

	const SIGN_SUCCESS_EVENT = 'TREZOR_SIGN_SUCCESS';
	RPCService.on(SIGN_SUCCESS_EVENT, () => {
		$rootScope.$broadcast(SIGN_SUCCESS_EVENT);
	});

	const SIGN_FEALURE_EVENT = 'TREZOR_SIGN_FAILURE';
	RPCService.on(SIGN_FEALURE_EVENT, (event, err) => {
		$rootScope.$broadcast(SIGN_FEALURE_EVENT, err);
	});

	class HardwareWalletService {
		async getAccountsWithBalances(args) {
			const loadBalances = async accounts => {
				let result = [];
				for (let account of accounts) {
					let isStr = typeof account === 'string';
					let address = isStr ? account : account.address;
					let balanceWei = await Web3Service.getBalance(address);
					let balanceEth = EthUnits.toEther(balanceWei, 'wei');
					let formatedBalance = Number(CommonService.numbersAfterComma(balanceEth, 15));

					let option = {
						balanceEth: formatedBalance,
						address
					};

					// used for trezor case
					if (!isStr) {
						option.index = account.index;
					}

					result.push(option);
				}
				return result.sort((a, b) => {
					return parseFloat(b.formatedBalance) - parseFloat(a.formatedBalance);
				});
			};
			let fn = args.profile === 'ledger' ? 'getLedgerAccounts' : 'getTrezorAccounts';

			let accounts = await RPCService.makeCall(fn, args);

			if (args.isInitial && args.profile === 'trezor') {
				$rootScope.openChooseTrezorAddressPreWindow();
			}

			return loadBalances(accounts);
		}

		createWalletByAddress(address, profile) {
			return RPCService.makeCall('createHarwareWalletByAdress', { address, profile });
		}

		signTransaction(dataToSign, address, profile) {
			let fn = 'signTransactionWithLedger';
			let data = {
				dataToSign,
				address
			};

			if (profile === 'trezor') {
				fn = 'signTransactionWithTrezor';
				data.accountIndex = $rootScope.selectedTrezorAccountIndex;
			}
			return RPCService.makeCall(fn, data);
		}

		sendTrezorPin(error, pin) {
			return RPCService.makeCall('onTrezorPin', { error, pin });
		}

		sendTrezorPassphrase(error, passphrase) {
			return RPCService.makeCall('onTrezorPassphrase', { error, passphrase });
		}

		testTrezorConnection() {
			return RPCService.makeCall('testTrezorConnection');
		}
	}

	return new HardwareWalletService();
}

HardwareWalletService.$inject = ['$rootScope', 'RPCService', 'CommonService', 'Web3Service'];

module.exports = HardwareWalletService;
