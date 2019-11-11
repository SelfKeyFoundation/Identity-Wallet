import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { memoizedIdentitySelectors, identityOperations } from 'common/identity';
import CreateAttribute from './create-attribute';

class CreateAttributeContainerComponent extends PureComponent {
	handleSave = attribute => {
		this.props.dispatch(identityOperations.createIdAttributeOperation(attribute));
	};
	handleCancel = () => {
		if (this.props.onClose) return this.props.onClose();
	};
	render() {
		let { types, open = true, text, subtitle, uiSchemas, typeId, isDocument } = this.props;

		if (!text) {
			if (isDocument) {
				text = 'Add Document';
			} else {
				text = 'Add Information';
			}
		}

		if (!subtitle) {
			if (isDocument) {
				subtitle = 'Document Type *';
			} else {
				subtitle = 'Information Type *';
			}
		}

		return (
			<CreateAttribute
				open={open}
				text={text}
				subtitle={subtitle}
				onSave={this.handleSave}
				onCancel={this.handleCancel}
				types={types}
				uiSchemas={uiSchemas}
				isDocument={isDocument}
				typeId={typeId}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		types: memoizedIdentitySelectors.selectAttributeTypesFiltered(state, {
			entityType: props.corporate ? 'corporate' : 'individual'
		}),
		uiSchemas: memoizedIdentitySelectors.selectUiSchemas(state)
	};
};

export const CreateAttributeContainer = connect(mapStateToProps)(CreateAttributeContainerComponent);

export default CreateAttributeContainer;
