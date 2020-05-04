import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { IndividualDashboardContainer } from '../individual';

class IndividualContainerComponent extends PureComponent {
	render() {
		const { match } = this.props;

		return (
			<React.Fragment>
				<Route
					exact="1"
					path={`${match.path}`}
					render={props => <IndividualDashboardContainer {...props} />}
				/>
				<Route
					exact="1"
					path={`${match.path}/dashboard`}
					render={props => <IndividualDashboardContainer {...props} />}
				/>
				<Route
					exact="1"
					path={`${match.path}/applications`}
					render={props => <IndividualDashboardContainer {...props} />}
				/>
				<Route
					path={`${match.path}/dashboard/:tab`}
					render={props => <IndividualDashboardContainer {...props} />}
				/>
				<Route
					path={`${match.path}/setup-individual-profile`}
					render={props => <IndividualDashboardContainer {...props} />}
				/>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({});

const connectedComponent = connect(mapStateToProps)(IndividualContainerComponent);
export { connectedComponent as IndividualContainer };
export default connectedComponent;
