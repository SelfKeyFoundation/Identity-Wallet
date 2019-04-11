import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { incorporationsSelectors, incorporationsOperations } from 'common/incorporations';
import { kycSelectors, kycOperations } from 'common/kyc';
import { walletSelectors } from 'common/wallet';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Tab, Tabs, Button, Typography } from '@material-ui/core';
import { WarningShieldIcon, CertificateIcon, success, warning } from 'selfkey-ui';
import { CheckOutlined } from '@material-ui/icons';
import IncorporationsTaxView from './components/tax-view';
import IncorporationsLegalView from './components/legal-view';
import {
	FlagCountryName,
	TreatiesMap,
	TreatiesTable,
	CountryInfo,
	IncorporationsKYC,
	ProgramPrice,
	sanitize,
	getIncorporationPrice
} from '../common';
import ReactPiwik from 'react-piwik';

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
		justifyContent: 'space-between'
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
	tabsRoot: {
		borderBottom: '1px solid #697C95',
		width: '100%'
	},
	tabsIndicator: {
		backgroundColor: '#00C0D9'
	},
	tabRoot: {
		color: '#FFFFFF',
		textAlign: 'center',
		padding: '0',
		minWidth: '150px'
	},
	tabLabelContainer: {
		padding: '0',
		textTransform: 'Capitalize'
	},
	tabWrapper: {
		padding: '0',
		textTransform: 'Capitalize'
	},
	tabLabel: {
		color: '#FFFFFF'
	},
	tabContainer: {
		width: '100%',
		padding: '2em 0',
		color: '#FFFFFF',
		'& p': {
			marginBottom: '1.5em',
			lineHeight: '1.4em'
		},
		'& strong': {
			fontWeight: 'bold',
			color: theme.palette.secondary.main,
			display: 'block',
			padding: '0',
			borderBottom: '1px solid #435160',
			marginBottom: '0.5em',
			marginTop: '0em'
		},
		'& ul': {
			listStyle: 'outside',
			lineHeight: '1.4em',
			marginLeft: '1.5em',
			marginBottom: '1.5em'
		},
		'& ul li': {
			lineHeight: '1.4em',
			marginBottom: '0.5em'
		},
		'& a': {
			color: theme.palette.secondary.main
		}
	},
	tabDescription: {
		marginTop: '40px'
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
		marginRight: '20px'
	}
});

function TabContainer({ children }) {
	return <div>{children}</div>;
}

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

class IncorporationsDetailView extends Component {
	state = {
		selectedTab: 0,
		loading: false
	};

	setEcommerceView = () => {
		const { program } = this.props;

		ReactPiwik.push([
			'setEcommerceView',
			program['Company code'],
			program.Region,
			'Incorporation',
			program['Wallet Price']
		]);
	};

	clearEcommerceCart = () => {
		ReactPiwik.push(['clearEcommerceCart']);
	};

	async componentDidMount() {
		window.scrollTo(0, 0);

		const { treaties, rpShouldUpdate } = this.props;
		const { countryCode } = this.props.match.params;
		const notAuthenticated = false;

		if (!treaties || !treaties.length) {
			this.props.dispatch(
				incorporationsOperations.loadIncorporationsTaxTreatiesOperation(countryCode)
			);
		}

		if (rpShouldUpdate) {
			await this.props.dispatch(
				kycOperations.loadRelyingParty('incorporations', notAuthenticated)
			);
		}

		this.setEcommerceView();
	}

	componentWillUnmount() {
		this.clearEcommerceCart();
	}

	handleExternalLinks = e => {
		if (e.target && e.target.getAttribute('href')) {
			e.stopPropagation();
			e.preventDefault();
			window.openExternal(e, e.target.getAttribute('href'));
		}
	};

	onTabChange = (event, selectedTab) => this.setState({ selectedTab });

	onBackClick = () => this.props.dispatch(push(`/main/marketplace-incorporation`));

	onStartClick = () => {
		const { rp, wallet } = this.props;
		const { countryCode, companyCode, templateId } = this.props.match.params;
		const selfkeyIdRequiredRoute = '/main/marketplace-selfkey-id-required';
		const payRoute = `/main/marketplace-incorporation/pay/${companyCode}/${countryCode}/${templateId}`;
		const cancelRoute = `/main/marketplace-incorporation/details/${companyCode}/${countryCode}/${templateId}`;
		const authenticated = true;

		// When clicking the start incorporations, we check if an authenticated kyc-chain session exists
		// If it doesn't we trigger a new authenticated rp session and redirect to checkout route
		this.setState({ loading: true }, async () => {
			if (!wallet.isSetupFinished) {
				return this.props.dispatch(push(selfkeyIdRequiredRoute));
			}
			if (!rp || !rp.authenticated) {
				await this.props.dispatch(
					kycOperations.loadRelyingParty(
						'incorporations',
						authenticated,
						payRoute,
						cancelRoute
					)
				);
			} else {
				await this.props.dispatch(push(payRoute));
			}
		});
	};

	onPayClick = () => {
		const { countryCode, companyCode, templateId } = this.props.match.params;

		this.props.dispatch(
			push(
				`/main/marketplace-incorporation/pay-confirmation/${companyCode}/${countryCode}/${templateId}`
			)
		);
	};

	getPrice = () => {
		const { program } = this.props;
		return getIncorporationPrice(program);
	};

	getLastApplication = () => {
		const { rp } = this.props;
		const { templateId } = this.props.match.params;
		// For easy kyc testing, use the following test templateId
		// const templateId = '5c6fadbf77c33d5c28718d7b';
		if (!rp || !rp.authenticated) return false;

		const { applications } = this.props.rp;
		if (!applications || applications.length === 0) return false;

		let application;
		let index = applications.length - 1;
		for (; index >= 0; index--) {
			if (applications[index].template === templateId) {
				application = applications[index];
				break;
			}
		}
		return application;
	};

	userHasApplied = () => {
		const application = this.getLastApplication();
		return !!application;
	};

	userHasPaid = () => {
		const application = this.getLastApplication();
		if (!application || !application.payments) {
			return false;
		}
		return !!application.payments.length;
	};

	applicationWasRejected = () => {
		const application = this.getLastApplication();
		if (!application) {
			return false;
		}
		// Process is cancelled or Process is rejected
		return application.currentStatus === 3 || application.currentStatus === 8;
	};

	applicationCompleted = () => {
		const application = this.getLastApplication();
		if (!application) {
			return false;
		}
		return application.currentStatus === 2;
	};

	// Can only incorporate if:
	// - there is a valid price for this jurisdiction (from airtable)
	// - templateId exists for this jurisdiction (from airtable)
	// - user has not applied before or previous application was rejected
	canIncorporate = () => {
		const { templateId } = this.props.match.params;
		const price = this.getPrice();

		if (this.props.rp && this.props.rp.authenticated) {
			return !!(
				templateId &&
				price &&
				(!this.userHasApplied() || this.applicationWasRejected())
			);
		} else {
			return !!(templateId && price);
		}
	};

	renderApplicationStatus = () => {
		if (this.applicationCompleted()) return this.renderApplicationCompletedAlert();

		if (this.applicationWasRejected()) return this.renderApplicationRejectedAlert();

		if (this.userHasPaid()) return this.renderInProgressAlert();

		if (this.userHasApplied()) return this.renderUnpaidAlert();

		return null;
	};

	renderApplicationCompletedAlert = () => {
		const { classes } = this.props;
		return (
			<Grid
				container
				direction="row"
				justify="flex-start"
				alignItems="flex-start"
				className={classes.successBar}
			>
				<Grid item xs={12}>
					<CheckOutlined className={classes.checkIcon} />
					<Typography variant="body2" color="secondary">
						Your application was successful
					</Typography>
				</Grid>
			</Grid>
		);
	};

	renderApplicationRejectedAlert = () => {
		const { classes } = this.props;
		return (
			<Grid
				container
				direction="row"
				justify="flex-start"
				alignItems="flex-start"
				className={classes.warningBar}
			>
				<Grid item xs={12}>
					<WarningShieldIcon />
					<Typography variant="body2" color="secondary">
						Your previous application was rejected
					</Typography>
				</Grid>
			</Grid>
		);
	};

	renderInProgressAlert = () => {
		const { classes } = this.props;
		return (
			<Grid
				container
				direction="row"
				justify="flex-start"
				alignItems="flex-start"
				className={classes.warningBar}
			>
				<Grid item xs={12}>
					<WarningShieldIcon />
					<Typography variant="body2" color="secondary">
						You have an existing <strong>in progress</strong> application, please
						contact support@flagtheory.com for further details
					</Typography>
				</Grid>
			</Grid>
		);
	};

	renderUnpaidAlert = () => {
		const { classes } = this.props;
		return (
			<Grid
				container
				direction="row"
				justify="flex-start"
				alignItems="flex-start"
				className={classes.warningBar}
			>
				<Grid item xs={9}>
					<WarningShieldIcon />
					<Typography variant="body2" color="secondary">
						You have an existing <strong>unpaid</strong> application
					</Typography>
				</Grid>
				<Grid item xs={3} style={{ textAlign: 'right' }}>
					<Button variant="contained" onClick={this.onPayClick}>
						Pay
					</Button>
				</Grid>
			</Grid>
		);
	};

	render() {
		const { program, classes, treaties, keyRate } = this.props;
		const { countryCode, templateId } = this.props.match.params;
		const { selectedTab } = this.state;
		const { translation, tax } = program;

		return (
			<React.Fragment>
				<div className={classes.backButtonContainer}>
					<Button
						variant="outlined"
						color="secondary"
						size="small"
						onClick={() => this.props.dispatch(push(`/main/marketplace-incorporation`))}
					>
						<Typography variant="subtitle2" color="secondary" className={classes.bold}>
							‹ Back
						</Typography>
					</Button>
				</div>
				<div className={classes.container}>
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
					<div className={classes.contentContainer}>
						{this.renderApplicationStatus()}
						<Grid
							container
							justify="flex-start"
							alignItems="flex-start"
							className={classes.content}
						>
							<div className={classes.programBrief}>
								<div className={classes.resumeTable}>
									<div>
										<label>Offshore Tax</label>
										<Typography variant="h4" gutterBottom>
											{tax['Offshore Income Tax Rate'] || '--'}
										</Typography>
									</div>
									<div>
										<label>Dividends received</label>
										<Typography variant="h4" gutterBottom>
											{tax['Dividends Received'] || '--'}
										</Typography>
									</div>
								</div>
								<div className={classes.resumeTable}>
									<div>
										<label>Corp Income</label>
										<Typography variant="h4" gutterBottom>
											{tax['Corporate Tax Rate'] || '--'}
										</Typography>
									</div>
									<div>
										<label>Dividends paid</label>
										<Typography variant="h4" gutterBottom>
											{tax['Dividends Withholding Tax Rate'] || '--'}
										</Typography>
									</div>
								</div>
								<div className={classes.resumeTable}>
									<div>
										<label>Capital Gains</label>
										<Typography variant="h4" gutterBottom>
											{tax['Capital Gains Tax Rate'] || '--'}
										</Typography>
									</div>
									<div>
										<label>Royalties paid</label>
										<Typography variant="h4" gutterBottom>
											{tax['Royalties Withholding Tax Rate'] || '--'}
										</Typography>
									</div>
								</div>
								<div className={classes.resumeTable}>
									<div>
										<label>Interests paid</label>
										<Typography variant="h4" gutterBottom>
											{tax['Interests Withholding Tax Rate'] || '--'}
										</Typography>
									</div>
								</div>
							</div>
							<div className={classes.applyButton}>
								<React.Fragment>
									{this.canIncorporate() && !this.state.loading && (
										<Button
											variant="contained"
											size="large"
											onClick={this.onStartClick}
										>
											<CertificateIcon className={classes.certificateIcon} />
											Incorporate Now
										</Button>
									)}

									{this.canIncorporate() && this.state.loading && (
										<Button variant="contained" size="large" disabled>
											Loading ...
										</Button>
									)}
									<ProgramPrice
										price={this.getPrice()}
										rate={keyRate}
										label="Pricing: $"
									/>
								</React.Fragment>
							</div>
						</Grid>
						<Grid
							container
							justify="flex-start"
							alignItems="center"
							className={classes.content}
						>
							<Tabs
								value={selectedTab}
								onChange={this.onTabChange}
								classes={{
									root: classes.tabsRoot,
									indicator: classes.tabsIndicator
								}}
							>
								<Tab
									label="Description"
									classes={{
										root: classes.tabRoot,
										label: classes.tabLabel,
										labelContainer: classes.tabLabelContainer,
										wrapper: classes.tabWrapper
									}}
								/>
								<Tab
									disabled={!program.details}
									label="Legal"
									classes={{
										root: classes.tabRoot,
										label: classes.tabLabel,
										labelContainer: classes.tabLabelContainer,
										wrapper: classes.tabWrapper
									}}
								/>
								<Tab
									disabled={!tax}
									label="Taxes"
									classes={{
										root: classes.tabRoot,
										label: classes.tabLabel,
										labelContainer: classes.tabLabelContainer,
										wrapper: classes.tabWrapper
									}}
								/>
								<Tab
									disabled={!translation}
									label="Country Details"
									classes={{
										root: classes.tabRoot,
										label: classes.tabLabel,
										labelContainer: classes.tabLabelContainer,
										wrapper: classes.tabWrapper
									}}
								/>
								<Tab
									disabled={!treaties}
									label="Tax Treaties"
									classes={{
										root: classes.tabRoot,
										label: classes.tabLabel,
										labelContainer: classes.tabLabelContainer,
										wrapper: classes.tabWrapper
									}}
								/>
								<Tab
									label="Services"
									classes={{
										root: classes.tabRoot,
										label: classes.tabLabel,
										labelContainer: classes.tabLabelContainer,
										wrapper: classes.tabWrapper
									}}
								/>
							</Tabs>
							<div
								className={classes.tabContainer}
								onClickCapture={this.handleExternalLinks}
							>
								{selectedTab === 0 && (
									<TabContainer className="description">
										<div
											dangerouslySetInnerHTML={{
												__html: sanitize(translation.introduction)
											}}
										/>
									</TabContainer>
								)}
								{selectedTab === 1 && (
									<TabContainer className="legal">
										<IncorporationsLegalView data={program.details} />
										<div
											dangerouslySetInnerHTML={{
												__html: sanitize(translation.legal_paragraph)
											}}
											className={classes.tabDescription}
										/>
									</TabContainer>
								)}
								{selectedTab === 2 && (
									<TabContainer className="taxes">
										<IncorporationsTaxView tax={tax} />
										<div
											dangerouslySetInnerHTML={{
												__html: sanitize(translation.taxes_paragraph)
											}}
											className={classes.tabDescription}
										/>
									</TabContainer>
								)}
								{selectedTab === 3 && (
									<TabContainer className="country-details">
										<CountryInfo
											countryCode={countryCode}
											translation={translation}
										/>
									</TabContainer>
								)}
								{selectedTab === 4 && (
									<TabContainer className="tax-treaties">
										<TreatiesMap data={treaties} />
										<TreatiesTable data={treaties} />
									</TabContainer>
								)}
								{selectedTab === 5 && (
									<TabContainer className="Services">
										<div
											dangerouslySetInnerHTML={{
												__html: sanitize(program.wallet_description)
											}}
										/>
									</TabContainer>
								)}
							</div>

							<IncorporationsKYC
								requirements={this.props.requirements}
								templateId={templateId}
							/>
						</Grid>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { companyCode, countryCode, templateId } = props.match.params;
	const notAuthenticated = false;
	return {
		program: incorporationsSelectors.getIncorporationsDetails(state, companyCode),
		treaties: incorporationsSelectors.getTaxTreaties(state, countryCode),
		isLoading: incorporationsSelectors.getLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		rp: kycSelectors.relyingPartySelector(state, 'incorporations'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'incorporations',
			notAuthenticated
		),
		requirements: kycSelectors.selectRequirementsForTemplate(
			state,
			'incorporations',
			templateId
		),
		wallet: walletSelectors.getWallet(state)
	};
};

const styledComponent = withStyles(styles)(IncorporationsDetailView);
export default connect(mapStateToProps)(styledComponent);
