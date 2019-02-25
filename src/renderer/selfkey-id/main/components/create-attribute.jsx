import _ from 'lodash';
import React, { Component } from 'react';
import { withTheme } from 'react-jsonschema-form';
import { TextField, withStyles, Divider, Button, Grid, MenuItem } from '@material-ui/core';
import { identityAttributes } from 'common/identity/utils';
import theme from 'react-jsonschema-form-material-theme';
import { jsonSchema } from '../../../../common/identity/utils';
import transformErrors from './transform-errors';

const Form = withTheme('MyTheme', {
	widgets: theme.widgets,
	templates: theme.templates
});

const styles = theme => ({
	section1: { marginBottom: '10px' },
	section2: { marginTop: '10px' }
});

class CreateAttributeComponent extends Component {
	state = { typeId: -1, label: '', value: null, disabled: false };
	handleSave = ({ errors }) => {
		let { typeId, label, value, disabled } = this.state;
		if (!!errors.length || disabled) {
			return this.setState({ errors, disabled: !!errors.length });
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
	hadnleFieldChange = prop => evt => {
		let { value } = this.state;
		if (prop === 'typeId') value = null;
		this.setState({ [prop]: evt.target.value, value });
	};
	handleFormChange = prop => ({ formData, errors }) => {
		const disabled = !!errors.length;
		this.setState({ [prop]: formData, disabled });
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
	render() {
		const { types, classes } = this.props;
		const { typeId, label, value, disabled } = this.state;
		const type = this.type;
		const uiSchema = this.uiSchema;
		return (
			<React.Fragment>
				<div className={classes.section1}>
					<TextField
						select
						label="Information"
						placeholder="Information"
						margin="normal"
						fullWidth
						value={typeId}
						variant="filled"
						onChange={this.hadnleFieldChange('typeId')}
					>
						<MenuItem value={-1}>
							<em>Choose...</em>
						</MenuItem>
						{types.map(option => (
							<MenuItem key={option.id} value={option.id}>
								{option.content.title}
							</MenuItem>
						))}
					</TextField>
					<TextField
						label="Label"
						value={label}
						margin="normal"
						variant="filled"
						onChange={this.hadnleFieldChange('label')}
						fullWidth
					/>
				</div>
				{type && <Divider variant="middle" />}
				{type && (
					<div className={classes.section2}>
						<Form
							schema={_.omit(jsonSchema.removeMeta(type.content), ['title'])}
							formData={value}
							uiSchema={uiSchema.content}
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
