import React from 'react';
import Form from 'react-jsonschema-form';
import CustomFileField from './custom-file';

const IdAttributeSchemaForm = ({ attr, type, onClose, onSave }) => {
	attr = attr || {};
	let value = attr.data && attr.data.value ? attr.data.value : attr.data;
	const handleSubmit = ({ formData }) => {
		if (typeof formData !== 'object') {
			formData = { value: formData };
		}
		return onSave({}, formData);
	};

	const uiSchema = {
		'ui:field': 'customFile'
	};

	const fields = {
		customFile: CustomFileField
	};

	return (
		<Form
			schema={type.schema.jsonSchema}
			formData={value}
			onSubmit={handleSubmit}
			uiSchema={uiSchema}
			fields={fields}
		>
			<div className="static-data-actions-wrapper">
				<button type="button" className="md-button outline-gray" onClick={onClose}>
					<span className="primary">cancel</span>
				</button>
				<button type="submit" className="md-button blue">
					<span className="primary">save</span>
				</button>
			</div>
		</Form>
	);
};

export default IdAttributeSchemaForm;
