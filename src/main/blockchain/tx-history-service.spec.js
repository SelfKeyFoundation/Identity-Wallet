import sinon from 'sinon';
import _ from 'lodash';
import TxHistoryService, {
	API_ENDPOINT,
	TOKEN_TX_ACTION,
	TX_LIST_ACTION,
	TX_RECEIPT_ACTION
} from './tx-history-service';
import config from 'common/config';
import request from 'request';

const web3ServiceMock = {
	async waitForTicket(ticket) {
		return ticket.contractMethod || ticket.method;
	}
};

describe('TxHistoryService', () => {
	afterEach(() => {
		sinon.restore();
	});
	describe('requests', () => {
		const t = (name, data) =>
			it(name, async () => {
				let stub = sinon.stub(TxHistoryService.prototype, 'makeRequest');
				let txHistory = new TxHistoryService({ web3Service: web3ServiceMock });
				txHistory.queue.delay = 0;
				stub.resolves('ok');
				await txHistory[data.request](...data.args);
				expect(stub.calledOnceWith(...data.expected)).toBeTruthy();
			});
		t('loadERCTxHistory', {
			request: 'loadERCTxHistory',
			args: ['address', 'block', 'endblock', 1],
			expected: [
				'get',
				`${API_ENDPOINT}${TOKEN_TX_ACTION}&address=address&startblock=block&endblock=endblock&page=1`
			]
		});
		t('loadEthTxHistory', {
			request: 'loadEthTxHistory',
			args: ['address', 'block', 'endblock', 1],
			expected: [
				'get',
				`${API_ENDPOINT}${TX_LIST_ACTION}&address=address&startblock=block&endblock=endblock&page=1`
			]
		});
		t('getTransactionReceipt', {
			request: 'getTransactionReceipt',
			args: ['txhash'],
			expected: ['get', `${API_ENDPOINT}${TX_RECEIPT_ACTION}&txhash=txhash`]
		});
		t('getMostResentBlock', {
			request: 'getMostResentBlock',
			args: [],
			expected: ['get', `${API_ENDPOINT}?module=proxy&action=eth_blockNumber`]
		});
	});
	describe('makeRequest', () => {
		const t = (name, data) =>
			it(name, async () => {
				let txHistory = new TxHistoryService({ web3Service: web3ServiceMock });
				txHistory.queue.delay = 0;
				const stub = sinon.stub(request, data.method);
				stub.callsArgWith(1, data.error, data.httpResponse, data.response);
				let res;
				try {
					res = await txHistory.makeRequest(data.method, data.url, data.data);
				} catch (error) {
					expect(error).toBe(data.error);
					return;
				}
				expect(res).toEqual(JSON.parse(data.response).result);
			});
		t('get success', {
			method: 'get',
			url: 'test_url',
			response: JSON.stringify({ result: 'response' })
		});
		t('get failed', {
			method: 'get',
			url: 'test_url',
			response: JSON.stringify({ result: 'response' }),
			error: new Error('test error')
		});
		t('post success', {
			method: 'post',
			url: 'test_url',
			response: JSON.stringify({ result: 'response' })
		});
		t('post failed', {
			method: 'post',
			url: 'test_url',
			response: JSON.stringify({ result: 'response' }),
			error: new Error('test error')
		});
		t('put success', {
			method: 'put',
			url: 'test_url',
			response: JSON.stringify({ result: 'response' })
		});
		t('put failed', {
			method: 'put',
			url: 'test_url',
			response: JSON.stringify({ result: 'response' }),
			error: new Error('test error')
		});
		t('delete success', {
			method: 'delete',
			url: 'test_url',
			response: JSON.stringify({ result: 'response' })
		});
		t('delete failed', {
			method: 'delete',
			url: 'test_url',
			response: JSON.stringify({ result: 'response' }),
			error: new Error('test error')
		});
	});
	it('getContractInfo', async () => {
		let contractInfo = { tokenDecimal: 'decimals', tokenSymbol: 'symbol', tokenName: 'name' };
		let txHistory = new TxHistoryService({ web3Service: web3ServiceMock });
		expect(await txHistory.getContractInfo('test')).toEqual(contractInfo);
	});
	describe('processTx', () => {
		let service;
		const tokenTransaction = {
			token: {
				blockNumber: '4247920',
				timeStamp: '1504784559',
				hash: '0xfcd223b4d45520eeae22ad9ec5ee5293e6170127da0750e4fcb54f4162e74f24',
				nonce: '10753',
				blockHash: '0xfc69d2cf3f7f5fa1132d78a82937c8ffcb85435508fa9a439c5bcb6ea8ab6e78',
				from: '0x281a867c7c3a7d8ddc2498b6584b12828ccd44cb',
				contractAddress: '0x4e0603e2a27a30480e5e3a4fe548e29ef12f64be',
				to: '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
				value: '1000000000000000000',
				tokenName: 'Credo Token',
				tokenSymbol: 'CREDO',
				tokenDecimal: '18',
				transactionIndex: '21',
				gas: '100000',
				gasPrice: '24664144555',
				gasUsed: '51762',
				cumulativeGasUsed: '830861',
				input:
					'0xa9059cbb000000000000000000000000ddbd2b932c763ba5b1b7ae3b362eac3e8d40121a0000000000000000000000000000000000000000000000000de0b6b3a7640000',
				confirmations: '1814959'
			}
		};
		const processedTokenTransaction = {
			blockHash: '0xfc69d2cf3f7f5fa1132d78a82937c8ffcb85435508fa9a439c5bcb6ea8ab6e78',
			blockNumber: '4247920',
			confirmations: '1814959',
			contractAddress: '0x4e0603e2a27a30480e5e3a4fe548e29ef12f64be',
			cumulativeGasUsed: '830861',
			from: '0x281a867c7c3a7d8ddc2498b6584b12828ccd44cb',
			gas: '100000',
			gasPrice: '24664144555',
			gasUsed: '51762',
			hash: '0xfcd223b4d45520eeae22ad9ec5ee5293e6170127da0750e4fcb54f4162e74f24',
			input:
				'0xa9059cbb000000000000000000000000ddbd2b932c763ba5b1b7ae3b362eac3e8d40121a0000000000000000000000000000000000000000000000000de0b6b3a7640000',
			isError: undefined,
			networkId: config.chainId,
			nonce: '10753',
			timeStamp: 1504784559000,
			to: '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
			tokenDecimal: '18',
			tokenName: 'Credo Token',
			tokenSymbol: 'CREDO',
			transactionIndex: '21',
			txReceiptStatus: 0,
			value: '1'
		};
		const ethTransaction = {
			eth: {
				blockNumber: '0',
				timeStamp: '1438269973',
				hash: 'GENESIS_ddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
				nonce: '',
				blockHash: '',
				transactionIndex: '0',
				from: 'GENESIS',
				to: '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
				value: '10000000000000000000000',
				gas: '0',
				gasPrice: '0',
				isError: '0',
				txreceipt_status: '',
				input: '',
				contractAddress: '',
				cumulativeGasUsed: '0',
				gasUsed: '0',
				confirmations: '6062851'
			}
		};
		const processedEthTransaction = {
			blockHash: '',
			blockNumber: '0',
			confirmations: '6062851',
			contractAddress: null,
			cumulativeGasUsed: '0',
			from: 'genesis',
			gas: '0',
			gasPrice: '0',
			gasUsed: '0',
			hash: 'GENESIS_ddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
			input: '',
			isError: '0',
			networkId: config.chainId,
			nonce: '',
			timeStamp: 1438269973000,
			to: '0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a',
			tokenDecimal: undefined,
			tokenName: undefined,
			tokenSymbol: null,
			transactionIndex: '0',
			txReceiptStatus: 0,
			value: '10000'
		};

		beforeEach(() => {
			sinon.stub(TxHistoryService.prototype, 'getContractInfo');
			sinon.stub(TxHistoryService.prototype, 'getTransactionReceipt');
		});
		it('should process eth transaction', async () => {
			service = new TxHistoryService({ web3Service: web3ServiceMock });
			let processed = _.omit(await service.processTx(ethTransaction), 'createdAt');
			expect(processed).toEqual(processedEthTransaction);
		});
		it('should process token transaction', async () => {
			service = new TxHistoryService({ web3Service: web3ServiceMock });
			let processed = _.omit(await service.processTx(tokenTransaction), 'createdAt');
			expect(processed).toEqual(processedTokenTransaction);
		});
	});
	xit('processTxHistory', () => {});
	xit('getWalletSetting', () => {});
	xit('syncByWallet', () => {});
	xit('sync', () => {});
	xit('removeNotMinedPendingTxs', () => {});
	xit('startSyncingJob', () => {});
	xit('isSyncing', () => {});
});
