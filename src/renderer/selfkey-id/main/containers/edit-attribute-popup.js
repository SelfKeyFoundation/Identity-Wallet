import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Popup } from '../../../common/popup';
import { identityOperations } from 'common/identity';
import EditAttribute from '../components/edit-attribute';

class EditAttributePopupComponent extends PureComponent {
	handleSave = attribute => {
		this.props.dispatch(identityOperations.editIdAttributeOperation(attribute));
	};
	handleCancel = () => {
		if (this.props.onClose) return this.props.onClose();
	};
	render() {
		const { open = true, attribute, type, text = 'Edit information' } = this.props;
		return (
			<Popup open={open} closeAction={this.handleCancel} text={text}>
				<EditAttribute
					onSave={this.handleSave}
					onCancel={this.handleCancel}
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
