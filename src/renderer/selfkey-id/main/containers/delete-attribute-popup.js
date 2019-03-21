import React, { Component } from 'react';
import { connect } from 'react-redux';
import { identityOperations } from 'common/identity';
import { Popup } from '../../../common/popup';
import DeleteAttribute from '../components/delete-attribute';

class DeleteAttributePopupComponent extends Component {
	handleConfirm = attributeId => {
		this.props.dispatch(identityOperations.removeIdAttributeOperation(attributeId));
	};
	handleCancel = () => {
		if (this.props.onClose) return this.props.onClose();
	};
	render() {
		const { attribute, open = true, text = 'Delete Information and History' } = this.props;
		return (
			<Popup open={open} closeAction={this.handleCancel} text={text}>
				<DeleteAttribute
					onConfirm={this.handleConfirm}
					onCancel={this.handleCancel}
					attribute={attribute}
				/>
			</Popup>
		);
	}
}

const mapStateToProps = (state, props) => ({});
export const DeleteAttributePopup = connect(mapStateToProps)(DeleteAttributePopupComponent);

export default DeleteAttributePopup;
