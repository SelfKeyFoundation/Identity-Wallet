import React, { Component } from 'react';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';
import { Grid, Tab, Tabs, Button, Typography } from '@material-ui/core';
import IncorporationsTaxView from './components/tax-view';
import IncorporationsLegalView from './components/legal-view';
import FlagCountryName from '../common/flag-country-name';
import TreatiesMap from '../common/treaties-map';
import TreatiesTable from '../common/treaties-table';
import IncorporationsCountryInfo from '../common/country-info';
import IncorporationsKYC from '../common/kyc-requirements';
import { incorporationsSelectors, incorporationsOperations } from 'common/incorporations';

const styles = {
	container: {
		width: '100%',
		margin: '0 auto',
		maxWidth: '960px'
	},
	backButtonContainer: {
		marginBottom: '1em'
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
		'& span.region': {
			marginLeft: '1em',
			marginTop: '0.5em',
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
		width: '100%'
	},
	resumeTable: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		background: '#2A3540',
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
		margin: '0 0.5em',
		maxWidth: '250px',
		'& button': {
			width: '100%',
			marginBottom: '1em'
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
};

function TabContainer({ children }) {
	return <div>{children}</div>;
}

/* ==========================================================================
   Received props:
   ---------------
   countryCode: country two letter code
   programCode: program specific code (from airtable)
   program: program details
   isLoading: still loading data
   treaties: tax treaties for this specific country/jurisdiction
   ==========================================================================
*/

class IncorporationsDetailView extends Component {
	state = {
		selectedTab: 0
	};

	componentDidMount() {
		if (!this.props.treaties || !this.props.treaties.length) {
			this.props.dispatch(
				incorporationsOperations.loadIncorporationsTaxTreatiesOperation(
					this.props.countryCode
				)
			);
		}
	}

	handleChange = (event, selectedTab) => {
		this.setState({ selectedTab });
	};

	render() {
		// const { program, countryCode, classes, isLoading, treaties } = this.props;
		const { program, countryCode, classes, treaties } = this.props;
		const { selectedTab } = this.state;
		const { translation, tax } = program;

		// Troubleshooting log
		// console.log(program);
		// console.log(isLoading);
		// console.log(treaties);

		return (
			<div>
				<div className={classes.backButtonContainer}>
					<Button
						variant="outlined"
						size="small"
						onClick={() => this.props.onBackClick(false, false)}
					>
						Back
					</Button>
				</div>
				<div className={classes.container}>
					<Grid container justify="left" alignItems="left" className={classes.title}>
						<div>
							<FlagCountryName code={countryCode} />
						</div>
						<div>
							<span className="region">{program.Region}</span>
						</div>
					</Grid>
					<div className={classes.contentContainer}>
						<Grid
							container
							justify="left"
							alignItems="left"
							className={classes.content}
						>
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
							<div className={classes.applyButton}>
								<Button variant="contained" size="large">
									Start Incorporation
								</Button>
							</div>
						</Grid>
						<Grid
							container
							justify="left"
							alignItems="left"
							className={classes.content}
						>
							<Tabs
								value={selectedTab}
								onChange={this.handleChange}
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
									label="Legal"
									classes={{
										root: classes.tabRoot,
										label: classes.tabLabel,
										labelContainer: classes.tabLabelContainer,
										wrapper: classes.tabWrapper
									}}
								/>
								<Tab
									label="Taxes"
									classes={{
										root: classes.tabRoot,
										label: classes.tabLabel,
										labelContainer: classes.tabLabelContainer,
										wrapper: classes.tabWrapper
									}}
								/>
								<Tab
									label="Country Details"
									classes={{
										root: classes.tabRoot,
										label: classes.tabLabel,
										labelContainer: classes.tabLabelContainer,
										wrapper: classes.tabWrapper
									}}
								/>
								<Tab
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
										<IncorporationsCountryInfo
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

							<IncorporationsKYC />
						</Grid>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		program: incorporationsSelectors.getIncorporationsDetails(state, props.companyCode),
		treaties: incorporationsSelectors.getTaxTreaties(state, props.countryCode),
		isLoading: incorporationsSelectors.getLoading(state)
	};
};

export default connect(mapStateToProps)(injectSheet(styles)(IncorporationsDetailView));
