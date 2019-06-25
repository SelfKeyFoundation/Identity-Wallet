import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import { CertificateIcon } from 'selfkey-ui';
import IncorporationsKYC from '../common/kyc-requirements';
import { ProgramPrice } from '../../common';
import DetailsPageLayout from '../../common/details-page-layout';
import { ApplicationStatusBar } from '../../../kyc/application/application-status';
import DetailsTab from './details-tab';
import { ResumeBox } from './resume-box';

const styles = theme => ({
	content: {
		background: '#262F39',
		padding: '22px 30px',
		width: '100%',
		justifyContent: 'space-between',
		margin: 0
	},
	resumeTable: {
		'& div': {
			padding: '10px 15px',
			width: '125px'
		},
		'& label': {
			fontSize: '13px',
			color: '#93B0C1'
		},
		'& h4': {
			marginTop: '0.25em',
			minHeight: '30px',
			color: '#00C0D9'
		}
	},
	applyButton: {
		maxWidth: '250px',
		textAlign: 'right',
		'& button': {
			width: '100%',
			marginBottom: '1em'
		},
		'& div.price': {
			fontFamily: 'Lato, arial, sans-serif',
			fontSize: '16px',
			fontWeight: 'bold',
			color: '#00C0D9'
		},
		'& span.price-key': {
			color: '#93B0C1',
			fontFamily: 'Lato, arial, sans-serif',
			fontSize: '12px',
			display: 'block',
			fontWeight: 'normal',
			marginTop: '5px'
		}
	},
	certificateIcon: {
		marginRight: '18px'
	}
});

export const ApplyIncorporationButton = withStyles(styles)(
	({ classes, canIncorporate, loading, price, startApplication, keyRate }) => (
		<React.Fragment>
			{canIncorporate && !loading && (
				<Button variant="contained" size="large" onClick={startApplication}>
					<CertificateIcon className={classes.certificateIcon} />
					Incorporate Now
				</Button>
			)}

			{canIncorporate && loading && (
				<Button variant="contained" size="large" disabled>
					Loading ...
				</Button>
			)}
			<ProgramPrice price={price} rate={keyRate} label="Pricing: $" />
		</React.Fragment>
	)
);
/* ==========================================================================
   Received props:
   ---------------
   match.params.countryCode: country two letter code
   match.params.programCode: program specific code (from airtable)
   match.params.templateID: KYC-Chain template ID for this jurisdiction (from airtable)
   program: program details object map
   isLoading: boolean indicating if it's still loading data
   treaties: tax treaties for this specific country/jurisdiction
   rate: USD/KEY current rate
   ==========================================================================
*/

export const IncorporationDetailsPage = withStyles(styles)(props => {
	const {
		classes,
		applicationStatus,
		countryCode,
		contact,
		onStatusAction,
		onBack,
		loading,
		canIncorporate,
		program,
		startApplication,
		keyRate,
		price,
		tab,
		requirements,
		templateId,
		onTabChange
	} = props;
	const { tax } = program;

	return (
		<DetailsPageLayout onBack={onBack} countryCode={countryCode} title={program.Region}>
			<ApplicationStatusBar
				status={applicationStatus}
				contact={contact}
				statusAction={onStatusAction}
			/>
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="stretch"
				spacing={40}
				className={classes.content}
			>
				<Grid item>
					<Grid container direction="row" justify="space-between" alignItems="flex-start">
						<Grid item>
							<ResumeBox tax={tax} />
						</Grid>
						<Grid item className={classes.applyButton}>
							<ApplyIncorporationButton
								canIncorporate={canIncorporate}
								loading={loading}
								price={price}
								startApplication={startApplication}
								keyRate={keyRate}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<DetailsTab {...props} tab={tab} onTabChange={onTabChange} />
				</Grid>
				<Grid item>
					<IncorporationsKYC requirements={requirements} templateId={templateId} />
				</Grid>
			</Grid>
		</DetailsPageLayout>
	);
});

IncorporationDetailsPage.propTypes = {
	startApplication: PropTypes.bool.isRequired,
	requirements: PropTypes.any.isRequired,
	program: PropTypes.any.isRequired,
	onBack: PropTypes.func.isRequired,
	canIncorporate: PropTypes.bool,
	loading: PropTypes.bool,
	price: PropTypes.bool,
	keyRate: PropTypes.number,
	handleExternalLinks: PropTypes.func
};
