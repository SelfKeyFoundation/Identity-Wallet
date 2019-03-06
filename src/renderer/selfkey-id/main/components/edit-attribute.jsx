import _ from 'lodash';
import React, { Component } from 'react';
import { Input, withStyles, Typography, Divider, Button, Grid } from '@material-ui/core';
import { identityAttributes } from 'common/identity/utils';
import Form from 'react-jsonschema-form-material-theme';
import { jsonSchema } from '../../../../common/identity/utils';
import transformErrors from './transform-errors';

const styles = theme => ({
	section1: { marginBottom: '10px' },
	section2: { marginTop: '10px' }
});

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
		this.state = {
			title,
			schema,
			label: name,
			value,
			type,
			attribute,
			uiSchema,
			disabled: false
		};
	}
	handleSave = ({ errors }) => {
		let { label, value, schema, attribute, disabled } = this.state;
		if (!!errors.length || disabled) {
			return this.setState({ errors, disabled: !!errors.length });
		}
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
	handleFormChange = prop => ({ formData, errors }) => {
		const disabled = !!errors.length;
		this.setState({ [prop]: formData, disabled });
	};
	render() {
		const { type, label, value, schema, title, uiSchema, disabled } = this.state;
		const { classes } = this.props;
		return (
			<React.Fragment>
				<div className={classes.section1}>
					<Typography variant="overline" gutterBottom>
						{title}
					</Typography>
					<Input
						label="Label"
						placeholder="Internal naming for the information you are adding"
						type="text"
						value={label}
						margin="normal"
						variant="outlined"
						onChange={this.handleFieldChange('label')}
						fullWidth
					/>
				</div>
				{type && <Divider variant="middle" />}
				{type && (
					<div className={classes.section2}>
						<Form
							schema={_.omit(jsonSchema.removeMeta(schema), ['title'])}
							uiSchema={uiSchema.content}
							formData={value}
							liveValidate={true}
							showErrorList={false}
							onChange={this.handleFormChange('value')}
							onSubmit={this.handleSave}
							transformErrors={transformErrors}
						>
							<Grid container spacing={24}>
								<Grid item>
									<Button
										variant="contained"
										size="large"
										disabled={disabled}
										type="submit"
									>
										Save
									</Button>
								</Grid>

								<Grid item>
									<Button
										variant="outlined"
										size="large"
										onClick={this.handleCancel}
									>
										Cancel
									</Button>
								</Grid>
							</Grid>
						</Form>
					</div>
				)}
			</React.Fragment>
		);
	}
}

export const EditAttribute = withStyles(styles)(EditAttributeComponent);

export default EditAttribute;
