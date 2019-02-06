import React, { Component } from 'react';
import { connect } from 'react-redux';
import { identitySelectors, identityOperations } from 'common/identity';
import { Popup } from '../../../common/popup';
import CreateAttribute from '../components/create-attribute';

class CreateAttributePopupComponent extends Component {
	handleSave = attribute => {
		this.props.dispatch(identityOperations.createIdAttributeOperation(attribute));
	};
	handleCancel = () => {
		if (this.props.onClose) return this.props.onClose();
	};
	render() {
		const { types, open = true, text = 'Add Information', uiSchemas } = this.props;
		return (
			<Popup open={open} closeAction={this.handleCancel} text={text}>
				<CreateAttribute
					onSave={this.handleSave}
					onCancel={this.handleCancel}
					types={types}
					uiSchemas={uiSchemas}
				/>
			</Popup>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		types: identitySelectors.selectIdAttributeTypes(state),
		uiSchemas: identitySelectors.selectUiSchemas(state)
	};
};
export const CreateAttributePopup = connect(mapStateToProps)(CreateAttributePopupComponent);

export default CreateAttributePopup;
