import React from 'react';
import { Grid, withStyles } from '@material-ui/core';
import { CorporateDetails } from '../common/corporate-details';
import { CorporateApplicationsSummary } from '../common/corporate-applications';
import { CorporateCapTable } from '../common/corporate-cap-table';
import { CorporateShareholding } from '../common/corporate-shareholding';
import { DisplayDid } from '../../did/display-did';
// import { CorporateOrgChart } from '../common/corporate-org-chart';

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
			margin: '30px 0',
			'& .halfWidth': {
				width: '100%'
			},
			'& .halfWidth:first-child': {
				marginRight: 15
			},
			'& .halfWidth:last-child': {
				marginLeft: 15
			}
		},
		'& .corporateShareholding': {
			margin: '30px 0'
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
		onEditManegeMembers,
		didComponent
	}) => (
		<div>
			<div className={classes.overviewBox}>
				{!profile.identity.did && <Grid item>{didComponent}</Grid>}
				{profile.identity.did && <DisplayDid did={profile.identity.did} />}
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
						onEdit={onEditManegeMembers}
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
