import React, { Component } from 'react';
import { TextField, withStyles, Typography } from '@material-ui/core';
// import { withTheme } from 'react-jsonschema-form/dist/react-jsonschema-form';
// import theme from 'react-jsonschema-form-material-theme';

// const Form = withTheme('MyTheme', {
// 	widgets: theme.widgets,
// 	templates: theme.templates
// });

const styles = theme => ({
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 16px'
	}
});

class EditAttributeComponent extends Component {
	state = { label: null };

	handlCreateAttributeContainer = () => {
		console.log('XXX create clicked');
	};
	handleCancel = () => {
		console.log('XXX cancel clicked');
	};
	hadnleFieldChange = prop => evt => {
		this.setState({ [prop]: evt.target.value });
	};
	get type() {
		if (!this.state.typeId) return null;
		return this.props.types.find(type => type.id === this.state.typeId);
	}
	render() {
		const { attribute, classes } = this.props;
		const { label } = this.state;
		// const type = this.type;
		return (
			<React.Fragment>
				<Typography variant="h3">{attribute.type.content.title}</Typography>
				<TextField
					label="Label"
					value={label}
					defaultValue={attribute.name}
					margin="normal"
					variant="outlined"
					onChange={this.hadnleFieldChange('label')}
					fullWidth
				/>
				<hr className={classes.hr} />
				{/* type && <Form schema={type.content} formData={{}} /> */}
			</React.Fragment>
		);
	}
}

export const EditAttribute = withStyles(styles)(EditAttributeComponent);

export default EditAttribute;
