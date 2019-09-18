import React, { Component } from 'react';
import { CorporateAddMember } from './corporate-add-member';
import { connect } from 'react-redux';
import { addressBookSelectors, addressBookOperations } from 'common/address-book';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';

const styles = theme => ({
	radioBoxContainer: {
		margin: '10px 0 40px'
	}
});

class CorporateAddMemberContainer extends Component {
	state = {
		label: '',
		address: ''
	};

	componentDidMount() {
		this.props.dispatch(addressBookOperations.resetAdd());
	}

	handleSubmit = event => {
		event.preventDefault();
		return this.handleSave(this.state.label, this.state.address);
	};

	handleSave = async (label, address) => {
		await this.props.dispatch(addressBookOperations.addAddressBookEntry({ label, address }));
		this.closeAction();
	};

	handleLabelChange = event => {
		event.preventDefault();
		const label = event.target.value;
		this.setState({
			...this.state,
			label
		});
		this.props.dispatch(addressBookOperations.validateLabel(label));
	};

	handleAddressChange = event => {
		event.preventDefault();
		const address = event.target.value;
		this.setState({
			...this.state,
			address
		});
		this.props.dispatch(addressBookOperations.validateAddress(address));
	};

	closeAction = () => {
		this.props.dispatch(push('/main/create-corporate-profile'));
	};

	render() {
		return (
			<CorporateAddMember
				{...this.props}
				onContinueClick={this.handleContinueClick}
				onCancelClick={this.handleCancelClick}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		labelError: addressBookSelectors.getLabelError(state),
		addressError: addressBookSelectors.getAddressError(state)
	};
};

const styledComponent = withStyles(styles)(CorporateAddMemberContainer);
export default connect(mapStateToProps)(styledComponent);
