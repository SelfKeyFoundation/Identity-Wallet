import React from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	button: {
		minWidth: '70px',
		padding: '6px 8px',
		textAlign: 'left',
		textTransform: 'capitalize',
		whiteSpace: 'normal',
		wordBreak: 'break-word',
		wordWrap: 'normal'
	}
});

const DetailsButton = withStyles(styles)(
	({ classes, disabled = false, text = 'Details', color = 'primary', onClick, id = '' }) => {
		return (
			<Button className={classes.button} onClick={onClick} disabled={disabled}>
				{text}
			</Button>
		);
	}
);

export default DetailsButton;
