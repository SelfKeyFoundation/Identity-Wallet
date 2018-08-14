import React from 'react';
import Form from 'react-jsonschema-form';

export const IdAttributeSchemaForm = ({ attr, type, onClose, onSave }) => {
	attr = attr || {};
	let value = attr.data && attr.data.value ? attr.data.value : attr.data;
	const handleSubmit = ({ formData }) => {
		if (typeof formData !== 'object') {
			formData = { value: formData };
		}
		return onSave({}, formData);
	};
	return (
		<Form schema={type.schema} formData={value} onSubmit={handleSubmit}>
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
