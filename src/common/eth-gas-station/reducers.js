import * as types from './types';

const initialState = {
	ethGasStationInfo: {}
};

const update = data => {
	if (data.safeLow) {
		let result = {
			safeLow: data.safeLow,
			average: data.average,
			fast: data.fast
		};
		Object.keys(result).forEach(key => {
			result[key] = result[key] / 10;
		});
		return result;
	}

	return data;
};

const ethGasStationInfoReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.DATA_UPDATE:
			return {
				...state,
				ethGasStationInfo: update(action.payload)
			};
		default:
			return state;
	}
};

export default ethGasStationInfoReducer;
