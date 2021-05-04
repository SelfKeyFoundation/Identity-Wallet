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

const PassportsRequirementsTab = withStyles(styles)(({ classes, program }) => (
	<div className={classes.tabContainer}>
		{program && program.data && program.data.description && (
			<>
				<h1>Requirements</h1>
				<p
					dangerouslySetInnerHTML={{
						__html: sanitize(program.data.description.requirements)
					}}
				/>
			</>
		)}
		{program && program.data && program.data.kyc && (
			<>
				<h1>KYC details</h1>
				<ul>
					{program.data.kyc.map(n => (
						<li key={n}>{n}</li>
					))}
				</ul>
			</>
		)}
	</div>
));

export { PassportsRequirementsTab };
export default PassportsRequirementsTab;
