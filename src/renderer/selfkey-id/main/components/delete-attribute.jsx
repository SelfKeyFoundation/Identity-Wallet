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
					<Typography variant="body1" gutterBottom>
						You are deleting this information and all related history. Once deleted, you
						cannot recover the history.
					</Typography>
					<Typography variant="body2">Type: {type.content.title}</Typography>
					<Typography variant="body2" gutterBottom>
						Label: {name}
					</Typography>
				</Grid>
				<Grid item>
					<Grid container spacing={24}>
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
