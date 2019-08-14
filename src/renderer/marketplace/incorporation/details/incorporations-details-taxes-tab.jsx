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

const TAX_COLUMNS = [
	[
		{
			id: 'Offshore Income Tax Exemption',
			label: 'Offshore Income Tax Exemption',
			boolean: true
		},
		{
			id: 'Offshore capital gains tax exemption',
			label: 'Offshore capital gains tax exemption',
			boolean: true
		},
		{
			id: 'Offshore dividends tax exemption',
			label: 'Offshore dividends tax exemption',
			boolean: true
		},
		{ id: 'CFC Rules', label: 'CFC Rules', boolean: true },
		{ id: 'Thin Capitalisation Rules', label: 'Thin Capitalisation Rules', boolean: true },
		{ id: 'Patent Box', label: 'Patent Box', boolean: true },
		{ id: 'Tax Incentives & Credits', label: 'Tax Incentives & Credits', boolean: true },
		{ id: 'Property Tax', label: 'Property Tax', boolean: true },
		{ id: 'Wealth tax', label: 'Wealth Tax', boolean: true },
		{ id: 'Estate inheritance tax', label: 'Estate inheritance tax', boolean: true },
		{ id: 'Transfer tax', label: 'Transfer tax', boolean: true },
		{ id: 'Capital duties', label: 'Capital Duties', boolean: true }
	],
	[
		{ id: 'Offshore Income Tax Rate', label: 'Offshore Income Tax Rate', boolean: false },

		{ id: 'Corporate Tax Rate', label: 'Corporate Tax Rate', boolean: false },
		{ id: 'Capital Gains Tax Rate', label: 'Capital Gains Tax Rate', boolean: false },
		{ id: 'Dividends Received', label: 'Dividends Received', boolean: false },
		{
			id: 'Dividends Withholding Tax Rate',
			label: 'Dividends Withholding Tax Rate',
			boolean: false
		},
		{
			id: 'Interests Withholding Tax Rate',
			label: 'Interests Withholding Tax Rate',
			boolean: false
		},
		{
			id: 'Royalties Withholding Tax Rate',
			label: 'Royalties Withholding Tax Rate',
			boolean: false
		},
		{ id: 'Losses carryback (years)', label: 'Losses carryback (years)', boolean: false },
		{ id: 'Losses carryforward (years)', label: 'Losses carryforward (years)', boolean: false }
	],
	[
		{ id: 'Personal Income Tax Rate', label: 'Personal Income Tax Rate', boolean: false },
		{ id: 'VAT Rate', label: 'VAT Rate', boolean: false },
		{ id: 'Inventory methods permitted', label: 'Inventory methods permitted', boolean: false },
		{ id: 'Tax time (hours)', label: 'Tax time (hours)', boolean: false },
		{ id: 'Tax payments per year', label: 'Tax payments per year', boolean: false },
		{ id: 'Total Tax Rate', label: 'Total Corporation Tax Burden', boolean: false },
		{ id: 'Social Security Employee', label: 'Social Security Employee', boolean: false },
		{ id: 'Social Security Employer', label: 'Social Security Employer', boolean: false }
	]
];

const IncorporationsTaxesTab = withStyles(styles)(({ classes, program }) => (
	<div className={classes.tabContainer}>
		<IncorporationsDataPanel sections={TAX_COLUMNS} data={program.tax} />
		<div
			dangerouslySetInnerHTML={{
				__html: sanitize(program.translation.taxes_paragraph)
			}}
		/>
	</div>
));

export { IncorporationsTaxesTab };
export default IncorporationsTaxesTab;
