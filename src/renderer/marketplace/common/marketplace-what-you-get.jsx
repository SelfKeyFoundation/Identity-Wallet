import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { sanitize } from '../common';

const styles = theme => ({
	whatYouGet: {
		paddingBottom: theme.spacing(4),
		marginBottom: theme.spacing(4),
		borderBottom: '2px solid #475768'
	},
	description: {
		margin: theme.spacing(2, 2, 2, 0),
		fontFamily: 'Lato, arial',
		color: '#FFF',
		width: '60%',
		borderRight: '1px solid #475768',
		lineHeight: '1.4em',
		fontSize: '14px',
		'& p': {
			marginBottom: theme.spacing(3),
			lineHeight: '1.4em',
			maxWidth: '90%'
		},
		'& strong': {
			fontWeight: 'bold',
			color: theme.palette.secondary.main,
			display: 'block',
			padding: theme.spacing(0),
			marginBottom: theme.spacing(1),
			marginTop: theme.spacing(0)
		},
		'& ul': {
			listStyle: 'outside',
			lineHeight: '1.4em',
			marginLeft: theme.spacing(3),
			marginBottom: theme.spacing(3)
		},
		'& ul li': {
			lineHeight: '1.4em',
			marginBottom: theme.spacing(1)
		},
		'& a': {
			color: theme.palette.secondary.main
		}
	},
	descriptionHelp: {
		width: '35%',
		color: theme.palette.secondary.main,
		fontFamily: 'Lato, arial',
		fontSize: '12px',
		lineHeight: '1.5em',
		'& p': {
			marginBottom: theme.spacing(2)
		}
	}
});

const WhatYouGet = withStyles(styles)(({ classes, description, timeToForm, whatYouGet }) => {
	return (
		<div className={classes.whatYouGet}>
			<Typography variant="h2" gutterBottom>
				What you get
			</Typography>
			<Grid container direction="row" justify="space-between" alignItems="center" spacing={0}>
				<div
					className={classes.description}
					dangerouslySetInnerHTML={{
						__html: sanitize(description)
					}}
				/>
				<div className={classes.descriptionHelp}>
					<p>Time to form: {timeToForm} week(s).</p>
					<p>{whatYouGet}</p>
				</div>
			</Grid>
		</div>
	);
});

export { WhatYouGet };
export default WhatYouGet;
