import _ from 'lodash';
import React, { Component } from 'react';
import {
	withStyles,
	Divider,
	Button,
	Grid,
	MenuItem,
	Select,
	Typography,
	Input
} from '@material-ui/core';
import { identityAttributes, jsonSchema } from 'common/identity/utils';
import Form from 'react-jsonschema-form-material-theme';
import transformErrors from './transform-errors';
import { KeyboardArrowDown } from '@material-ui/icons';

const styles = theme => ({
	section1: { marginBottom: '10px' },
	section2: { marginTop: '10px' }
});

class CreateAttributeComponent extends Component {
	state = {
		typeId: -1,
		label: '',
		errorLabel: null,
		value: undefined,
		disabled: false,
		liveValidate: false
	};
	componentDidMount() {
		this.setState({ typeId: this.props.typeId });
	}
	handleSave = ({ errors }) => {
		let { typeId, label, value, disabled } = this.state;
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
		const type = this.type;
		const normalized = identityAttributes.normalizeDocumentsSchema(type.content, value);
		this.props.onSave({
			typeId,
			name: label,
			data: { value: normalized.value },
			documents: normalized.documents
		});
		this.props.onCancel();
	};
	handleCancel = () => {
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
	handleFieldChange = prop => evt => {
		let { value, errors, liveValidate } = this.state;
		if (prop === 'typeId') value = undefined;
		this.setState({ [prop]: evt.target.value, value });
		if (liveValidate) this.handleErrors(errors);
	};
	handleFormChange = prop => ({ formData, errors }) => {
		this.setState({ [prop]: formData });
		if (this.state.liveValidate) this.handleErrors(errors);
	};
	get type() {
		if (!this.state.typeId) return null;
		return this.props.types.find(type => type.id === this.state.typeId);
	}
	get uiSchema() {
		const type = this.type;
		if (!type) return null;
		return (
			this.props.uiSchemas.find(
				ui => ui.repositoryId === type.defaultRepositoryId && ui.attributeTypeId === type.id
			) || {}
		);
	}

	get types() {
		return this.props.isDocument
			? this.props.types.filter(type => jsonSchema.containsFile(type.content))
			: this.props.types.filter(type => !jsonSchema.containsFile(type.content));
	}
	render() {
		const { classes, subtitle } = this.props;
		const types = this.types;
		const { typeId, label, value, disabled, liveValidate } = this.state;
		const type = this.type;
		const uiSchema = this.uiSchema;
		return (
			<React.Fragment>
				<div className={classes.section1}>
					<Typography variant="overline" gutterBottom>
						{subtitle}
					</Typography>
					<Select
						select
						fullWidth
						value={typeId}
						onChange={this.handleFieldChange('typeId')}
						displayEmpty
						disableUnderline
						IconComponent={KeyboardArrowDown}
						input={<Input disableUnderline gutterBottom />}
					>
						<MenuItem value={-1}>
							<em>Choose...</em>
						</MenuItem>
						{types.map(option => (
							<MenuItem key={option.id} value={option.id}>
								{option.content.title}
							</MenuItem>
						))}
					</Select>

					{this.state.typeId > -1 && (
						<>
							<br />
							<br />
							<Typography variant="overline" gutterBottom>
								Label
							</Typography>
							<Input
								error={!!this.state.errorLabel}
								label="Label"
								value={label}
								variant="filled"
								onChange={this.handleFieldChange('label')}
								onBlur={this.handleFieldChange('label')}
								fullWidth
							/>
							{this.state.errorLabel && (
								<Typography variant="subtitle2" color="error" gutterBottom>
									{this.state.errorLabel}
								</Typography>
							)}
						</>
					)}
				</div>
				{type && <Divider variant="middle" />}
				{type && (
					<div className={classes.section2}>
						<Form
							schema={_.omit(jsonSchema.removeMeta(type.content), ['title'])}
							formData={value}
							uiSchema={uiSchema.content}
							liveValidate={liveValidate}
							showErrorList={false}
							onChange={this.handleFormChange('value')}
							onSubmit={this.handleSave}
							onError={this.handleErrors}
							transformErrors={transformErrors}
						>
							<Grid container spacing={24}>
								<Grid item>
									<Button
										variant="contained"
										size="large"
										type="submit"
										disabled={disabled}
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

export const CreateAttribute = withStyles(styles)(CreateAttributeComponent);

export default CreateAttribute;
