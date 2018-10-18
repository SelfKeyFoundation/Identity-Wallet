import reducer from './reducers';
describe('eth-gas-station reducer', () => {
	it('should return initial state', () => {
		expect(reducer(undefined, {})).toEqual({
			ethGasStationInfo: {}
		});
	});
});
