import { connect } from 'react-redux';
import { TransactionSendBox } from 'selfkey-ui';
import { getEthGasStationInfo } from 'common/eth-gas-station/selectors';

const mapStateToProps = state => {
	return {
		...getEthGasStationInfo(state)
	};
};

export default connect(mapStateToProps)(TransactionSendBox);
