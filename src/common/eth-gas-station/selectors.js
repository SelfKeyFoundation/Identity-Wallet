const GWEI = 1000000000;

export const getEthGasStationInfo = ({ ethGasStationInfo }) => ethGasStationInfo;
export const getEthGasStationInfoWEI = ({ ethGasStationInfo }) => ({
	average: ethGasStationInfo.ethGasStationInfo.average * GWEI,
	fast: ethGasStationInfo.ethGasStationInfo.fast * GWEI,
	safeLow: ethGasStationInfo.ethGasStationInfo.safeLow * GWEI
});
