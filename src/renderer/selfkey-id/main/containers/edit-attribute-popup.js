import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Popup } from '../../../common/popup';
import { identityOperations, identitySelectors } from 'common/identity';
import EditAttribute from '../components/edit-attribute';

class EditAttributePopupComponent extends PureComponent {
	handleSave = attribute => {
		this.props.dispatch(identityOperations.editIdAttributeOperation(attribute));
	};
	handleCancel = () => {
		if (this.props.onClose) return this.props.onClose();
	};
	render() {
		const { open = true, attribute, text = 'Edit Information', uiSchema } = this.props;
		return (
			<Popup open={open} closeAction={this.handleCancel} text={text}>
				<EditAttribute
					onSave={this.handleSave}
					onCancel={this.handleCancel}
					attribute={attribute}
					uiSchema={uiSchema}
				/>
			</Popup>
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
export const EditAttributePopup = connect(mapStateToProps)(EditAttributePopupComponent);

export default EditAttributePopup;
