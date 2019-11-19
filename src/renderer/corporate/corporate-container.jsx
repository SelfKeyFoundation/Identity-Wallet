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
				<Route exact="1" path={`${match.path}`} component={CorporateDashboardContainer} />
				<Route path={`${match.path}/dashboard`} component={CorporateDashboardContainer} />
				<Route
					path={`${match.path}/create-corporate-profile`}
					component={CorporateWizardContainer}
				/>
				<Route
					path={`${match.path}/setup-corporate-profile/:identityId`}
					component={CorporateWizardContainer}
				/>
				<Route
					path={`${match.path}/add-member/:parentId?`}
					component={CorporateAddMemberContainer}
				/>
				<Route
					path={`${match.path}/edit-member/:identityId/:parentId`}
					component={CorporateEditMemberContainer}
				/>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({});

const connectedComponent = connect(mapStateToProps)(CorporateContainerComponent);
export { connectedComponent as CorporateContainer };
export default connectedComponent;
