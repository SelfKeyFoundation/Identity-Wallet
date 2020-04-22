/* global FileReader */
import React, { PureComponent } from 'react';
import { ButtonBase, Button, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { HexagonAvatar } from './hexagon-avatar';
const styles = theme => ({});

class EditAvatarComponent extends PureComponent {
	constructor(props) {
		super(props);
		const { avatar, identityId } = props;
		this.state = { avatar, identityId };
	}
	handleSave = evt => {
		evt.preventDefault();
		const { identityId, avatar } = this.state;
		this.props.onSave(avatar, identityId);
		this.props.onCancel();
	};
	handleImageChange = evt => {
		const files = evt.target.files;
		const f = files[0];
		const reader = new FileReader();
		reader.readAsDataURL(f);
		reader.onload = () => {
			this.setState({ avatar: reader.result });
		};
	};
	handleCancel = () => {
		this.props.onCancel();
	};
	render() {
		const { avatar } = this.state;

		return (
			<Grid container direction="column" spacing={4}>
				<Grid item container justify="center">
					<ButtonBase component="label">
						<HexagonAvatar src={avatar} />
						<input type="file" hidden onChange={this.handleImageChange} />
					</ButtonBase>
				</Grid>
				<Grid item>
					<Grid container spacing={3}>
						<Grid item>
							<Button variant="contained" size="large" onClick={this.handleSave}>
								Save
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

export const EditAvatar = withStyles(styles)(EditAvatarComponent);

export default EditAvatar;
