import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransactionSendBox } from 'selfkey-ui';
import { ethGasStationInfoOperations, ethGasStationInfoSelectors } from 'common/eth-gas-station';

class TransactionSendBoxContainer extends Component {
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(ethGasStationInfoOperations.loadData());
	}

	render() {
		return <TransactionSendBox {...this.props} />;
	}
}

const mapStateToProps = state => {
	return {
		...ethGasStationInfoSelectors.getEthGasStationInfo(state)
	};
};

export default connect(mapStateToProps)(TransactionSendBoxContainer);
