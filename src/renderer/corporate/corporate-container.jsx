import React, { PureComponent } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { identitySelectors } from 'common/identity';
import {
	CorporateDashboardContainer,
	CorporateWizardContainer,
	CorporateMemberContainer
} from '../corporate';

class CorporateContainerComponent extends PureComponent {
	render() {
		const { match, isIndividual } = this.props;

		return (
			<Switch>
				<Route
					exact="1"
					path={`${match.path}/create-corporate-profile`}
					render={props => <CorporateWizardContainer {...props} />}
				/>
				<Route
					exact="1"
					path={`${match.path}/add-member`}
					render={props => <CorporateMemberContainer {...props} />}
				/>
				{isIndividual && <Redirect to={`/main/individual`} />}
				<Route
					exact="1"
					path={`${match.path}`}
					render={props => <CorporateDashboardContainer {...props} />}
				/>
				<Route
					exact="1"
					path={`${match.path}/dashboard`}
					render={props => <CorporateDashboardContainer {...props} />}
				/>
				<Route
					path={`${match.path}/dashboard/:tab`}
					render={props => <CorporateDashboardContainer {...props} />}
				/>
				<Route
					path={`${match.path}/setup-corporate-profile/:identityId`}
					render={props => <CorporateWizardContainer {...props} />}
				/>
				<Route
					path={`${match.path}/add-member/:parentId`}
					render={props => <CorporateMemberContainer {...props} />}
				/>
				<Route
					path={`${match.path}/edit-member/:parentId/:identityId`}
					render={props => <CorporateMemberContainer {...props} />}
				/>
			</Switch>
		);
	}
}

const mapStateToProps = state => ({
	isIndividual: identitySelectors.isIndividualIdentity(state)
});

const connectedComponent = connect(mapStateToProps)(CorporateContainerComponent);
export { connectedComponent as CorporateContainer };
export default connectedComponent;
