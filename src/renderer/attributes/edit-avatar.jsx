/* global FileReader */
import React, { PureComponent } from 'react';
import { ButtonBase, Button, Grid, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { HexagonAvatar } from '../individual/common/hexagon-avatar';
import { Popup } from '../common/popup';

const styles = theme => ({
	buttons: {
		'& button:first-child': {
			marginRight: '20px'
		}
	},
	divider: {
		margin: '60px 0 30px'
	},
	image: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center'
	},
	avatarImage: {
		marginBottom: '30px'
	},
	center: {
		margin: '0 auto'
	},
	newImage: {
		cursor: 'pointer',
		height: '44px',
		opacity: 0,
		position: 'absolute',
		zIndex: 999999
	}
});

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
		this.props.onClose();
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
	handleDeleteAvatar = () => {
		this.setState({ avatar: null });
	};

	render() {
		const { classes, open, onClose, text } = this.props;
		const { avatar } = this.state;

		return (
			<Popup open={open} closeAction={onClose} text={text}>
				<Grid container direction="column">
					<div className={classes.image}>
						<ButtonBase component="label" className={classes.avatarImage}>
							<HexagonAvatar src={avatar} largeSize />
							<input type="file" hidden onChange={this.handleImageChange} />
						</ButtonBase>

						<div className={`${classes.buttons} ${classes.center}`}>
							<Button
								variant="outlined"
								size="large"
								onClick={this.handleDeleteAvatar}
							>
								Delete current
							</Button>
							<Button variant="contained" size="large">
								<input
									type="file"
									onChange={this.handleImageChange}
									className={classes.newImage}
								/>
								Upload new image
							</Button>
						</div>
					</div>
					<Divider className={classes.divider} />
					<div className={classes.buttons}>
						<Button variant="contained" size="large" onClick={this.handleSave}>
							Save
						</Button>

						<Button variant="outlined" size="large" onClick={onClose}>
							Cancel
						</Button>
					</div>
				</Grid>
			</Popup>
		);
	}
}

export const EditAvatar = withStyles(styles)(EditAvatarComponent);
export default EditAvatar;
