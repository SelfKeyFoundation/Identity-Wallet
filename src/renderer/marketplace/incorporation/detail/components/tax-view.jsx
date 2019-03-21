import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, List, ListItem, Typography } from '@material-ui/core';
import { GreenTick, DeniedTick } from 'selfkey-ui';

// FIXME: how to load this dynamically from the api data?
const TAX_COLUMNS = [
	[
		{
			id: 'Offshore Income Tax Exemption',
			label: 'Offshore Income Tax Exemption'
		},
		{
			id: 'Offshore capital gains tax exemption',
			label: 'Offshore capital gains tax exemption'
		},
		{
			id: 'Offshore dividends tax exemption',
			label: 'Offshore dividends tax exemption'
		},
		{
			id: 'CFC Rules',
			label: 'CFC Rules'
		},
		{
			id: 'Thin Capitalisation Rules',
			label: 'Thin Capitalisation Rules'
		},
		{
			id: 'Patent Box',
			label: 'Patent Box'
		},
		{
			id: 'Tax Incentives & Credits',
			label: 'Tax Incentives & Credits'
		},
		{
			id: 'Property Tax',
			label: 'Property Tax'
		},
		{
			id: 'Wealth tax',
			label: 'Wealth Tax'
		},
		{
			id: 'Estate inheritance tax',
			label: 'Estate inheritance tax'
		},

		{ id: 'Transfer tax', label: 'Transfer tax' },
		{ id: 'Capital duties', label: 'Capital Duties' }
	],
	[
		{ id: 'Offshore Income Tax Rate', label: 'Offshore Income Tax Rate' },

		{ id: 'Corporate Tax Rate', label: 'Corporate Tax Rate' },
		{ id: 'Capital Gains Tax Rate', label: 'Capital Gains Tax Rate' },
		{ id: 'Dividends Received', label: 'Dividends Received' },
		{ id: 'Dividends Withholding Tax Rate', label: 'Dividends Withholding Tax Rate' },
		{ id: 'Interests Withholding Tax Rate', label: 'Interests Withholding Tax Rate' },
		{ id: 'Royalties Withholding Tax Rate', label: 'Royalties Withholding Tax Rate' },
		{ id: 'Losses carryback (years)', label: 'Losses carryback (years)' },
		{ id: 'Losses carryforward (years)', label: 'Losses carryforward (years)' }
	],
	[
		{ id: 'Personal Income Tax Rate', label: 'Personal Income Tax Rate' },
		{ id: 'VAT Rate', label: 'VAT Rate' },
		{ id: 'Inventory methods permitted', label: 'Inventory methods permitted' },
		{ id: 'Tax time (hours)', label: 'Tax time (hours)' },
		{ id: 'Tax payments per year', label: 'Tax payments per year' },
		{ id: 'Total Tax Rate', label: 'Total Corporation Tax Burden' },
		{ id: 'Social Security Employee', label: 'Social Security Employee' },
		{ id: 'Social Security Employer', label: 'Social Security Employer' }
	]
];

const styles = theme => ({
	booleanProp: {
		'& h5': {
			fontWeight: 'normal',
			fontSize: '14px'
		}
	},
	textProp: {
		'& h5': {
			fontWeight: 'normal',
			display: 'inline-block',
			fontSize: '14px'
		},
		'& div': {
			display: 'inline-block'
		},
		'& h5.value': {
			color: '#93B0C1',
			marginLeft: '1em',
			fontWeight: 'bold'
		}
	},
	denied: {
		'& rect': {
			fill: '#697C95 !important'
		}
	}
});

class IncorporationsTaxView extends Component {
	render() {
		const { classes, tax } = this.props;

		return (
			<Grid container justify="flex-start" alignItems="flex-start">
				<div>
					<List>
						{TAX_COLUMNS[0].map(prop => (
							<ListItem key={prop} className={classes.booleanProp}>
								{tax[prop.id] ? (
									<GreenTick />
								) : (
									<span className={classes.denied}>
										<DeniedTick />
									</span>
								)}
								<Typography variant="h5" gutterBottom>
									{prop.label}
								</Typography>
							</ListItem>
						))}
					</List>
				</div>
				<div>
					<List>
						{TAX_COLUMNS[1]
							.filter(prop => tax[prop.id])
							.map(prop => (
								<ListItem key={prop.id} className={classes.textProp}>
									<Typography variant="h5" gutterBottom>
										{prop.label}
									</Typography>
									<Typography variant="h5" gutterBottom className="value">
										{tax[prop.id]}
									</Typography>
								</ListItem>
							))}
					</List>
				</div>
				<div>
					<List>
						{TAX_COLUMNS[2]
							.filter(prop => tax[prop.id])
							.map(prop => (
								<ListItem key={prop.id} className={classes.textProp}>
									<Typography variant="h5" gutterBottom>
										{prop.label}
									</Typography>
									<Typography variant="h5" gutterBottom className="value">
										{tax[prop.id]}
									</Typography>
								</ListItem>
							))}
					</List>
				</div>
			</Grid>
		);
	}
}

export default withStyles(styles)(IncorporationsTaxView);
