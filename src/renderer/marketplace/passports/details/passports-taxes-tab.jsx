import React from 'react';
import { withStyles } from '@material-ui/styles';
import { sanitize } from '../../common';
import { IncorporationsDataPanel } from '../../incorporation/common/incorporations-data-panel';
import { primary } from 'selfkey-ui';

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

const TAX_COLUMNS = [
	[
		{ id: 'propertyTax', label: 'Property Tax', boolean: true },
		{ id: 'transferTax', label: 'Transfer Tax', boolean: true },
		{ id: 'inheritanceTax', label: 'Inheritance Tax', boolean: true },
		{ id: 'netWorthTax', label: 'Net Worth Tax', boolean: true },
		{ id: 'cfcRules', label: 'CFC Law', boolean: true }
	],
	[
		{ id: 'taxResidency', label: 'Tax Residency Days', boolean: false },
		{ id: 'pitRate', label: 'Personal Income tax rate', boolean: false },
		{ id: 'capitalGainsTaxRate', label: 'Capital Gains tax rate', boolean: false },
		{ id: 'InvestmentIncomeTaxRate', label: 'Investment Income tax rate', boolean: false },
		{ id: 'territorialTaxation', label: 'Territorial Taxation', boolean: true }
	]
];

const PassportsTaxesTab = withStyles(styles)(({ classes, program }) => (
	<div className={classes.tabContainer}>
		<IncorporationsDataPanel sections={TAX_COLUMNS} data={program.data} />
		{program && program.data && program.data.description && (
			<p
				dangerouslySetInnerHTML={{
					__html: sanitize(program.data.description.taxes)
				}}
			/>
		)}
	</div>
));

export { PassportsTaxesTab };
export default PassportsTaxesTab;
