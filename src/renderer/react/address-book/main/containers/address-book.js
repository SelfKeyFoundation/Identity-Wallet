import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AddressBook } from 'selfkey-ui';
import { addressBookSelectors, addressBookOperations } from 'common/address-book';

class AddressBookContainer extends Component {
	componentDidMount() {
		this.props.dispatch(addressBookOperations.init());
	}

	handleDelete = id => {
		this.props.dispatch(addressBookOperations.deleteAddressBookEntry(id));
	};

	render() {
		return <AddressBook onDelete={this.handleDelete} {...this.props} />;
	}
}

const mapStateToProps = (state, props) => {
	return {
		addresses: addressBookSelectors.getAddresses(state)
	};
};

export default connect(mapStateToProps)(AddressBookContainer);
