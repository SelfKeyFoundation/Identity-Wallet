const GWEI = 1000000000;

export const getEthGasStationInfo = ({ ethGasStationInfo }) => ethGasStationInfo;
export const getEthGasStationInfoWEI = ({ ethGasStationInfo }) => {
	return {
		average: ethGasStationInfo.ethGasStationInfo.average * GWEI,
		fast: ethGasStationInfo.ethGasStationInfo.fast * GWEI,
		safeLow: ethGasStationInfo.ethGasStationInfo.safeLow * GWEI
	};
};
export const getEthFeeInfo = ({ ethGasStationInfo }) => ethGasStationInfo.ethGasStationInfo.fees;
export const getEthFeeInfoWEI = ({ ethGasStationInfo }) => {
	return {
		medium: ethGasStationInfo.ethGasStationInfo.fees.medium.suggestedMaxFeePerGas * GWEI,
		high: ethGasStationInfo.ethGasStationInfo.fees.high.suggestedMaxFeePerGas * GWEI,
		low: ethGasStationInfo.ethGasStationInfo.fees.low.suggestedMaxFeePerGas * GWEI
	};
};
