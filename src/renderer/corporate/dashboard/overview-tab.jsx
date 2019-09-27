import React from 'react';
import { Grid, withStyles } from '@material-ui/core';
import { CorporateDetails } from '../common/corporate-details';
import { CorporateApplicationsSummary } from '../common/corporate-applications';
import { CorporateCapTable } from '../common/corporate-cap-table';
import { CorporateShareholding } from '../common/corporate-shareholding';
import { CorporateOrgChart } from '../common/corporate-org-chart';

const styles = theme => ({
	flexGrow: {
		flexGrow: 1,
		width: '100%',
		maxWidth: '100%',
		overflow: 'hidden'
	},
	CorporateShareholding: {
		width: '550px'
	}
});

const CorporateOverviewTab = withStyles(styles)(({ classes, applications, profile, cap }) => (
	<div style={{ width: '100%', marginTop: '16px' }}>
		<Grid
			container
			direction="row"
			justify="space-between"
			alignItems="flex-start"
			wrap="nowrap"
			spacing={16}
		>
			<Grid item className={classes.flexGrow}>
				<CorporateDetails profile={profile} />
			</Grid>
			<Grid item className={classes.flexGrow}>
				<CorporateApplicationsSummary profile={profile} applications={applications} />
			</Grid>
		</Grid>
		<Grid
			container
			direction="row"
			justify="space-between"
			alignItems="flex-start"
			wrap="nowrap"
			spacing={16}
		>
			<Grid item className={classes.flexGrow}>
				<CorporateCapTable profile={profile} cap={cap} />
			</Grid>
		</Grid>
		<Grid
			container
			direction="row"
			justify="space-between"
			alignItems="flex-start"
			wrap="nowrap"
			spacing={16}
		>
			<Grid item className={classes.CorporateShareholding}>
				<CorporateShareholding profile={profile} cap={cap} />
			</Grid>
			<Grid item className={classes.flexGrow}>
				<CorporateOrgChart profile={profile} cap={cap} />
			</Grid>
		</Grid>
	</div>
));

export { CorporateOverviewTab };
export default CorporateOverviewTab;
