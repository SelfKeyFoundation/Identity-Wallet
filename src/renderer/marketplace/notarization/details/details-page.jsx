import React from 'react';
import { Typography, Grid, Button, withStyles } from '@material-ui/core';
import { PageLoading, ProgramPrice } from '../../common';
import { MarketplaceNotariesIcon, CertificateIcon } from 'selfkey-ui';
import { Alert } from '../../../common';
import NotarizationDetailsPageTabs from './details-tabs';
import KycRequirementsList from '../../../kyc/requirements/requirements-list';
import KYCRequirementData from '../../../../../stories/kyc-requirements-data';

const styles = theme => ({
	pageContent: {
		width: '1080px',
		margin: '0 auto'
	},
	'@media screen and (min-width: 1230px)': {
		pageContent: {
			width: '1140px'
		}
	},
	header: {
		borderBottom: 'solid 1px #475768',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingBottom: '30px',
		marginBottom: '40px',
		marginTop: '50px'
	},
	headerTitle: {
		paddingLeft: '21px'
	},
	icon: {
		height: '36px',
		width: '36px'
	},
	backButtonContainer: {
		left: '75px',
		position: 'absolute'
	},
	tabs: {
		padding: '20px 0 0 !important',
		marginBottom: '20px'
	},
	container: {
		width: '100%',
		margin: '0 auto',
		maxWidth: '1140px'
	},
	title: {
		padding: '22px 30px',
		background: '#2A3540',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		},
		'& .region': {
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
		minWidth: '270px',
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
	documentIcon: {
		marginRight: '10px'
	},
	alert: {
		padding: '10px 0 20px !important'
	},
	kyc: {
		padding: '10px 0 20px !important'
	},
	headerDescription: {
		marginRight: '25px'
	},
	paragraph: {
		padding: '20px 0 !important'
	}
});

export const NotarizeApplicationButton = withStyles(styles)(
	({ classes, canNotarizeApplication, startApplication, loading }) => (
		<React.Fragment>
			{canNotarizeApplication && !loading && (
				<Button variant="contained" size="large" onClick={startApplication}>
					<CertificateIcon className={classes.documentIcon} />
					Notarize Documents
				</Button>
			)}

			{canNotarizeApplication && loading && (
				<Button variant="contained" size="large" disabled>
					Loading ...
				</Button>
			)}
		</React.Fragment>
	)
);

export const NotarizationDetailsPage = withStyles(styles)(props => {
	const { classes, tab, onTabChange, onBackClick, loading, keyRate = 1500000 } = props;
	return (
		<Grid container>
			<Grid item>
				<div className={classes.backButtonContainer}>
					<Button
						id="backToMarketplace"
						variant="outlined"
						color="secondary"
						size="small"
						onClick={onBackClick}
					>
						<Typography variant="subtitle2" color="secondary" className={classes.bold}>
							‹ Back
						</Typography>
					</Button>
				</div>
			</Grid>
			{loading && <PageLoading />}
			{!loading && (
				<Grid item>
					<Grid
						id="bankAccounts"
						container
						direction="column"
						justify="flex-start"
						alignItems="stretch"
						className={classes.pageContent}
					>
						<Grid item id="header" className={classes.header}>
							<MarketplaceNotariesIcon className={classes.icon} />
							<Typography variant="h1" className={classes.headerTitle}>
								Notaries
							</Typography>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item className={classes.container}>
							<Grid
								id="bankAccountDetails"
								container
								justify="flex-start"
								alignItems="flex-start"
								className={classes.title}
							>
								<Typography variant="body2" className="region">
									Get your documents notarized!
								</Typography>
							</Grid>
							<Grid container className={classes.contentContainer}>
								<Grid
									container
									direction="column"
									justify="flex-start"
									alignItems="stretch"
									spacing={40}
									className={classes.content}
								>
									<Grid item className={classes.paragraph}>
										<Grid
											container
											direction="row"
											justify="space-between"
											alignItems="flex-start"
											wrap="nowrap"
										>
											<Grid item className={classes.headerDescription}>
												<Typography variant="body1">
													Notarization doesn’t have to be a hassle
													anymore. Step in the 21st centry, and conduct
													your business for the comfort of your own home.
													The US base notaries services are recognized
													world wide. All you have to do is to upload the
													documents you want notarised, and have the
													availability to take a short video call with a
													notary. Check the list bellow, with supported
													document types, to see what we currently support
													for the online notarization service.
												</Typography>
											</Grid>
											<Grid item className={classes.applyButton}>
												<NotarizeApplicationButton
													canNotarizeApplication={true}
													price="1500"
													loading={loading}
													keyRate={keyRate}
												/>
												<ProgramPrice
													id="fees"
													price="122330"
													rate={keyRate}
													label="Pricing: $"
												/>
											</Grid>
										</Grid>
									</Grid>
									<Grid item className={classes.alert}>
										<Alert type="warning">
											<Typography variant="subtitle2" color="secondary">
												Please make sure that your intended recipient
												accepts documents notarized online and
												electronically signed, before placing your order.
											</Typography>
										</Alert>
									</Grid>
									<Grid item className={classes.tabs}>
										<NotarizationDetailsPageTabs
											{...props}
											tab={tab}
											onTabChange={onTabChange}
										/>
									</Grid>
									<Grid item className={classes.kyc}>
										<KycRequirementsList
											requirements={KYCRequirementData}
											title="KYC Requirements and Forms"
										/>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			)}
		</Grid>
	);
});

export default NotarizationDetailsPage;
