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
			padding: theme.spacing(0),
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

const TAX_COLUMNS = [
	[
		{
			id: 'offshoreIncomeTaxExemption',
			label: 'Offshore Income Tax Exemption',
			boolean: true
		},
		{
			id: 'offshoreCapitalGainsTaxExemption',
			label: 'Offshore capital gains tax exemption',
			boolean: true
		},
		{
			id: 'offshoreDividendsTaxExemption',
			label: 'Offshore dividends tax exemption',
			boolean: true
		},
		{ id: 'cfcRules', label: 'CFC Rules', boolean: true },
		{ id: 'thinCapitalisationRules', label: 'Thin Capitalisation Rules', boolean: true },
		{ id: 'patentBox', label: 'Patent Box', boolean: true },
		{ id: 'taxIncentivesCredits', label: 'Tax Incentives & Credits', boolean: true },
		{ id: 'propertyTax', label: 'Property Tax', boolean: true },
		{ id: 'wealthTax', label: 'Wealth Tax', boolean: true },
		{ id: 'EstateInheritanceTax', label: 'Estate inheritance tax', boolean: true },
		{ id: 'transferTax', label: 'Transfer tax', boolean: true },
		{ id: 'capitalDuties', label: 'Capital Duties', boolean: true }
	],
	[
		{ id: 'offshoreIncomeTaxRate', label: 'Offshore Income Tax Rate', boolean: false },

		{ id: 'corporateTaxRate', label: 'Corporate Tax Rate', boolean: false },
		{ id: 'capitalGainsTaxRate', label: 'Capital Gains Tax Rate', boolean: false },
		{ id: 'dividendsReceived', label: 'Dividends Received', boolean: false },
		{
			id: 'dividendsWithholdingTaxRate',
			label: 'Dividends Withholding Tax Rate',
			boolean: false
		},
		{
			id: 'interestsWithholdingTaxRate',
			label: 'Interests Withholding Tax Rate',
			boolean: false
		},
		{
			id: 'royaltiesWithholdingTaxRate',
			label: 'Royalties Withholding Tax Rate',
			boolean: false
		},
		{ id: 'lossesCarrybackYears', label: 'Losses carryback (years)', boolean: false },
		{ id: 'lossesCarryforwardYears', label: 'Losses carryforward (years)', boolean: false }
	],
	[
		{ id: 'personalIncomeTaxRate', label: 'Personal Income Tax Rate', boolean: false },
		{ id: 'vatRate', label: 'VAT Rate', boolean: false },
		{ id: 'inventoryMethodsPermitted', label: 'Inventory methods permitted', boolean: false },
		{ id: 'taxTimeHours', label: 'Tax time (hours)', boolean: false },
		{ id: 'taxPaymentsPerYear', label: 'Tax payments per year', boolean: false },
		{ id: 'totalTaxRate', label: 'Total Corporation Tax Burden', boolean: false },
		{ id: 'socialSecurityEmployee', label: 'Social Security Employee', boolean: false },
		{ id: 'socialSecurityEmployer', label: 'Social Security Employer', boolean: false }
	]
];

const IncorporationsTaxesTab = withStyles(styles)(({ classes, program }) => (
	<div className={classes.tabContainer}>
		<IncorporationsDataPanel sections={TAX_COLUMNS} data={program.data} />
		<div
			dangerouslySetInnerHTML={{
				__html: sanitize(
					program.data.en ? program.data.en.taxesParagraph : program.data.taxesDescription
				)
			}}
		/>
	</div>
));

export { IncorporationsTaxesTab };
export default IncorporationsTaxesTab;
