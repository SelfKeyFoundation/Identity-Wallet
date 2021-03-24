import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MoonpayChooseLoginEmailContainer from './choose-login-email-container';
import MoonpayAgreementContainer from './moonpay-agreement-container';
import MoonpayAuthErrorContainer from './auth-error-container';
import MoonPayAuthContainer from './auth-container';
import MoonPayNotAllowedContainer from './not-allowed-container';
import MoonPayEmailVerificationContainer from './email-verification-container';
import MoonPayPhoneVerificationContainer from './phone-verification-container';
import MoonPayKycContainer from './kyc-container';

export const MoonPayAuthRouter = props => {
	const { match } = props;

	return (
		<Switch>
			<Route exact path={`${match.path}`} component={MoonPayAuthContainer} />
			<Route
				exact
				path={`${match.path}/choose-email`}
				component={MoonpayChooseLoginEmailContainer}
			/>
			<Route
				exact
				path={`${match.path}/verify-email`}
				component={MoonPayEmailVerificationContainer}
			/>
			<Route
				exact
				path={`${match.path}/verify-phone`}
				component={MoonPayPhoneVerificationContainer}
			/>
			<Route
				exact
				path={`${match.path}/not-allowed`}
				component={MoonPayNotAllowedContainer}
			/>
			<Route exact path={`${match.path}/error`} component={MoonpayAuthErrorContainer} />
			<Route exact path={`${match.path}/terms`} component={MoonpayAgreementContainer} />
			<Route exact path={`${match.path}/kyc`} component={MoonPayKycContainer} />
		</Switch>
	);
};

export default MoonPayAuthRouter;
