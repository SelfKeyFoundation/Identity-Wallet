import React from 'react';
import { withStyles } from '@material-ui/styles';
import { sanitize } from '../../common';
import { primary } from 'selfkey-ui';

const styles = theme => ({
	tabContainer: {
		width: '100%',
		padding: '2em 0',
		color: '#FFFFFF',
		'& h1': {
			margin: '1em 0',
			fontSize: '24px'
		},
		'& p': {
			marginBottom: '1.5em',
			lineHeight: '1.4em'
		},
		'& strong': {
			fontWeight: 'bold',
			color: theme.palette.secondary.main,
			display: 'block',
			padding: '0',
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
			color: primary
		}
	}
});

const PassportsProceduresTab = withStyles(styles)(({ classes, program }) => (
	<div className={classes.tabContainer}>
		{program && program.data && program.data.description && (
			<>
				<h1>Procedures</h1>
				<p
					dangerouslySetInnerHTML={{
						__html: sanitize(program.data.description.procedures)
					}}
				/>
			</>
		)}
	</div>
));

export { PassportsProceduresTab };
export default PassportsProceduresTab;
