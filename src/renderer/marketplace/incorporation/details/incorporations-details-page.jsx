import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Button, Typography } from '@material-ui/core';
import { ApplicationStatusBar } from '../../../kyc/application/application-status';
import { CertificateIcon, BackButton } from 'selfkey-ui';
import { FlagCountryName, ResumeBox, ProgramPrice, MarketplaceKycRequirements } from '../../common';
import { IncorporationsDetailsTabs } from './incorporations-details-tabs';

const styles = theme => ({
	container: {
		width: '100%',
		margin: '50px auto 0',
		maxWidth: '960px'
	},
	title: {
		// padding: '22px 30px',
		padding: theme.spacing(3, 4),
		background: '#2A3540',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		},
		'& .region': {
			marginLeft: theme.spacing(2),
			marginTop: theme.spacing(0.5),
			marginBottom: theme.spacing(0),
			fontSize: '24px'
		}
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px'
	},
	content: {
		background: '#262F39',
		// padding: '45px 30px 50px',
		padding: theme.spacing(6, 4),
		width: '100%',
		justifyContent: 'space-between',
		boxSizing: 'border-box',
		margin: 0
	},
	applyButton: {
		maxWidth: '270px',
		textAlign: 'right',
		'& button': {
			width: '100%',
			marginBottom: theme.spacing(2)
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
	contentHeader: {
		marginBottom: theme.spacing(5)
	},
	barStyle: {
		// padding: '25px 30px 0'
		padding: theme.spacing(3, 4, 0)
	}
});

const buttonStyles = theme => ({
	certificateIcon: {
		// marginRight: '18px'
		marginRight: theme.spacing(2)
	}
});

export const IncorporationsApplicationButton = withStyles(buttonStyles)(
	({ classes, canIncorporate, startApplication, loading }) => (
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
		</React.Fragment>
	)
);

export const IncorporationsDetailsPage = withStyles(styles)(props => {
	const {
		classes,
		applicationStatus,
		countryCode,
		region,
		contact,
		resume,
		onStatusAction,
		onBack,
		loading,
		canIncorporate,
		startApplication,
		keyRate,
		price,
		tab,
		kycRequirements,
		templateId,
		onTabChange
	} = props;
	return (
		<Grid container>
			<Grid item>
				<BackButton onclick={onBack} />
			</Grid>
			<Grid item className={classes.container}>
				<Grid
					id="incorporationsDetails"
					container
					justify="flex-start"
					alignItems="flex-start"
					className={classes.title}
				>
					<div>
						<FlagCountryName code={countryCode} />
					</div>
					<Typography variant="body2" gutterBottom className="region">
						{region}
					</Typography>
				</Grid>
				<Grid container className={classes.contentContainer}>
					<ApplicationStatusBar
						status={applicationStatus}
						contact={contact}
						statusAction={onStatusAction}
						loading={loading}
						barStyle={classes.barStyle}
					/>
					<Grid
						container
						direction="column"
						justify="flex-start"
						alignItems="stretch"
						spacing={5}
						className={classes.content}
					>
						<Grid
							container
							direction="row"
							justify="space-between"
							alignItems="flex-start"
							className={classes.contentHeader}
						>
							<Grid item>
								<ResumeBox itemSets={resume} />
							</Grid>
							<Grid item className={classes.applyButton}>
								<IncorporationsApplicationButton
									canIncorporate={canIncorporate}
									price={price}
									loading={loading}
									startApplication={startApplication}
									keyRate={keyRate}
								/>
								<ProgramPrice
									id="fees"
									price={price}
									rate={keyRate}
									label="Pricing: $"
								/>
							</Grid>
						</Grid>
						<IncorporationsDetailsTabs {...props} tab={tab} onTabChange={onTabChange} />
						<MarketplaceKycRequirements
							requirements={kycRequirements}
							loading={loading}
							templateId={templateId}
							title="KYC Requirements and Forms"
						/>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
});

export default IncorporationsDetailsPage;
