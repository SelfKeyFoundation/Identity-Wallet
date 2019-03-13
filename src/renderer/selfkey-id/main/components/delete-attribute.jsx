import React, { Component } from 'react';

import { Input, Typography, withStyles, Button, Grid } from '@material-ui/core';

const styles = theme => ({
	text: {
		fontFamily: 'Lato, arial, sans-serif',
		fontSize: '14px',
		color: '#93b0c1',
		marginBottom: '10px'
	},
	label: {
		marginBottom: '20px',
		marginTop: '20px'
	},
	buttonContainer: {
		margin: '20px -12px 0'
	}
});

class DeleteAttributeComponent extends Component {
	state = { typeId: -1, label: '', value: null };
	handleConfirm = evt => {
		evt.preventDefault();
		const { attribute } = this.props;
		this.props.onConfirm(attribute.id);
		this.props.onCancel();
	};
	handleCancel = () => {
		this.props.onCancel();
	};
	render() {
		const { attribute, classes } = this.props;
		const { type, name } = attribute;

		return (
			<Grid container direction="column" spacing={8}>
				<Grid item>
					<Typography variant="outlined" className={classes.text}>
						You are deleting this information and all related history. Once deleted, you{' '}
						can not recover the history.
					</Typography>
					<Typography variant="overline" className={classes.label}>
						Type
					</Typography>
					<Input
						label="Type"
						type="text"
						value={type.content.title}
						variant="filled"
						fullWidth
						disabled
					/>
					<Typography variant="overline" className={classes.label}>
						Label
					</Typography>
					<Input
						label="Label"
						type="text"
						value={name}
						variant="filled"
						fullWidth
						disabled
					/>
				</Grid>
				<Grid item>
					<Grid container spacing={24} className={classes.buttonContainer}>
						<Grid item>
							<Button variant="contained" size="large" onClick={this.handleConfirm}>
								Delete Information
							</Button>
						</Grid>

						<Grid item>
							<Button variant="outlined" size="large" onClick={this.handleCancel}>
								Cancel
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export const DeleteAttribute = withStyles(styles)(DeleteAttributeComponent);

export default DeleteAttribute;
