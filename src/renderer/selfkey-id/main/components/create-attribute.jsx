import React, { Component } from 'react';
import { TextField, MenuItem, withStyles, Divider } from '@material-ui/core';
import { withTheme } from 'react-jsonschema-form';
import theme from 'react-jsonschema-form-material-theme';

const Form = withTheme('MyTheme', {
	widgets: theme.widgets,
	templates: theme.templates
});

const styles = theme => ({});

class CreateAttributeComponent extends Component {
	state = { typeId: -1, label: '' };

	handleSave = () => {
		this.props.onSave();
		this.props.onCancel();
	};
	handleCancel = () => {
		this.props.onCancel();
	};
	hadnleFieldChange = prop => evt => {
		this.setState({ [prop]: evt.target.value });
	};
	get type() {
		if (!this.state.typeId) return null;
		return this.props.types.find(type => type.id === this.state.typeId);
	}
	render() {
		const { types } = this.props;
		const { typeId, label } = this.state;
		const type = this.type;

		return (
			<React.Fragment>
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
				<Divider variant="middle" />
				{type && <Form schema={type.content} />}
			</React.Fragment>
		);
	}
}

export const CreateAttribute = withStyles(styles)(CreateAttributeComponent);

export default CreateAttribute;
