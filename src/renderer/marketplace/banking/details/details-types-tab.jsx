import React from 'react';
import { withStyles, Typography } from '@material-ui/core';

const styles = theme => ({
	tabContainer: {
		width: '100%',
		padding: '2em 0',
		color: '#FFFFFF',
		'& p': {
			marginBottom: '1.5em',
			lineHeight: '1.4em'
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
	}
});

export const BankingTypesTab = withStyles(styles)(({ classes }) => (
	<div className={classes.tabContainer}>
		<Typography variant="body2" color="secondary">
			We work with 4 different banks in Singapore. Each bank has different eligibility
			requirements, types of accounts available and onboarding processes. We invite you to
			carefully review each banks requirements and services to better understand if their
			banking services meet your needs:
		</Typography>
	</div>
));

export default BankingTypesTab;
