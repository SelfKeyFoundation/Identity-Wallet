import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Grid } from '@material-ui/core';
import { appSelectors } from 'common/app';
import { identitySelectors } from 'common/identity';
import { PersonalDashboardPage } from './personal-dashboard';
import { CorporateDashboardPage } from '../corporate';
import { UpdateNotification } from './update-notification';

class DashboardComponent extends Component {
	onAutoUpdateClick = () => this.props.dispatch(push('/auto-update'));

	render() {
		const { selectedProfile, info } = this.props;
		const Dashboard =
			selectedProfile.type === 'corporate' ? (
				<CorporateDashboardPage {...this.props} />
			) : (
				<PersonalDashboardPage {...this.props} />
			);

		return (
			<Grid
				id="viewDashboard"
				container
				direction="column"
				justify="flex-start"
				alignItems="center"
				spacing={32}
			>
				<UpdateNotification info={info} onAutoUpdate={this.onAutoUpdateClick} />
				{Dashboard}
			</Grid>
		);
	}
}

const mapStateToProps = state => {
	return {
		info: appSelectors.selectAutoUpdateInfo(state),
		selectedProfile: identitySelectors.selectCurrentIdentity(state)
	};
};

const Dashboard = connect(mapStateToProps)(DashboardComponent);
export { Dashboard };
export default Dashboard;
