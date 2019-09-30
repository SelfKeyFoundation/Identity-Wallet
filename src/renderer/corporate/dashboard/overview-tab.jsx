import React from 'react';
import { Grid, withStyles } from '@material-ui/core';
import { CorporateDetails } from '../common/corporate-details';
import { CorporateApplicationsSummary } from '../common/corporate-applications';
import { CorporateCapTable } from '../common/corporate-cap-table';
import { CorporateShareholding } from '../common/corporate-shareholding';
import { CorporateOrgChart } from '../common/corporate-org-chart';

const styles = theme => ({
	corporateShareholding: {
		width: '550px'
	}
});

const CorporateOverviewTab = withStyles(styles)(
	({ classes, applications, profile, cap, onEditCorporateDetails }) => (
		<div style={{ width: '100%', marginTop: '16px' }}>
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="stretch"
				spacing={16}
			>
				<Grid item>
					<Grid
						container
						direction="row"
						justify="space-between"
						alignItems="stretch"
						wrap="nowrap"
						spacing={16}
					>
						<Grid item xs>
							<CorporateDetails profile={profile} onEdit={onEditCorporateDetails} />
						</Grid>
						<Grid item xs>
							<CorporateApplicationsSummary
								profile={profile}
								applications={applications}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<CorporateCapTable profile={profile} cap={cap} />
				</Grid>
				<Grid item>
					<Grid
						container
						direction="row"
						justify="space-between"
						alignItems="stretch"
						wrap="nowrap"
						spacing={16}
					>
						<Grid item className={classes.corporateShareholding}>
							<CorporateShareholding profile={profile} cap={cap} />
						</Grid>
						<Grid item xs>
							<CorporateOrgChart profile={profile} cap={cap} />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	)
);

export { CorporateOverviewTab };
export default CorporateOverviewTab;
