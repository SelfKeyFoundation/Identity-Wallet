import reducer from './reducers';
import * as types from './types';
describe('eth-gas-station reducer', () => {
	it('should return initial state', () => {
		expect(reducer(undefined, {})).toEqual({
			ethGasStationInfo: {}
		});
	});

	it('should handle DATA_UPDATE', () => {
		const data = {
			safeLow: 10.0,
			average: 8.0,
			fast: 1.0,
			fees: null
		};
		expect(
			reducer(undefined, {
				type: types.DATA_UPDATE,
				payload: data
			})
		).toEqual({
			ethGasStationInfo: Object.keys(data).reduce((prev, currentKey) => {
				prev[currentKey] = currentKey === 'fees' ? data[currentKey] : data[currentKey] / 10;
				return prev;
			}, {})
		});
	});
});
