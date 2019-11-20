import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
	CorporateDashboardContainer,
	CorporateWizardContainer,
	CorporateAddMemberContainer,
	CorporateEditMemberContainer
} from '../corporate';

class CorporateContainerComponent extends PureComponent {
	render() {
		const { match } = this.props;

		return (
			<React.Fragment>
				<Route
					exact="1"
					path={`${match.path}`}
					render={props => <CorporateDashboardContainer {...props} />}
				/>
				<Route
					path={`${match.path}/dashboard`}
					render={props => <CorporateDashboardContainer {...props} />}
				/>
				<Route
					path={`${match.path}/create-corporate-profile`}
					render={props => <CorporateWizardContainer {...props} />}
				/>
				<Route
					path={`${match.path}/setup-corporate-profile/:identityId`}
					render={props => <CorporateWizardContainer {...props} />}
				/>
				<Route
					path={`${match.path}/add-member/:parentId?`}
					render={props => <CorporateAddMemberContainer {...props} />}
				/>
				<Route
					path={`${match.path}/edit-member/:identityId/:parentId`}
					render={props => <CorporateEditMemberContainer {...props} />}
				/>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({});

const connectedComponent = connect(mapStateToProps)(CorporateContainerComponent);
export { connectedComponent as CorporateContainer };
export default connectedComponent;
