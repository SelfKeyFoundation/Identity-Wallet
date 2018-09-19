import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransactionSendBox } from 'selfkey-ui';
import { ethGasStationInfoOperations, ethGasStationInfoSelectors } from 'common/eth-gas-station';
import Web3Service from 'main/blockchain/web3-service';

const web3Service = new Web3Service();
const web3Utils = web3Service.constructor.web3.utils;

class TransactionSendBoxContainer extends Component {
	componentDidMount() {
		this.loadData();
	}

	loadData() {
		const { dispatch } = this.props;
		dispatch(ethGasStationInfoOperations.loadData());
	}

	onSendAction(data) {
		console.log('dsadasdasdasdasdas', data);
		this.startSend();
	}

	validateEthAddress(field = { value: '' }) {
		let check;
		try {
			let toChecksumAddress = web3Utils.toChecksumAddress(field.value);
			check = web3Utils.isHex(field.value) && web3Utils.isAddress(toChecksumAddress);
		} catch (e) {
			check = false;
		}
		console.log('check!!!', check);
	}

	render() {
		return (
			<TransactionSendBox
				onAddressFieldChange={this.validateEthAddress}
				onSendAction={this.onSendAction}
				{...this.props}
				reloadEthGasStationInfoAction={this.loadData.bind(this)}
			/>
		);
	}
}

const mapStateToProps = state => {
	return {
		...ethGasStationInfoSelectors.getEthGasStationInfo(state)
	};
};

export default connect(mapStateToProps)(TransactionSendBoxContainer);
