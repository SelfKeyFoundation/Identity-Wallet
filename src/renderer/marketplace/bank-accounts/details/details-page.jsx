import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import { ApplicationStatusBar } from '../../../kyc/application/application-status';
import { MoneyIcon } from 'selfkey-ui';
import { ResumeBox, ProgramPrice, MarketplaceKycRequirements } from '../../common';
import { BankingDetailsPageTabs } from './details-tabs';
import DetailsPageLayout from '../../common/details-page-layout';

const styles = theme => ({
	container: {
		width: '100%',
		margin: '50px auto 0',
		maxWidth: '960px'
	},
	backButtonContainer: {
		left: '15px',
		position: 'absolute'
	},
	bold: {
		fontWeight: 600
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
		boxSizing: 'border-box',
		margin: 0
	},
	applyButton: {
		maxWidth: '270px',
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
	moneyIcon: {
		marginRight: '18px'
	}
});

export const BankingApplicationButton = withStyles(styles)(
	({ classes, canOpenBankAccount, startApplication, loading }) => (
		<React.Fragment>
			{canOpenBankAccount && !loading && (
				<Button variant="contained" size="large" onClick={startApplication}>
					<MoneyIcon className={classes.moneyIcon} />
					Open Bank Account
				</Button>
			)}

			{canOpenBankAccount && loading && (
				<Button variant="contained" size="large" disabled>
					Loading ...
				</Button>
			)}
		</React.Fragment>
	)
);

export const BankingDetailsPage = withStyles(styles)(props => {
	const {
		classes,
		applicationStatus,
		countryCode,
		region,
		contact,
		onStatusAction,
		onBack,
		loading,
		canOpenBankAccount,
		resume = [],
		startApplication,
		keyRate,
		price,
		tab,
		kycRequirements,
		templateId,
		onTabChange
	} = props;
	return (
		<DetailsPageLayout onBack={onBack} countryCode={countryCode} title={region}>
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
							<ResumeBox itemSets={resume} />
						</Grid>
						<Grid item className={classes.applyButton}>
							<BankingApplicationButton
								canOpenBankAccount={canOpenBankAccount}
								price={price}
								loading={loading}
								startApplication={startApplication}
								keyRate={keyRate}
							/>
							<ProgramPrice price={price} rate={keyRate} label="Pricing: $" />
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<BankingDetailsPageTabs {...props} tab={tab} onTabChange={onTabChange} />
				</Grid>
				<Grid item>
					<MarketplaceKycRequirements
						requirements={kycRequirements}
						loading={loading}
						templateId={templateId}
						title="KYC Requirements and Forms"
					/>
				</Grid>
			</Grid>
		</DetailsPageLayout>
	);
});

export default BankingDetailsPage;
