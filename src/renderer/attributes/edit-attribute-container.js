import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { identityOperations, identitySelectors } from 'common/identity';
import EditAttribute from './edit-attribute';

class EditAttributeContainerComponent extends PureComponent {
	handleSave = attribute => {
		this.props.dispatch(identityOperations.editIdAttributeOperation(attribute));
	};
	handleCancel = () => {
		if (this.props.onClose) return this.props.onClose();
	};
	render() {
		const { open = true, attribute, text = 'Edit Information', uiSchema } = this.props;
		return (
			<EditAttribute
				open={open}
				text={text}
				onSave={this.handleSave}
				onCancel={this.handleCancel}
				attribute={attribute}
				uiSchema={uiSchema}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { attribute } = props;
	let uiSchema = null;
	if (attribute) {
		uiSchema = identitySelectors.selectUiSchema(
			state,
			attribute.type.id,
			attribute.type.defaultRepositoryId
		);
	}
	return {
		uiSchema
	};
};
export const EditAttributeContainer = connect(mapStateToProps)(EditAttributeContainerComponent);

export default EditAttributeContainer;
