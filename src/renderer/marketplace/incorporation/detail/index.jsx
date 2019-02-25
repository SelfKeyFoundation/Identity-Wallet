import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { incorporationsSelectors, incorporationsOperations } from 'common/incorporations';
import { kycSelectors, kycOperations } from 'common/kyc';
import { pricesSelectors } from 'common/prices';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Tab, Tabs, Button, Typography } from '@material-ui/core';
import IncorporationsTaxView from './components/tax-view';
import IncorporationsLegalView from './components/legal-view';
import {
	FlagCountryName,
	TreatiesMap,
	TreatiesTable,
	CountryInfo,
	IncorporationsKYC,
	ProgramPrice
} from '../common';

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
			fontSize: '20px',
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
			lineHeight: '1.4em',
			maxWidth: '90%'
		},
		'& strong': {
			fontWeight: 'bold',
			color: '#93B0C1',
			display: 'block',
			padding: '6px',
			borderBottom: '1px solid #435160',
			marginBottom: '0.5em',
			marginTop: '1em'
		}
	},
	tabDescription: {
		marginTop: '40px'
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
		selectedTab: 0
	};

	componentDidMount() {
		// FIXME: refactor name to loadIncorporationsTaxTreaties
		// Reset scrolling, issue #694
		window.scrollTo(0, 0);

		if (!this.props.treaties || !this.props.treaties.length) {
			this.props.dispatch(
				incorporationsOperations.loadIncorporationsTaxTreatiesOperation(
					this.props.match.params.countryCode
				)
			);
		}

		this.props.dispatch(kycOperations.loadRelyingParty('incorporations'));
	}

	onTabChange = (event, selectedTab) => this.setState({ selectedTab });

	onBackClick = _ => this.props.dispatch(push(`/main/marketplace-incorporation`));

	onPayClick = _ =>
		this.props.dispatch(
			push(
				`/main/marketplace-incorporation/pay/${this.props.match.params.companyCode}/${
					this.props.match.params.countryCode
				}`
			)
		);

	render() {
		const { program, classes, treaties, keyRate } = this.props;
		const { countryCode } = this.props.match.params;
		const { selectedTab } = this.state;
		const { translation, tax } = program;

		// Troubleshooting log
		// console.log(program);
		// console.log(isLoading);
		// console.log(treaties);
		// console.log(program.details);

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
											{tax['Dividends Witholding Tax Rate'] || '--'}
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
											{tax['Royalties Witholding Tax Rate'] || '--'}
										</Typography>
									</div>
								</div>
								<div className={classes.resumeTable}>
									<div>
										<label>Interests paid</label>
										<Typography variant="h4" gutterBottom>
											{tax['Interests Witholding Tax Rate'] || '--'}
										</Typography>
									</div>
								</div>
							</div>
							<div className={classes.applyButton}>
								{program['Wallet Price'] && (
									<React.Fragment>
										<Button
											variant="contained"
											size="large"
											onClick={this.onPayClick}
										>
											Start Incorporation
										</Button>
										<ProgramPrice
											price={program['Wallet Price']}
											rate={keyRate}
											label="Price: "
										/>
									</React.Fragment>
								)}
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
							<div className={classes.tabContainer}>
								{selectedTab === 0 && (
									<TabContainer className="description">
										<div
											dangerouslySetInnerHTML={{
												__html: translation['introduction']
											}}
										/>
									</TabContainer>
								)}
								{selectedTab === 1 && (
									<TabContainer className="legal">
										<IncorporationsLegalView data={program.details} />
										<div
											dangerouslySetInnerHTML={{
												__html: translation['legal_paragraph']
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
												__html: translation['taxes_paragraph']
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
										{program['Wallet description']}
									</TabContainer>
								)}
							</div>

							<IncorporationsKYC requirements={this.props.requirements} />
						</Grid>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { companyCode, countryCode, templateId } = props.match.params;
	console.log(`Loading program data for ${companyCode} - templateId ${templateId}`);

	return {
		program: incorporationsSelectors.getIncorporationsDetails(state, companyCode),
		treaties: incorporationsSelectors.getTaxTreaties(state, countryCode),
		isLoading: incorporationsSelectors.getLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		requirements: kycSelectors.selectRequirementsForTemplate(
			state,
			'incorporations',
			templateId
		)
	};
};

const styledComponent = withStyles(styles)(IncorporationsDetailView);
export default connect(mapStateToProps)(styledComponent);
