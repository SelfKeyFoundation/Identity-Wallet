import React from 'react';
import { withStyles } from '@material-ui/core';
import avatarPlaceholder from '../../../../../static/assets/images/icons/icon-add-image.svg';
const styles = theme => ({
	hexagon: {
		cursor: 'pointer',
		height: '120px',
		margin: '0 4px 0 10px',
		overflow: 'hidden',
		transform: 'rotate(120deg)',
		visibility: 'hidden',
		width: '104px'
	},
	hexagonIn: {
		height: '100%',
		overflow: 'hidden',
		transform: 'rotate(-60deg)',
		width: '100%'
	},
	hexagonIn2: {
		backgroundPosition: '50%',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		height: '100%',
		transform: 'rotate(-60deg)',
		visibility: 'visible',
		width: '100%'
	}
});

export const HexagonAvatar = withStyles(styles)(({ classes, src = avatarPlaceholder, onClick }) => (
	<div className={classes.hexagon} onClick={onClick}>
		<div className={classes.hexagonIn}>
			<div
				className={classes.hexagonIn2}
				style={{
					backgroundImage: `url(${src})`,
					backgroundSize: src === avatarPlaceholder ? 'auto' : 'cover'
				}}
			/>
		</div>
	</div>
));

export default HexagonAvatar;
