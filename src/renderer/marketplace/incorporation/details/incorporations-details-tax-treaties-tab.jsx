import React from 'react';
import { withStyles } from '@material-ui/styles';
import { TaxTreatiesMap } from '../../common/tax-treaties-map';
import { TaxTreatiesTable } from '../../common/tax-treaties-table';
import { primary } from 'selfkey-ui';

const styles = theme => ({
	tabTreatiesContainer: {
		width: '100%',
		padding: theme.spacing(8, 0),
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

const IncorporationsTaxTreatiesTab = withStyles(styles)(({ classes, treaties }) => (
	<div className={classes.tabTreatiesContainer}>
		<TaxTreatiesMap data={treaties} />
		<TaxTreatiesTable data={treaties} />
	</div>
));

export { IncorporationsTaxTreatiesTab };
export default IncorporationsTaxTreatiesTab;
