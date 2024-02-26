import * as types from './types';

const initialState = {
	ethGasStationInfo: {}
};

const update = data => {
	let result = {
		safeLow: data.safeLow || parseInt(data.fees.low.suggestedMaxFeePerGas),
		average: data.average || parseInt(data.fees.medium.suggestedMaxFeePerGas),
		fast: data.fast || parseInt(data.fees.high.suggestedMaxFeePerGas)
	};

	result.fees = data.fees ? data.fees : null;

	return result;
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
