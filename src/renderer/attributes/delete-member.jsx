import React, { PureComponent } from 'react';
import { Typography, withStyles, Button, Grid } from '@material-ui/core';
import { Popup } from '../common/popup';

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

class DeleteMemberComponent extends PureComponent {
	state = { typeId: -1, label: '', value: null };
	handleConfirm = evt => {
		evt.preventDefault();
		const { member } = this.props;
		this.props.onConfirm(member);
		this.props.onCancel();
	};
	handleCancel = () => {
		this.props.onCancel();
	};
	render() {
		const { classes, open, text } = this.props;

		return (
			<Popup open={open} closeAction={this.handleCancel} isHeaderVisible={false}>
				<Grid container direction="column" spacing={8}>
					<Grid item>
						<Typography variant="h2">{text}</Typography>
					</Grid>
					<Grid item>
						<Typography variant="subtitle2" color="secondary">
							You are deleting this information and all related history. Once deleted,
							you can not recover the history.
						</Typography>
					</Grid>
					<Grid item>
						<Grid container spacing={24} className={classes.buttonContainer}>
							<Grid item>
								<Button
									variant="contained"
									size="large"
									onClick={this.handleConfirm}
								>
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
			</Popup>
		);
	}
}

export const DeleteMember = withStyles(styles)(DeleteMemberComponent);

export default DeleteMember;
