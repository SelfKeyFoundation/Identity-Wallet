import React from 'react';
import { withStyles } from '@material-ui/styles';
import { sanitize } from '../../common';
import { IncorporationsDataPanel } from '../common/incorporations-data-panel';
import { primary } from 'selfkey-ui';

const styles = theme => ({
	tabContainer: {
		width: '100%',
		padding: theme.spacing(4, 0),
		color: '#FFFFFF',
		'& p': {
			marginBottom: theme.spacing(3),
			lineHeight: '1.4em'
		},
		'& strong': {
			fontWeight: 'bold',
			color: theme.palette.secondary.main,
			display: 'block',
			padding: '0',
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
			color: primary
		}
	}
});

const LEGAL_COLUMNS = [
	[
		{
			id: 'shareholdersNotDisclosedInAPublicRegistry',
			label: 'Shareholders not disclosed',
			boolean: true
		},
		{
			id: 'directorsNotDisclosedInAPublicRegistry',
			label: 'Directors not disclosed',
			boolean: true
		},
		{
			id: 'corporateShareholdersPermitted',
			label: 'Corporate shareholders permitted',
			boolean: true
		},
		{
			id: 'corporateDirectorsPermitted',
			label: 'Corporate directors permitted',
			boolean: true
		},
		{
			id: 'localDirectorRequired',
			label: 'Local director required',
			boolean: true
		},
		{
			id: 'secretaryRequired',
			label: 'Secretary required',
			boolean: true
		},
		{
			id: 'localSecretaryRequired',
			label: 'Local secretary required',
			boolean: true
		},
		{
			id: 'annualGeneralMeetingsRequired',
			label: 'Annual general meetings required',
			boolean: true
		}
	],
	[
		{
			id: 'redomiciliationPermitted',
			label: 'Redomiciliation permitted',
			boolean: true
		},
		{
			id: 'electronicSignature',
			label: 'Electronic signature',
			boolean: true
		},
		{
			id: 'annualReturn',
			label: 'Annual return',
			boolean: true
		},
		{
			id: 'auditedAccounts',
			label: 'Audited accounts',
			boolean: true
		},
		{
			id: 'auditedAccountsExemption',
			label: 'Audited accounts exemption',
			boolean: true
		},
		{
			id: 'exchangeControls',
			label: 'Exchange controls',
			boolean: true
		}
	],
	[
		{
			id: 'legalBasis',
			label: 'Legal basis',
			boolean: false
		},
		{
			id: 'minimumShareholders',
			label: 'Minimum shareholders',
			boolean: false
		},
		{
			id: 'minimumDirectors',
			label: 'Minimum directors',
			boolean: false
		},
		{
			id: 'minimumMembers',
			label: 'Minimum members',
			boolean: false
		},
		{
			id: 'minimumRegisteredCapital',
			label: 'Minimum registered capital',
			boolean: false
		},
		{
			id: 'minimumIssuedCapital',
			label: 'Minimum issued capital',
			boolean: false
		},
		{
			id: 'minimumPaidUpCapital',
			label: 'Minimum paid up capital',
			boolean: false
		},
		{
			id: 'capitalCurrency',
			label: 'Capital currency',
			boolean: false
		},
		{
			id: 'foreignOwnershipAllowed',
			label: 'Foreign-ownership allowed',
			boolean: false
		},
		{
			id: 'locationOfAnnualGeneralMeeting',
			label: 'Location of annual general meeting',
			boolean: false
		},
		{
			id: 'aeoi',
			label: 'AEOI',
			boolean: false
		}
	]
];

const LLC_COLUMNS = [
	[
		{
			id: 'membersNotDisclosedInAPublicRegistry',
			label: 'Members not disclosed',
			boolean: true
		},
		{
			id: 'managerNotDisclosedInAPublicRegistry',
			label: 'Managers not disclosed',
			boolean: true
		},
		{
			id: 'corporateMembersPermitted',
			label: 'Corporate members permitted',
			boolean: true
		},
		{
			id: 'corporateManagerPermitted',
			label: 'Corporate manager permitted',
			boolean: true
		},
		{
			id: 'localManagerRequired',
			label: 'Local manager required',
			boolean: true
		},
		{
			id: 'registeredOfficeOrAgentRequired',
			label: 'Registered office/agent required',
			boolean: true
		},
		{
			id: 'annualMeetingRequired',
			label: 'Annual meeting required',
			boolean: true
		}
	]
];

const selectColumns = program => {
	if (program.data.corpllc) {
		LEGAL_COLUMNS[0] = LLC_COLUMNS[0];
	}
	return LEGAL_COLUMNS;
};

const IncorporationsLegalTab = withStyles(styles)(({ classes, program }) => (
	<div className={classes.tabContainer}>
		<IncorporationsDataPanel sections={selectColumns(program)} data={program.data} />
		<div
			dangerouslySetInnerHTML={{
				__html: sanitize(
					program.data.en ? program.data.en.legalParagraph : program.data.legalDescription
				)
			}}
		/>
	</div>
));

export { IncorporationsLegalTab };
export default IncorporationsLegalTab;
