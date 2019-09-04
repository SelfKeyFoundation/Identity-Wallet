import React from 'react';
import { withStyles } from '@material-ui/core';
import { sanitize } from '../../common';

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

const BankingDescriptionTab = withStyles(styles)(({ classes, jurisdiction }) => (
	<div className={classes.tabContainer}>
		<div
			dangerouslySetInnerHTML={{
				__html: sanitize(jurisdiction.data.introText)
			}}
		/>
	</div>
));

export { BankingDescriptionTab };
export default BankingDescriptionTab;
