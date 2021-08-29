const GWEI = 1000000000;

export const getEthGasStationInfo = ({ ethGasStationInfo }) => ethGasStationInfo;
export const getEthGasStationInfoWEI = ({ ethGasStationInfo }) => {
	return {
		medium: ethGasStationInfo.ethGasStationInfo.medium.suggestedMaxFeePerGas * GWEI,
		high: ethGasStationInfo.ethGasStationInfo.high.suggestedMaxFeePerGas * GWEI,
		low: ethGasStationInfo.ethGasStationInfo.low.suggestedMaxFeePerGas * GWEI
	};
};
