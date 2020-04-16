import _ from 'lodash';
import React, { PureComponent } from 'react';
import { Input, Typography, Divider, Button, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Popup } from '../common/popup';
import { identityAttributes, jsonSchema } from 'common/identity/utils';
import Form from 'react-jsonschema-form-material-theme';
import transformErrors from './transform-errors';

const styles = theme => ({
	section1: { marginBottom: '10px' },
	section2: { marginTop: '10px' },
	buttonContainer: {
		margin: '40px -12px 0'
	},
	label: {
		marginBottom: '10px'
	},
	divider: {
		margin: '30px 0'
	}
});

class EditAttributeComponent extends PureComponent {
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
			errorLabel: null,
			documentError: null,
			value,
			type,
			attribute,
			uiSchema,
			disabled: false,
			liveValidate: false
		};
	}
	handleSave = ({ errors }) => {
		let { label, value, schema, attribute, disabled } = this.state;
		if (!label) {
			return this.setState({
				errorLabel: 'Label is required',
				disabled: true,
				liveValidate: true,
				errors
			});
		}
		if (!!errors.length || disabled) {
			return this.setState({
				errors,
				disabled: !!errors.length,
				liveValidate: true,
				errorLabel: null
			});
		}
		const normalized = identityAttributes.normalizeDocumentsSchema(schema, value, []);
		const documentError = identityAttributes.getDocumentsErrors(normalized.documents);

		if (documentError) {
			return this.setState({
				documentError: documentError
			});
		}

		const newAttr = {
			...attribute,
			name: label,
			data: { value: normalized.value },
			documents: normalized.documents
		};
		this.props.onSave(newAttr);
		this.props.onCancel();
	};
	handleErrors = errors => {
		let { label, disabled } = this.state;
		if (!label) {
			this.setState({
				errorLabel: 'Label is required',
				disabled: true,
				liveValidate: true,
				errors
			});
			return true;
		}
		if (!!errors.length || disabled) {
			this.setState({
				errorLabel: null,
				errors,
				disabled: !!errors.length,
				liveValidate: true
			});
			return true;
		}
		return false;
	};
	handleCancel = () => {
		this.props.onCancel();
	};
	handleFieldChange = prop => evt => {
		let { value, errors, liveValidate } = this.state;
		let propValue = evt.target.value;
		if (prop === 'typeId') {
			value = undefined;
			propValue = +propValue;
		}
		this.setState({ [prop]: propValue, value });
		if (liveValidate) this.handleErrors(errors);
	};
	handleFormChange = prop => ({ formData, errors }) => {
		this.setState({ [prop]: formData });
		if (this.state.liveValidate) this.handleErrors(errors);
	};
	render() {
		const { type, label, value, schema, title, uiSchema, disabled, liveValidate } = this.state;
		const { classes, open, text } = this.props;
		return (
			<Popup open={open} closeAction={this.handleCancel} text={text}>
				<div className={classes.section1}>
					<Typography variant="overline" className={classes.label}>
						Type
					</Typography>
					<Input
						label="Type"
						type="text"
						value={title}
						variant="filled"
						fullWidth
						disabled
					/>
					<Divider className={classes.divider} />
					<Typography variant="overline" className={classes.label}>
						Label
					</Typography>
					<Input
						label="Label"
						placeholder="Internal naming for the information you are adding"
						type="text"
						value={label}
						variant="filled"
						error={!!this.state.errorLabel}
						onChange={this.handleFieldChange('label')}
						onBlur={this.handleFieldChange('label')}
						fullWidth
					/>
					{this.state.errorLabel && (
						<Typography variant="subtitle2" color="error" gutterBottom>
							{this.state.errorLabel}
						</Typography>
					)}
				</div>
				{type && <Divider className={classes.divider} />}
				{type && (
					<div className={classes.section2}>
						<Typography variant="overline" className={classes.label}>
							Content
						</Typography>
						<Form
							schema={_.omit(jsonSchema.removeMeta(schema), ['title'])}
							uiSchema={uiSchema.content}
							formData={value}
							liveValidate={liveValidate}
							noHtml5Validate={true}
							showErrorList={false}
							onChange={this.handleFormChange('value')}
							onSubmit={this.handleSave}
							onError={this.handleErrors}
							transformErrors={transformErrors}
							onPDFOpen={file => window.openPDF(file.content || file.url)}
						>
							{this.state.documentError && (
								<Typography variant="subtitle2" color="error" gutterBottom>
									{this.state.documentError}
								</Typography>
							)}
							<Grid container spacing={24} className={classes.buttonContainer}>
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
			</Popup>
		);
	}
}

export const EditAttribute = withStyles(styles)(EditAttributeComponent);

export default EditAttribute;
