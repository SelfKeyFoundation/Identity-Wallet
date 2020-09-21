import React, { PureComponent } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { IndividualDashboardTabs } from './dashboard-tabs';

const styles = theme => ({
	container: {
		width: '100%'
	},
	title: {
		padding: '0'
	},
	header: {
		marginBottom: theme.spacing(6)
	}
});
class IndividualDashboardPage extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			tab: props.match.params.tab || 'overview'
		};
	}

	onTabChange = tab => this.setState({ tab });

	render() {
		const { classes } = this.props;
		const { tab } = this.state;
		return (
			<Grid
				id="individualWalletDashboard"
				container
				direction="column"
				justify="flex-start"
				alignItems="stretch"
				className={classes.container}
			>
				<Grid item id="header" className={classes.header}>
					<Typography variant="h1" className={classes.title}>
						Selfkey Profile
					</Typography>
				</Grid>
				<Grid item className={classes.contentContainer}>
					<IndividualDashboardTabs
						tab={tab}
						onTabChange={this.onTabChange}
						{...this.props}
					/>
				</Grid>
			</Grid>
		);
	}
}

const styledComponent = withStyles(styles)(IndividualDashboardPage);
export { styledComponent as IndividualDashboardPage };
