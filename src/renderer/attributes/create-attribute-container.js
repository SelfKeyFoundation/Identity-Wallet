import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { identitySelectors, identityOperations } from 'common/identity';
import CreateAttribute from './create-attribute';

class CreateAttributeContainerComponent extends PureComponent {
	handleSave = attribute => {
		this.props.dispatch(
			identityOperations.createIdAttributeOperation(attribute, this.props.identityId)
		);
	};
	handleCancel = () => {
		if (this.props.onClose) return this.props.onClose();
	};
	render() {
		let {
			types = [],
			open = true,
			text,
			subtitle,
			uiSchemas,
			typeId,
			isDocument,
			documentsAndInformation,
			attributeOptions = {}
		} = this.props;

		if (!text) {
			if (isDocument) {
				text = 'Add Document';
			} else {
				text = 'Add Information';
			}
		}

		if (!subtitle) {
			if (documentsAndInformation) {
				subtitle = 'Attribute Type *';
			} else if (isDocument) {
				subtitle = 'Document Type *';
			} else {
				subtitle = 'Information Type *';
			}
		}

		if (types.length === 1) {
			typeId = types[0].id;
		}

		return (
			<CreateAttribute
				open={open}
				text={text}
				subtitle={subtitle}
				onSave={this.handleSave}
				onCancel={this.handleCancel}
				types={types}
				attributeOptions={attributeOptions}
				uiSchemas={uiSchemas}
				isDocument={isDocument}
				documentsAndInformation={documentsAndInformation}
				typeId={typeId}
			/>
		);
	}
}

const typesSelector = identitySelectors.selectAttributeTypesByUrlsFactory();

const mapStateToProps = (state, props) => {
	let entityType = 'individual';

	const identity = identitySelectors.selectIdentity(state, { identityId: props.identityId });

	if (identity) {
		entityType = identity.type;
	}

	if (props.corporate) {
		entityType = 'corporate';
	}

	let types;

	if (props.attributeTypeUrls && props.attributeTypeUrls.length) {
		types = typesSelector(state, { attributeTypeUrls: props.attributeTypeUrls });
	} else {
		types = identitySelectors.selectAttributeTypesFiltered(state, {
			entityType
		});
	}

	return {
		types,
		uiSchemas: identitySelectors.selectUiSchemas(state)
	};
};

export const CreateAttributeContainer = connect(mapStateToProps)(CreateAttributeContainerComponent);

export default CreateAttributeContainer;
