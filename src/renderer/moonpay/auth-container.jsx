import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withNavFlow } from '../navigation/with-flow-hoc';
import MoonpayAuthModal from './auth-modal';
import MoonpayChooseLoginEmailContainer from './choose-login-email-container';
import MoonpayAgreementContainer from './moonpay-agreement-container';

export const MoonPayAuthContainer = withNavFlow(props => {
	const { match, ...otherProps } = props;

	return (
		<Switch>
			<Route
				exact
				path={`${match.path}`}
				render={() => <MoonpayAuthModal {...otherProps} />}
			/>
			<Route
				exact
				path={`${match.path}/choose-email`}
				component={MoonpayChooseLoginEmailContainer}
			/>
			<Route exact path={`${match.path}/terms`} component={MoonpayAgreementContainer} />
		</Switch>
	);
});

export default MoonPayAuthContainer;
