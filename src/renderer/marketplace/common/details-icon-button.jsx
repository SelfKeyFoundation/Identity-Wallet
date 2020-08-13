import React from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { SelectDropdownIcon } from 'selfkey-ui';

const styles = theme => ({
	button: {
		cursor: 'pointer',
		maxWidth: '80px',
		textAlign: 'left'
	},
	icon: {
		transform: 'rotate(-90deg)'
	}
});

const DetailsIconButton = withStyles(styles)(({ classes, disabled = false, onClick, id = '' }) => {
	return (
		<Button className={classes.button} onClick={onClick} disabled={disabled}>
			<SelectDropdownIcon className={classes.icon} />
		</Button>
	);
});

export { DetailsIconButton };
