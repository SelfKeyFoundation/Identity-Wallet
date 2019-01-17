import React, { Component } from 'react';
import injectSheet from 'react-jss';
// import ProgramListItem from '../../common/program-list-item';
import { Grid, List, ListItem, Typography } from '@material-ui/core';
import { GreenTick, DeniedTick } from 'selfkey-ui';

// FIXME: how to load this dynamically from the api data?
const LEGAL_COLUMNS = [
	[
		{
			id: 'Shareholders not disclosed in a public registry',
			text: 'Shareholders not disclosed'
		},
		{
			id: 'Directors not disclosed in a public registry',
			text: 'Directors not disclosed'
		},
		{
			id: 'Corporate shareholders permitted',
			text: 'Corporate shareholders permitted'
		},
		{
			id: 'Corporate directors permitted',
			text: 'Corporate directors permitted'
		},
		{
			id: 'Local director required',
			text: 'Local director required'
		},
		{
			id: 'Secretary required',
			text: 'Secretary required'
		},
		{
			id: 'Local secretary required',
			text: 'Local secretary required'
		},
		{
			id: 'Annual general meetings required',
			text: 'Annual general meetings required'
		}
	],
	[
		{
			id: 'Redomiciliation permitted',
			text: 'Redomiciliation permitted'
		},
		{
			id: 'Electronic signature',
			text: 'Electronic signature'
		},
		{
			id: 'Annual return',
			text: 'Annual return'
		},
		{
			id: 'Audited accounts',
			text: 'Audited accounts'
		},
		{
			id: 'Audited accounts exemption',
			text: 'Audited accounts exemption'
		},
		{
			id: 'Exchange controls',
			text: 'Exchange controls'
		}
	],
	[
		{
			id: 'Legal basis',
			text: 'Legal basis'
		},
		{
			id: 'Minimum shareholders',
			text: 'Minimum shareholders'
		},
		{
			id: 'Minimum directors',
			text: 'Minimum directors'
		},
		{
			id: 'Minimum members',
			text: 'Minimum members'
		},
		{
			id: 'Minimum registered capital',
			text: 'Minimum registered capital'
		},
		{
			id: 'Minimum issued capital',
			text: 'Minimum issued capital'
		},
		{
			id: 'Minimum paid up capital',
			text: 'Minimum paid up capital'
		},
		{
			id: 'Capital currency',
			text: 'Capital currency'
		},
		{
			id: 'Foreign-ownership allowed',
			text: 'Foreign-ownership allowed'
		},
		{
			id: 'Location of annual general meeting',
			text: 'Location of annual general meeting'
		},
		{
			id: 'AEOI',
			text: 'AEOI'
		}
	]
];

const styles = {
	booleanProp: {
		'& h5': {
			fontWeight: 'normal'
		}
	},
	textProp: {
		'& h5': {
			fontWeight: 'normal',
			display: 'inline-block'
		},
		'& div': {
			display: 'inline-block'
		},
		'& h5.value': {
			background: 'linear-gradient(to bottom, #0abbd0 0%, #09a8ba 100%)',
			padding: '1px 6px',
			borderRadius: '3px',
			fontWeight: 'bold',
			marginRight: '1em'
		}
	}
};

class IncorporationsLegalView extends Component {
	render() {
		const { classes, data } = this.props;
		console.log(data);
		return (
			<Grid container justify="left" alignItems="left">
				<div>
					<List>
						{LEGAL_COLUMNS[0].map(prop => (
							<ListItem key={prop.id} className={classes.booleanProp}>
								{data[prop.id] ? <GreenTick /> : <DeniedTick />}
								<Typography variant="h5" gutterBottom>
									{prop.text}
								</Typography>
							</ListItem>
						))}
					</List>
				</div>
				<div>
					<List>
						{LEGAL_COLUMNS[1].map(prop => (
							<ListItem key={prop.id} className={classes.booleanProp}>
								{data[prop.id] ? <GreenTick /> : <DeniedTick />}
								<Typography variant="h5" gutterBottom>
									{prop.text}
								</Typography>
							</ListItem>
						))}
					</List>
				</div>
				<div>
					<List>
						{LEGAL_COLUMNS[2]
							.filter(prop => data[prop.id])
							.map(prop => (
								<ListItem key={prop.id} className={classes.textProp}>
									<Typography variant="h5" gutterBottom className="value">
										{data[prop.id]}
									</Typography>
									<Typography variant="h5" gutterBottom>
										{prop.text}
									</Typography>
								</ListItem>
							))}
					</List>
				</div>
			</Grid>
		);
	}
}

export default injectSheet(styles)(IncorporationsLegalView);
