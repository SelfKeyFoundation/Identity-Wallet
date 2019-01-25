import React, { Component } from 'react';
import injectSheet from 'react-jss';
// import ProgramListItem from '../../common/program-list-item';
import { Grid, List, ListItem, Typography } from '@material-ui/core';
import { GreenTick, DeniedTick } from 'selfkey-ui';

// FIXME: how to load this dynamically from the api data?
const TAX_COLUMNS = [
	[
		{
			id: 'offshoreIncomeTaxExemption',
			label: 'Offshore Income Tax Exemption'
		},
		{
			id: 'offshoreCapitalGainsTaxExemption',
			label: 'Offshore capital gains tax exemption'
		},
		{
			id: 'offshoreDividendsTaxExemption',
			label: 'Offshore dividends tax exemption'
		},
		{
			id: 'cfcRules',
			label: 'CFC Rules'
		},
		{
			id: 'thinCapitalisationRules',
			label: 'Thin Capitalisation Rules'
		},
		{
			id: 'patentBox',
			label: 'Patent Box'
		},
		{
			id: 'taxIncentivesAndCredits',
			label: 'Tax Incentives & Credits'
		},
		{
			id: 'propertyTax',
			label: 'Property Tax'
		},
		{
			id: 'wealthTax',
			label: 'Wealth Tax'
		},
		{
			id: 'estateInheritanceTax',
			label: 'Estate inheritance tax'
		},

		{ id: 'transferTax', label: 'Transfer tax' },
		{ id: 'capitalDuties', label: 'Capital Duties' }
	],
	[
		{ id: 'offshoreIncomeTax', label: 'Offshore Income Tax Rate' },

		{ id: 'corporateTax', label: 'Corporate Tax Rate' },
		{ id: 'capitalGainsTax', label: 'Capital Gains Tax Rate' },
		{ id: 'dividendsReceived', label: 'Dividends Received' },
		{ id: 'dividendsWitholdingTax', label: 'Dividends Withholding Tax Rate' },
		{ id: 'interestsWitholdingTax', label: 'Interests Withholding Tax Rate' },
		{ id: 'royaltiesWitholdingTax', label: 'Royalties Withholding Tax Rate' },
		{ id: 'lossesCarryback', label: 'Losses carryback (years)' },
		{ id: 'losessCarryforward', label: 'Losses carryforward (years)' }
	],
	[
		{ id: 'personalIncomeTax', label: 'Personal Income Tax Rate' },
		{ id: 'vat', label: 'VAT Rate' },
		{ id: 'inventoryMethodsPermitted', label: 'Inventory methods permitted' },
		{ id: 'taxTime', label: 'Tax time (hours)' },
		{ id: 'taxPaymentsPerYear', label: 'Tax payments per year' },
		{ id: 'totalCorporationTax', label: 'Total Corporation Tax Burden' },
		{ id: 'socialSecurityEmployee', label: 'Social Security Employee' },
		{ id: 'socialSecurityEmployer', label: 'Social Security Employer' }
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

class IncorporationsTaxView extends Component {
	render() {
		const { classes, tax } = this.props;
		console.log(tax);
		return (
			<Grid container justify="left" alignItems="left">
				<div>
					<List>
						{TAX_COLUMNS[0].map(prop => (
							<ListItem key={prop} className={classes.booleanProp}>
								{tax[prop.id] ? <GreenTick /> : <DeniedTick />}
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
									<Typography variant="h5" gutterBottom className="value">
										{tax[prop.id]}
									</Typography>
									<Typography variant="h5" gutterBottom>
										{prop.label}
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
									<Typography variant="h5" gutterBottom className="value">
										{tax[prop.id]}
									</Typography>
									<Typography variant="h5" gutterBottom>
										{prop.label}
									</Typography>
								</ListItem>
							))}
					</List>
				</div>
			</Grid>
		);
	}
}

export default injectSheet(styles)(IncorporationsTaxView);
