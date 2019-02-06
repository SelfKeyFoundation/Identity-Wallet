import _ from 'lodash';
import React, { Component } from 'react';
import { TextField, withStyles, Typography, Divider, Button, Grid } from '@material-ui/core';
import { identityAttributes } from 'common/identity/utils';
import { withTheme } from 'react-jsonschema-form';
import theme from 'react-jsonschema-form-material-theme';

const Form = withTheme('MyTheme', {
	widgets: theme.widgets,
	templates: theme.templates
});

const styles = theme => ({});

class EditAttributeComponent extends Component {
	constructor(props) {
		super(props);
		const { attribute, uiSchema = {} } = props;
		let { type, data, documents, name } = attribute;
		const schema = type.content;
		const title = type.content.title;
		let value = data ? _.cloneDeep(attribute.data).value : undefined;
		let denormalized = identityAttributes.denormalizeDocumentsSchema(schema, value, documents);
		value = denormalized.value;
		this.state = { title, schema, label: name, value, type, attribute, uiSchema };
	}
	handleSave = () => {
		const { label, value, schema, attribute } = this.state;
		const normalized = identityAttributes.normalizeDocumentsSchema(schema, value, []);
		const newAttr = {
			...attribute,
			name: label,
			data: { value: normalized.value },
			documents: normalized.documents
		};
		this.props.onSave(newAttr);
		this.props.onCancel();
	};
	handleCancel = () => {
		this.props.onCancel();
	};
	handleFieldChange = prop => evt => {
		this.setState({ [prop]: evt.target.value });
	};
	handleFormChange = prop => ({ formData }) => {
		this.setState({ [prop]: formData });
	};
	render() {
		const { type, label, value, schema, title, uiSchema } = this.state;
		return (
			<React.Fragment>
				<Typography variant="h3">{title}</Typography>
				<TextField
					label="Label"
					value={label}
					margin="normal"
					variant="outlined"
					onChange={this.handleFieldChange('label')}
					fullWidth
				/>
				<Divider variant="middle" />
				{type && (
					<Form
						schema={_.omit(schema, ['$id', 'schema'])}
						uiSchema={uiSchema.content}
						formData={value}
						onChange={this.handleFormChange('value')}
					>
						<Grid container spacing={24}>
							<Grid item>
								<Button variant="contained" size="large" onClick={this.handleSave}>
									Save
								</Button>
							</Grid>

							<Grid item>
								<Button variant="outlined" size="large" onClick={this.handleCancel}>
									Cancel
								</Button>
							</Grid>
						</Grid>
					</Form>
				)}
			</React.Fragment>
		);
	}
}

export const EditAttribute = withStyles(styles)(EditAttributeComponent);

export default EditAttribute;
