import React, { Component } from 'react';
import injectSheet from 'react-jss';
import { Grid, Tab, Tabs } from '@material-ui/core';
import { OutlineSecondaryButton } from 'selfkey-ui';

import FlagCountryName from '../../common/flag-country-name';

const styles = {
	container: {
		// width: '946px',
		width: '100%',
		margin: '0 auto'
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
	content: {
		background: '#262F39',
		padding: '22px 30px'
	},
	resumeTable: {
		background: '#2A3540',
		'& div': {
			padding: '10px 15px',
			width: '150px'
		},
		'& label': {
			fontSize: '13px',
			color: '#93B0C1'
		}
	},
	tabsRoot: {
		borderBottom: '1px solid #697C95'
	},
	tabsIndicator: {
		backgroundColor: '#00C0D9'
	},
	tabRoot: {
		color: '#FFFFFF',
		textAlign: 'left',
		padding: '0',
		minWidth: '100px'
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
	}
};

function TabContainer({ children }) {
	return <div>{children}</div>;
}

class IncorporationsDetailView extends Component {
	state = {
		selectedTab: 0
	};

	handleChange = (event, selectedTab) => {
		this.setState({ selectedTab });
	};

	render() {
		const { program, classes } = this.props;
		const { selectedTab } = this.state;
		return (
			<div>
				<div style={{ margin: '1em 0' }}>
					<OutlineSecondaryButton onClick={() => this.props.onBackClick(false)}>
						Back
					</OutlineSecondaryButton>
				</div>
				<div className={classes.container}>
					<Grid container justify="left" alignItems="left" className={classes.title}>
						<div>
							<FlagCountryName code={program[`Country code`]} />
						</div>
						<div>
							<span className="region">{program.Region}</span>
						</div>
					</Grid>
					<Grid container justify="left" alignItems="left" className={classes.content}>
						<div className={classes.resumeTable}>
							<div>
								<label>Offshore Tax</label>
							</div>
							<div>
								<label>Dividends received</label>
							</div>
						</div>
						<div className={classes.resumeTable}>
							<div>
								<label>Corp Income</label>
							</div>
							<div>
								<label>Dividends paid</label>
							</div>
						</div>
						<div className={classes.resumeTable}>
							<div>
								<label>Capital Gains</label>
							</div>
							<div>
								<label>Royalties paid</label>
							</div>
						</div>
						<div className={classes.resumeTable}>
							<div>
								<label>Interests paid</label>
							</div>
							<div>
								<label>Royalties paid</label>
							</div>
						</div>
					</Grid>
					<Grid container justify="left" alignItems="left" className={classes.content}>
						<Tabs
							value={selectedTab}
							onChange={this.handleChange}
							classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
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
						{selectedTab === 0 && <TabContainer>Item One</TabContainer>}
						{selectedTab === 1 && <TabContainer>Item Two</TabContainer>}
						{selectedTab === 2 && <TabContainer>Item Three</TabContainer>}
						{selectedTab === 3 && <TabContainer>Item Four</TabContainer>}
						{selectedTab === 4 && <TabContainer>Item Five</TabContainer>}
						{selectedTab === 5 && <TabContainer>Item Six</TabContainer>}
					</Grid>
				</div>
			</div>
		);
	}
}

export default injectSheet(styles)(IncorporationsDetailView);
