import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AddressBookAdd, ModalBox } from 'selfkey-ui';
import { addressBookSelectors, addressBookOperations } from 'common/address-book';

class AddressBookAddContainer extends Component {
	componentDidMount() {
		this.props.dispatch(addressBookOperations.resetAdd());
	}

	handleSave = async (label, address) => {
		await this.props.dispatch(addressBookOperations.addAddressBookEntry({ label, address }));
		this.props.closeAction();
	};

	handleLabelChange = label => {
		this.props.dispatch(addressBookOperations.validateLabel(label));
	};

	handleAddressChange = address => {
		this.props.dispatch(addressBookOperations.validateAddress(address));
	};

	render() {
		return (
			<ModalBox closeAction={this.props.closeAction} headerText="Add Address">
				<AddressBookAdd
					onCancel={this.props.onCancel}
					onSave={this.handleSave}
					onAddressChange={this.handleAddressChange}
					onLabelChange={this.handleLabelChange}
					labelError={this.props.labelError}
					addressError={this.props.addressError}
				/>
			</ModalBox>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		labelError: addressBookSelectors.getLabelError(state),
		addressError: addressBookSelectors.getAddressError(state)
	};
};

export default connect(mapStateToProps)(AddressBookAddContainer);
