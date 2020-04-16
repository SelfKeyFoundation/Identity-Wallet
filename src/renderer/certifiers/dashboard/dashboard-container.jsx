import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import DashboardPageTabs from './dashboard-tabs';

const styles = theme => ({
	pageContent: {
		width: '1080px',
		margin: '0 auto'
	},
	'@media screen and (min-width: 1230px)': {
		pageContent: {
			maxWidth: '1140px',
			width: '1140px'
		}
	},
	tabs: {
		padding: '20px 0 0 !important',
		marginBottom: '20px'
	}
});

class CertifiersDashboardContainer extends PureComponent {
	state = {
		tab: 'overview'
	};

	onTabChange = tab => this.setState({ tab });

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.pageContent}>
				<Typography variant="h1">Certifiers Dashboard</Typography>
				<div className={classes.tabs}>
					<DashboardPageTabs
						{...this.props}
						tab={this.state.tab}
						onTabChange={this.onTabChange}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {};

const styledComponent = withStyles(styles)(CertifiersDashboardContainer);
const CertifiersDashboard = connect(mapStateToProps)(styledComponent);
export default CertifiersDashboard;
