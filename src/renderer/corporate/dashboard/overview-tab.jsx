import React from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { CorporateDetails } from '../common/corporate-details';
import { CorporateApplicationsSummary } from '../common/corporate-applications';
import { CorporateCapTable } from '../common/corporate-cap-table';
import { CorporateShareholding } from '../common/corporate-shareholding';
import { DisplayDid } from '../../did/display-did';
// import { CorporateOrgChart } from '../common/corporate-org-chart';
import { featureIsEnabled } from 'common/feature-flags';

const styles = theme => ({
	overviewBox: {
		alignItems: 'strech',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		'& .halfWidgetBox': {
			alignItems: 'stretch',
			display: 'flex',
			flexWrap: 'nowrap',
			justifyContent: 'space-between',
			margin: theme.spacing(0),
			'& .halfWidth': {
				width: '100%'
			},
			'& .halfWidth:first-child': {
				marginRight: theme.spacing(2)
			},
			'& .halfWidth:last-child': {
				marginLeft: theme.spacing(2)
			}
		},
		'& .corporateShareholding': {
			margin: theme.spacing(4, 0)
		}
	}
});

const CorporateOverviewTab = withStyles(styles)(
	({
		classes,
		applications,
		profile,
		members,
		onEditCorporateDetails,
		onEditManageMembers,
		didComponent
	}) => (
		<div>
			<div className={classes.overviewBox}>
				{featureIsEnabled('did') && !profile.identity.did && (
					<Grid item>{didComponent}</Grid>
				)}
				{featureIsEnabled('did') && profile.identity.did && (
					<DisplayDid did={profile.identity.did} />
				)}
				<div className="halfWidgetBox">
					<div className="halfWidth">
						<CorporateDetails profile={profile} onEdit={onEditCorporateDetails} />
					</div>
					<div className="halfWidth">
						<CorporateApplicationsSummary
							profile={profile}
							applications={applications}
						/>
					</div>
				</div>
				<div>
					<CorporateCapTable
						profile={profile}
						members={members}
						onEdit={onEditManageMembers}
					/>
				</div>
				<div className="corporateShareholding">
					<div>
						<CorporateShareholding profile={profile} members={members} />
					</div>
					{/*
					<div className="halfWidth" styles={{ marginLeft: 15 }}>
						<CorporateOrgChart profile={profile} members={members} />
					</div>
					*/}
				</div>
			</div>
		</div>
	)
);

export { CorporateOverviewTab };
export default CorporateOverviewTab;
