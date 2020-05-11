import React from 'react';
import { Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	button: {
		fontSize: '14px',
		fontWeight: 400,
		letterSpacing: 0,
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
			<Button
				variant="text"
				color={color}
				className={classes.button}
				onClick={onClick}
				disabled={disabled}
			>
				<Typography variant="subtitle1" color="primary" id={id}>
					{text}
				</Typography>
			</Button>
		);
	}
);

export default DetailsButton;
