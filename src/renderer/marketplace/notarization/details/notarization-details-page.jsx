import React from 'react';
import { Typography, Button, withStyles } from '@material-ui/core';
import { PageLoading, ProgramPrice } from '../../common';
import { MarketplaceNotariesIcon, NotarizeDocumentIcon } from 'selfkey-ui';
import { Alert } from '../../../common';
import NotarizationDetailsPageTabs from './notarization-details-tabs';
import KycRequirementsList from '../../../kyc/requirements/requirements-list';
import KYCRequirementData from '../../../../../stories/kyc-requirements-data';

const styles = theme => ({
	pageContent: {
		alignItems: 'stretch',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		margin: '0 auto',
		width: '1080px'
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
		marginBottom: '20px',
		padding: '20px 0 0 !important'
	},
	container: {
		width: '100%',
		margin: '0 auto',
		maxWidth: '1140px'
	},
	title: {
		alignItems: 'flex-start',
		background: '#2A3540',
		display: 'flex',
		justifyContent: 'flex-start',
		padding: '22px 30px',
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
	content: {
		alignItems: 'stretch',
		background: '#262F39',
		border: '1px solid #303C49',
		borderRadius: '4px',
		boxSizing: 'border-box',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		margin: 0,
		padding: '22px 30px',
		width: '100%'
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
		alignItems: 'flex-start',
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'nowrap',
		justifyContent: 'space-between',
		padding: '20px 0 !important'
	}
});

export const NotarizeApplicationButton = withStyles(styles)(
	({ classes, canNotarizeApplication, startNotarization, loading }) => (
		<React.Fragment>
			{canNotarizeApplication && !loading && (
				<Button variant="contained" size="large" onClick={startNotarization}>
					<NotarizeDocumentIcon className={classes.documentIcon} />
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
	const {
		classes,
		tab,
		onTabChange,
		startNotarization,
		onBackClick,
		loading,
		keyRate = 1500000
	} = props;
	return (
		<div>
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
			{loading && <PageLoading />}
			{!loading && (
				<div>
					<div id="notarizeDocuments" className={classes.pageContent}>
						<div id="header" className={classes.header}>
							<MarketplaceNotariesIcon className={classes.icon} />
							<Typography variant="h1" className={classes.headerTitle}>
								Notaries
							</Typography>
						</div>
					</div>
					<div className={classes.container}>
						<div id="notarizeDocumentsDetails" className={classes.title}>
							<Typography variant="body2" className="region">
								Get your documents notarized!
							</Typography>
						</div>
						<div className={classes.content}>
							<div className={classes.paragraph}>
								<div className={classes.headerDescription}>
									<Typography variant="body1">
										Notarization doesn’t have to be a hassle anymore. Step in
										the 21st centry, and conduct your business for the comfort
										of your own home. The US base notaries services are
										recognized world wide. All you have to do is to upload the
										documents you want notarised, and have the availability to
										take a short video call with a notary. Check the list
										bellow, with supported document types, to see what we
										currently support for the online notarization service.
									</Typography>
								</div>
								<div className={classes.applyButton}>
									<NotarizeApplicationButton
										canNotarizeApplication={true}
										loading={loading}
										startNotarization={startNotarization}
									/>
									<ProgramPrice
										id="fees"
										price="25"
										rate={keyRate}
										label="From $"
										extraLabel="/ Document"
									/>
								</div>
							</div>
							<div className={classes.alert}>
								<Alert type="warning">
									<Typography variant="subtitle2" color="secondary">
										Please make sure that your intended recipient accepts
										documents notarized online and electronically signed, before
										placing your order.
									</Typography>
								</Alert>
							</div>
							<div className={classes.tabs}>
								<NotarizationDetailsPageTabs
									{...props}
									tab={tab}
									onTabChange={onTabChange}
								/>
							</div>
							<div className={classes.kyc}>
								<KycRequirementsList
									requirements={KYCRequirementData}
									title="KYC Requirements and Forms"
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
});

export default NotarizationDetailsPage;
