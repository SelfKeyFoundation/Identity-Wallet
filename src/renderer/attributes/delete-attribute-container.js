import React, { Component } from 'react';
import { connect } from 'react-redux';
import { identityOperations } from 'common/identity';
import DeleteAttribute from './delete-attribute';

class DeleteAttributeContainerComponent extends Component {
	handleConfirm = attributeId => {
		this.props.dispatch(identityOperations.removeIdAttributeOperation(attributeId));
	};
	handleCancel = () => {
		if (this.props.onClose) return this.props.onClose();
	};
	render() {
		const { attribute, open = true, text = 'Delete Information and History' } = this.props;
		return (
			<DeleteAttribute
				open={open}
				text={text}
				onConfirm={this.handleConfirm}
				onCancel={this.handleCancel}
				attribute={attribute}
			/>
		);
	}
}

const mapStateToProps = (state, props) => ({});
export const DeleteAttributeContainer = connect(mapStateToProps)(DeleteAttributeContainerComponent);

export default DeleteAttributeContainer;
