import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Typography } from '@material-ui/core';
import { CertificateIcon, success, warning } from 'selfkey-ui';
import { IncorporationsKYC } from '../common';
import { ProgramPrice, FlagCountryName } from '../../common';
import { ApplicationStatusBar } from '../../../kyc/application/application-status';
import DetailsTab from './details-tab';
import { ResumeBox } from './resume-box';

const styles = theme => ({
	container: {
		width: '100%',
		margin: '50px auto 0',
		maxWidth: '960px'
	},
	backButtonContainer: {
		left: '15px',
		position: 'absolute',
		top: '120px'
	},
	bold: {
		fontWeight: 600
	},
	flagCell: {
		width: '10px'
	},
	title: {
		padding: '22px 30px',
		background: '#2A3540',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		},
		'& .region': {
			marginLeft: '1em',
			marginTop: '0.25em',
			marginBottom: '0',
			fontSize: '24px'
		}
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px'
	},
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
	programBrief: {
		display: 'flex',
		border: '1px solid #303C49',
		borderRadius: '4px',
		background: '#2A3540'
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
	warningBar: {
		padding: '22px 30px',
		border: '2px solid',
		borderColor: warning,
		alignItems: 'center',
		'& p': {
			display: 'inline-block',
			marginLeft: '1em'
		},
		'& svg': {
			verticalAlign: 'middle'
		}
	},
	successBar: {
		padding: '22px 30px',
		border: '2px solid',
		borderColor: success,
		alignItems: 'center',
		'& p': {
			display: 'inline-block',
			marginLeft: '1em'
		},
		'& svg': {
			verticalAlign: 'middle'
		}
	},
	checkIcon: {
		fill: success
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
		<Grid container>
			<Grid item>
				<div className={classes.backButtonContainer}>
					<Button variant="outlined" color="secondary" size="small" onClick={onBack}>
						<Typography variant="subtitle2" color="secondary" className={classes.bold}>
							‹ Back
						</Typography>
					</Button>
				</div>
			</Grid>
			<Grid item className={classes.container}>
				<Grid
					container
					justify="flex-start"
					alignItems="flex-start"
					className={classes.title}
				>
					<div>
						<FlagCountryName code={countryCode} />
					</div>
					<Typography variant="body2" gutterBottom className="region">
						{program.Region}
					</Typography>
				</Grid>
				<Grid container className={classes.contentContainer}>
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
							<Grid
								container
								direction="row"
								justify="space-between"
								alignItems="flex-start"
							>
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
							<IncorporationsKYC
								requirements={requirements}
								templateId={templateId}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
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
