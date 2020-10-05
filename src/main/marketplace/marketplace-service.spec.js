import sinon from 'sinon';
import { MarketplaceService } from './marketplace-service';
import { MarketplaceTransactions } from './marketplace-transactions';

describe('MarketplaceService', () => {
	let service = null;
	const serviceId = 'testService';
	const serviceOwner = 'testOwner';
	const walletAddress = '0xtest';
	let depositService = {
		getStakingInfo() {},
		placeStake() {},
		withdrawStake() {}
	};
	let wallet = { address: '0xtest', balance: 0 };
	let state = { wallet, prices: { prices: [] } };
	let store = {
		dispatch: () => {},
		getState() {
			return state;
		},
		state
	};
	let web3Service = {
		getTransaction() {},
		getTransactionReceipt() {},
		checkTransactionStatus() {}
	};
	beforeEach(() => {
		store.state = {};
		service = new MarketplaceService({ store, depositService, web3Service });
	});
	afterEach(() => {
		sinon.restore();
	});

	it('loadTransactions', async () => {
		const testTransactions = [{ serviceOwner: 'testOwner', serviceId: 'testId' }];
		sinon.stub(MarketplaceTransactions, 'find').resolves(testTransactions);
		await service.loadTransactions('testOwner', 'testId');
		expect(
			MarketplaceTransactions.find.calledOnceWith({
				serviceOwner: 'testOwner',
				serviceId: 'testId'
			})
		).toBeTruthy();
	});

	it('loadStakingInfo', async () => {
		const stakingInfo = { balance: 0 };
		sinon.stub(depositService, 'getStakingInfo').resolves(stakingInfo);
		await service.loadStakingInfo(serviceOwner, serviceId);
		expect(
			depositService.getStakingInfo.calledOnceWith(serviceOwner, serviceId, {
				from: walletAddress
			})
		).toBeTruthy();
	});

	it('estimateGasForStake', async () => {
		const stakeTransactionsGas = { approve: { gas: 15 }, deposit: { gas: 20 } };
		sinon.stub(depositService, 'placeStake').resolves(stakeTransactionsGas);
		let gas = await service.estimateGasForStake(serviceOwner, serviceId, 10);
		expect(
			depositService.placeStake.calledOnceWith(10, serviceOwner, serviceId, {
				from: walletAddress,
				method: 'estimateGas'
			})
		).toBeTruthy();

		expect(gas).toEqual(35);
	});

	it('estimateGasForWithdraw', async () => {
		const withdrawTransactionsGas = { gas: 10 };
		sinon.stub(depositService, 'withdrawStake').resolves(withdrawTransactionsGas);
		let gas = await service.estimateGasForWithdraw(serviceOwner, serviceId);
		expect(
			depositService.withdrawStake.calledOnceWith(serviceOwner, serviceId, {
				from: walletAddress,
				method: 'estimateGas'
			})
		).toBeTruthy();

		expect(gas).toEqual(withdrawTransactionsGas.gas);
	});

	it('placeStake', async () => {
		const txs = ['hash1', 'hash2'];
		sinon.stub(depositService, 'placeStake').resolves(txs);
		sinon.stub(MarketplaceTransactions, 'create').resolves('ok');

		let tx = await service.placeStake(serviceOwner, serviceId, 10, 12, 11);

		expect(
			depositService.placeStake.calledOnceWith(10, serviceOwner, serviceId, {
				from: walletAddress,
				gas: 11,
				gasPrice: 12
			})
		);

		expect(tx).toEqual('ok');
	});

	it('withdrawStake', async () => {
		const txs = ['hash1', 'hash2'];
		sinon.stub(depositService, 'withdrawStake').resolves(txs);
		sinon.stub(MarketplaceTransactions, 'create').resolves('ok');

		let tx = await service.withdrawStake(serviceOwner, serviceId, 12, 11);

		expect(
			depositService.withdrawStake.calledOnceWith(serviceOwner, serviceId, {
				from: walletAddress,
				gas: 11,
				gasPrice: 12
			})
		);

		expect(tx).toEqual('ok');
	});

	describe('checkMpTxStatus', () => {
		const t = (statuses, expected) =>
			it(`${statuses.join(' ')} => ${expected}`, async () => {
				let tx = { blockchainTx: statuses.map(status => ({ hash: status })) };
				sinon.stub(web3Service, 'checkTransactionStatus').resolvesArg(0);
				let status = await service.checkMpTxStatus(tx);
				expect(status).toBe(expected);
			});

		t(['success', 'success'], 'success');
		t(['processing', 'success', 'success'], 'processing');
		t(['pending', 'processing', 'success'], 'pending');
	});

	it('updateTransaction', async () => {
		sinon.stub(MarketplaceTransactions, 'updateById');
		let txId = 1;
		let txData = { test: '1' };
		let tx = { id: txId, ...txData };

		await service.updateTransaction(tx);

		expect(MarketplaceTransactions.updateById.calledOnceWith(txId, txData)).toBeTruthy();
	});
});
