import sinon from 'sinon';
import EthGasStationService from './eth-gas-station-service';

describe('EthGasStationService', () => {
	it('defined', () => {
		expect(EthGasStationService).toBeDefined();
	});

	it('startUpdateData', async () => {
		const ethGasStationService = new EthGasStationService();
		const loadStub = sinon.stub(EthGasStationService.prototype, 'getInfo');
		ethGasStationService.getInfo();
		expect(loadStub.calledOnce).toBeTruthy();
	});
});
