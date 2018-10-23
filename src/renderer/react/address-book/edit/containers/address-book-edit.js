import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AddressBookEdit, ModalBox } from 'selfkey-ui';
import { addressBookSelectors, addressBookOperations } from 'common/address-book';

class AddressBookEditContainer extends Component {
	componentDidMount() {
		this.props.dispatch(addressBookOperations.initEdit());
	}

	handleSave = async label => {
		const id = this.props.id;
		await this.props.dispatch(addressBookOperations.editAddressBookEntry({ id, label }));
		this.props.closeAction();
	};

	handleLabelChange = label => {
		this.props.dispatch(addressBookOperations.validateLabel(label));
	};

	render() {
		return (
			<ModalBox closeAction={this.props.closeAction} headerText="Edit Label">
				<AddressBookEdit
					onCancel={this.props.onCancel}
					onSave={this.handleSave}
					onLabelChange={this.handleLabelChange}
					labelError={this.props.labelError}
					label={this.props.label}
				/>
			</ModalBox>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		labelError: addressBookSelectors.getLabelError(state),
		label: addressBookSelectors.getLabel(state, props.id)
	};
};

export default connect(mapStateToProps)(AddressBookEditContainer);
