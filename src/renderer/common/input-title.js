import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	optional: {
		display: 'inline',
		fontStyle: 'italic',
		marginLeft: '5px',
		textTransform: 'lowercase'
	}
});

export const InputTitle = withStyles(styles)(({ classes, title, optional = false }) => {
	return (
		<div>
			<Typography variant="overline" gutterBottom>
				{title}
				{optional ? (
					<Typography variant="overline" className={classes.optional}>
						(optional)
					</Typography>
				) : (
					' *'
				)}
			</Typography>
		</div>
	);
});
