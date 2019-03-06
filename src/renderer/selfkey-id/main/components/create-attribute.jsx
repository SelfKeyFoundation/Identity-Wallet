import _ from 'lodash';
import React, { Component } from 'react';
import { withStyles, Divider, Button, Grid, Select, Typography, Input } from '@material-ui/core';
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

	getType = _.memoize((id, types) => types.find(type => +type.id === +id));
	get type() {
		if (!this.state.typeId) return null;
		return this.getType(this.state.typeId, this.types);
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

	getTypes = _.memoize((isDocument, types) =>
		(isDocument
			? types.filter(type => jsonSchema.containsFile(type.content))
			: types.filter(type => !jsonSchema.containsFile(type.content))
		).sort((a, b) =>
			a.content.title > b.content.title ? 1 : a.content.title === b.content.title ? 0 : -1
		)
	);

	get types() {
		return this.getTypes(this.props.isDocument, this.props.types);
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
						native
						fullWidth
						value={typeId}
						onChange={this.handleFieldChange('typeId')}
						displayEmpty
						IconComponent={KeyboardArrowDown}
					>
						<option value={-1}>Choose...</option>
						{types.map(option => (
							<option key={option.id} value={option.id}>
								{option.content.title}
							</option>
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
								placeholder="Internal naming for the information you are adding "
								type="text"
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
