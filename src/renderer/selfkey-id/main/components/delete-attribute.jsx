import React, { Component } from 'react';

import { Typography, withStyles, Button, Grid } from '@material-ui/core';

const styles = theme => ({});

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
		const { attribute } = this.props;
		const { type, name } = attribute;

		return (
			<Grid container direction="column" spacing={8}>
				<Grid item>
					<Typography variant="h4">
						Are you shour you want to delete this attribute?
					</Typography>
					<Typography variant="body1">Type: {type.content.title}</Typography>
					<Typography variant="body1">Label: {name}</Typography>
				</Grid>
				<Grid item>
					<Grid container spacing={24}>
						<Grid item>
							<Button variant="contained" size="large" onClick={this.handleConfirm}>
								Confirm
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
