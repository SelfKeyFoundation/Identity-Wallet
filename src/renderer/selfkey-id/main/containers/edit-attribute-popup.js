import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Popup } from '../../../common/popup';
import EditAttribute from '../components/edit-attribute';

class EditAttributePopupComponent extends Component {
	handlCreateAttributeContainer = () => {
		console.log('XXX create clicked');
	};
	handleCancel = () => {
		if (this.props.onClose) return this.props.onClose();
	};
	render() {
		const { open = true, attribute, type, text = 'Edit information' } = this.props;
		return (
			<Popup open={open} closeAction={this.handleCancel} text={text}>
				<EditAttribute
					handleCreate={this.handleCreate}
					handleCancel={this.handleCancel}
					attribute={attribute}
					type={type}
				/>
			</Popup>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {};
};
export const EditAttributePopup = connect(mapStateToProps)(EditAttributePopupComponent);

export default EditAttributePopup;
