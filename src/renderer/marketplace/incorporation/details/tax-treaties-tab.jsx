import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TreatiesMap from '../common/treaties-map';
import TreatiesTable from '../common/treaties-table';

const styles = theme => ({});

export const ServicesTab = withStyles(styles)(({ treaties }) => {
	return (
		<React.Fragment>
			<TreatiesMap data={treaties} />
			<TreatiesTable data={treaties} />
		</React.Fragment>
	);
});

export default ServicesTab;
