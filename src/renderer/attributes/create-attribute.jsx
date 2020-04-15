import _ from 'lodash';
import React, { PureComponent } from 'react';
import { withStyles, Divider, Button, Grid, Select, Typography, Input } from '@material-ui/core';
import { identityAttributes, jsonSchema } from 'common/identity/utils';
import Form from 'react-jsonschema-form-material-theme';
import transformErrors from './transform-errors';
import { Popup } from '../common/popup';
import { KeyboardArrowDown } from '@material-ui/icons';
import { canCreate } from '../corporate/common/common-helpers';

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
	},
	selectItem: {
		border: 0,
		backgroundColor: '#1E262E !important',
		color: '#FFFFFF !important'
	},
	disableTransparency: {
		'& > div:first-of-type': {
			background: 'linear-gradient(135deg, rgba(43,53,64,1) 0%, rgba(30,38,46,1) 100%)',
			opacity: '1 !important'
		}
	}
});

class CreateAttributeComponent extends PureComponent {
	state = {
		typeId: -1,
		label: '',
		errorLabel: null,
		value: undefined,
		disabled: false,
		liveValidate: false,
		documentError: null
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
		const documentError = identityAttributes.getDocumentsErrors(normalized.documents);

		if (documentError) {
			return this.setState({
				documentError: documentError
			});
		}

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

	getTypes = _.memoize((isDocument, types, attributeOptions) =>
		(isDocument
			? types.filter(type => jsonSchema.containsFile(type.content))
			: types.filter(type => !jsonSchema.containsFile(type.content))
		)
			.filter(type => canCreate(type, attributeOptions))
			.sort((a, b) =>
				a.content.title > b.content.title ? 1 : a.content.title === b.content.title ? 0 : -1
			)
	);

	get types() {
		return this.getTypes(this.props.isDocument, this.props.types, this.props.attributeOptions);
	}
	render() {
		const { classes, subtitle, open, text } = this.props;
		const types = this.types;
		const { typeId, label, value, disabled, liveValidate } = this.state;
		const type = this.type;
		const uiSchema = this.uiSchema;
		return (
			<Popup
				open={open}
				closeAction={this.handleCancel}
				text={text}
				className={classes.disableTransparency}
			>
				<div className={classes.section1}>
					<Typography variant="overline" className={classes.label}>
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
						<option value={-1} className={classes.selectItem}>
							Choose...
						</option>
						{types.map(option => (
							<option
								key={option.id}
								value={option.id}
								className={classes.selectItem}
							>
								{option.content.title}
							</option>
						))}
					</Select>
					<Divider className={classes.divider} />
					{this.state.typeId > -1 && (
						<React.Fragment>
							<Typography variant="overline" className={classes.label}>
								Label *
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
						</React.Fragment>
					)}
				</div>
				{type && <Divider className={classes.divider} />}
				{type && (
					<div className={classes.section2}>
						<Typography variant="overline" className={classes.label}>
							Content
						</Typography>
						<Form
							schema={_.omit(jsonSchema.removeMeta(type.content), ['title'])}
							formData={value}
							uiSchema={uiSchema.content}
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
							<Grid container spacing={3} className={classes.buttonContainer}>
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
			</Popup>
		);
	}
}

export const CreateAttribute = withStyles(styles)(CreateAttributeComponent);

export default CreateAttribute;
