import React from 'react';
import { connect } from 'react-redux';
import { identitySelectors } from 'common/identity';
import { Typography, Grid, withStyles } from '@material-ui/core';
import { CorporateComponent } from '../common/corporate-component';
import { CorporateDashboardTabs } from './dashboard-tabs';

// TODO: replace with real data
const dummyMembers = [
	{
		id: '1',
		name: 'Giacomo Guilizzoni',
		type: 'Person',
		role: 'Director, Shareholder',
		citizenship: 'Italy',
		residency: 'Singapore',
		shares: '45%'
	},
	{
		id: '2',
		name: 'Marco Botton Ltd',
		type: 'Corporate',
		role: 'Shareholder',
		citizenship: 'Hong Kong',
		residency: 'Hong Kong',
		shares: '9%'
	},
	{
		id: '3',
		name: 'Big Things Ltd',
		type: 'Corporate',
		role: 'Shareholder',
		citizenship: 'Hong Kong',
		residency: 'Hong Kong',
		shares: '41%'
	},
	{
		id: '4',
		name: 'John Dafoe',
		type: 'Person',
		role: 'Director',
		citizenship: 'France',
		residency: 'France',
		shares: '5%'
	}
];

const dummyCorporateCapTable = [
	{
		type: 'Person',
		role: 'Director',
		name: 'John Doe',
		email: 'john.doe@email.com',
		citizenship: 'Italy',
		residency: 'Singapore',
		shares: 0.5,
		children: []
	},
	{
		type: 'Corporate',
		role: 'Shareholder',
		name: 'ACME Inc',
		email: null,
		citizenship: 'Hong Kong',
		residency: 'Hong Kong',
		shares: 0.09,
		children: dummyMembers
	},
	{
		type: 'Corporate',
		role: 'Shareholder',
		name: 'Apple Inc',
		email: null,
		citizenship: 'U.S.A.',
		residency: 'U.S.A.',
		shares: 0.41,
		children: []
	}
];

const styles = theme => ({
	container: {
		width: '100%'
	},
	title: {
		padding: '0'
	},
	contentContainer: {
		borderBottom: '1px solid #303C49'
	}
});
class CorporateDashboardContainer extends CorporateComponent {
	state = {
		tab: 'overview'
	};

	onTabChange = tab => this.setState({ tab });

	render() {
		const { classes } = this.props;
		const { tab } = this.state;
		console.log(this.props);
		return (
			<Grid
				id="corpWalletDashboard"
				container
				direction="column"
				justify="flex-start"
				alignItems="stretch"
				className={classes.container}
			>
				<Grid item id="header">
					<Typography variant="h1" className={classes.title}>
						SelfKey Corporate Vault
					</Typography>
				</Grid>
				<Grid container className={classes.contentContainer}>
					<CorporateDashboardTabs
						{...this.props}
						tab={tab}
						onTabChange={this.onTabChange}
					/>
				</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		identity: identitySelectors.selectCurrentIdentity(state),
		profile: identitySelectors.selectCurrentCorporateProfile(state),
		applications: [], // marketplace applications,
		members: dummyMembers,
		cap: dummyCorporateCapTable
	};
};

const connectedComponent = connect(mapStateToProps)(CorporateDashboardContainer);
const styledComponent = withStyles(styles)(connectedComponent);
export { styledComponent as CorporateDashboardContainer };
