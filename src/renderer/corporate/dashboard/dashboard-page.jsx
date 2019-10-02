import React from 'react';
import { Typography, Grid, withStyles } from '@material-ui/core';
import { CorporateComponent } from '../common/corporate-component';
import { CorporateDashboardTabs } from './dashboard-tabs';

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
class CorporateDashboardPage extends CorporateComponent {
	state = {
		tab: 'overview'
	};

	onTabChange = tab => this.setState({ tab });

	onEditCorporateDetails = () => this.setState({ tab: 'information' });

	render() {
		const { classes } = this.props;
		const { tab } = this.state;
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
						SelfKey Corporate Wallet
					</Typography>
				</Grid>
				<Grid item className={classes.contentContainer}>
					<CorporateDashboardTabs
						{...this.props}
						onEditCorporateDetails={this.onEditCorporateDetails}
						tab={tab}
						onTabChange={this.onTabChange}
					/>
				</Grid>
			</Grid>
		);
	}
}

const styledComponent = withStyles(styles)(CorporateDashboardPage);
export { styledComponent as CorporateDashboardPage };
