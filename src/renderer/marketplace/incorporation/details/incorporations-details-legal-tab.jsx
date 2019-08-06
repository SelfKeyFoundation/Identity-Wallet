import React from 'react';
import { withStyles } from '@material-ui/core';
import { sanitize } from '../../common';
import { IncorporationsDataPanel } from '../common/incorporations-data-panel';

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

const LEGAL_COLUMNS = [
	[
		{
			id: 'Shareholders not disclosed in a public registry',
			label: 'Shareholders not disclosed',
			boolean: true
		},
		{
			id: 'Directors not disclosed in a public registry',
			label: 'Directors not disclosed',
			boolean: true
		},
		{
			id: 'Corporate shareholders permitted',
			label: 'Corporate shareholders permitted',
			boolean: true
		},
		{
			id: 'Corporate directors permitted',
			label: 'Corporate directors permitted',
			boolean: true
		},
		{
			id: 'Local director required',
			label: 'Local director required',
			boolean: true
		},
		{
			id: 'Secretary required',
			label: 'Secretary required',
			boolean: true
		},
		{
			id: 'Local secretary required',
			label: 'Local secretary required',
			boolean: true
		},
		{
			id: 'Annual general meetings required',
			label: 'Annual general meetings required',
			boolean: true
		}
	],
	[
		{
			id: 'Redomiciliation permitted',
			label: 'Redomiciliation permitted',
			boolean: true
		},
		{
			id: 'Electronic signature',
			label: 'Electronic signature',
			boolean: true
		},
		{
			id: 'Annual return',
			label: 'Annual return',
			boolean: true
		},
		{
			id: 'Audited accounts',
			label: 'Audited accounts',
			boolean: true
		},
		{
			id: 'Audited accounts exemption',
			label: 'Audited accounts exemption',
			boolean: true
		},
		{
			id: 'Exchange controls',
			label: 'Exchange controls',
			boolean: true
		}
	],
	[
		{
			id: 'Legal basis',
			label: 'Legal basis',
			boolean: false
		},
		{
			id: 'Minimum shareholders',
			label: 'Minimum shareholders',
			boolean: false
		},
		{
			id: 'Minimum directors',
			label: 'Minimum directors',
			boolean: false
		},
		{
			id: 'Minimum members',
			label: 'Minimum members',
			boolean: false
		},
		{
			id: 'Minimum registered capital',
			label: 'Minimum registered capital',
			boolean: false
		},
		{
			id: 'Minimum issued capital',
			label: 'Minimum issued capital',
			boolean: false
		},
		{
			id: 'Minimum paid up capital',
			label: 'Minimum paid up capital',
			boolean: false
		},
		{
			id: 'Capital currency',
			label: 'Capital currency',
			boolean: false
		},
		{
			id: 'Foreign-ownership allowed',
			label: 'Foreign-ownership allowed',
			boolean: false
		},
		{
			id: 'Location of annual general meeting',
			label: 'Location of annual general meeting',
			boolean: false
		},
		{
			id: 'AEOI',
			label: 'AEOI',
			boolean: false
		}
	]
];

const LLC_COLUMNS = [
	[
		{
			id: 'Members not disclosed in a public registry',
			label: 'Members not disclosed',
			boolean: true
		},
		{
			id: 'Managers not disclosed in a public registry',
			label: 'Managers not disclosed',
			boolean: true
		},
		{
			id: 'Corporate members permitted',
			label: 'Corporate members permitted',
			boolean: true
		},
		{
			id: 'Corporate manager permitted',
			label: 'Corporate manager permitted',
			boolean: true
		},
		{
			id: 'Local manager required',
			label: 'Local manager required',
			boolean: true
		},
		{
			id: 'Registered office or agent required',
			label: 'Registered office/agent required',
			boolean: true
		},
		{
			id: 'Annual meeting required',
			label: 'Annual meeting required',
			boolean: true
		}
	]
];

const selectColumns = program => {
	if (program.details.LLC) {
		LEGAL_COLUMNS[0] = LLC_COLUMNS[0];
	}
	return LEGAL_COLUMNS;
};

const IncorporationsLegalTab = withStyles(styles)(({ classes, program }) => (
	<div className={classes.tabContainer}>
		<IncorporationsDataPanel sections={selectColumns(program)} data={program.details} />
		<div
			dangerouslySetInnerHTML={{
				__html: sanitize(program.translation.legal_paragraph)
			}}
		/>
	</div>
));

export { IncorporationsLegalTab };
export default IncorporationsLegalTab;
