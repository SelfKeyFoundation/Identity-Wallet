import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { sanitize } from '../common';

const styles = theme => ({
	whatYouGet: {
		paddingBottom: '30px',
		marginBottom: '30px',
		borderBottom: '2px solid #475768'
	},
	description: {
		margin: '1em 1em 1em 0',
		fontFamily: 'Lato, arial',
		color: '#FFF',
		width: '60%',
		borderRight: '1px solid #475768',
		lineHeight: '1.4em',
		fontSize: '14px',
		'& p': {
			marginBottom: '1.5em',
			lineHeight: '1.4em',
			maxWidth: '90%'
		},
		'& strong': {
			fontWeight: 'bold',
			color: theme.palette.secondary.main,
			display: 'block',
			padding: '0',
			borderBottom: '1px solid #435160',
			marginBottom: '0.5em',
			marginTop: '0em'
		},
		'& ul': {
			listStyle: 'outside',
			lineHeight: '1.4em',
			marginLeft: '1.5em',
			marginBottom: '1.5em'
		},
		'& ul li': {
			lineHeight: '1.4em',
			marginBottom: '0.5em'
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
			marginBottom: '1em'
		}
	}
});

const WhatYouGet = withStyles(styles)(({ classes, description, timeToForm }) => {
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
					<p>
						All our incorporation services include a yearly consulting session, a
						dedicated account manager and access to our global network of trusted
						business services, including introductions to accountants, financial, tax
						and legal advisors at no cost.
					</p>
				</div>
			</Grid>
		</div>
	);
});

export { WhatYouGet };
export default WhatYouGet;
