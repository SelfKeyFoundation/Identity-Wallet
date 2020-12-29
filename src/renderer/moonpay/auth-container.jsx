import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withNavFlow } from '../navigation/with-flow-hoc';
import MoonpayAuthModal from './auth-modal';
import MoonpayChooseLoginEmailContainer from './choose-login-email-container';
import MoonpayAgreementContainer from './moonpay-agreement-container';
import { useSelector, useDispatch } from 'react-redux';
import { moonPayOperations, moonPaySelectors } from '../../common/moonpay';
import MoonpayAuthErrorModal from './auth-error';

export const MoonPayAuthContainer = withNavFlow(props => {
	const { match, onNext, onStepUpdate, ...otherProps } = props;

	const email = useSelector(moonPaySelectors.getLoginEmail);

	const previousAuthentication = useSelector(moonPaySelectors.hasAuthenticatedPreviously);
	const dispatch = useDispatch();

	const handleChooseDifferentEmail = async () => {
		await onStepUpdate({ next: '/main/moonpay/loading' });
		onNext();
		dispatch(moonPayOperations.setLoginEmail(null));
	};

	const handleNext = async () => {
		await onStepUpdate({ next: '/main/moonpay/loading' });
		onNext();
		dispatch(
			moonPayOperations.authOperation({
				email,
				completeUrl: '/main/moonpay/loading',
				cancelUrl: '/main/moonpay/loading'
			})
		);
	};

	return (
		<Switch>
			<Route
				exact
				path={`${match.path}`}
				render={() => (
					<MoonpayAuthModal
						{...otherProps}
						email={email}
						onChooseEmail={
							!previousAuthentication ? handleChooseDifferentEmail : undefined
						}
						onNext={handleNext}
					/>
				)}
			/>
			<Route
				exact
				path={`${match.path}/choose-email`}
				component={MoonpayChooseLoginEmailContainer}
			/>
			<Route
				exact
				path={`${match.path}/choose-email`}
				component={MoonpayChooseLoginEmailContainer}
			/>
			<Route
				exact
				path={`${match.path}/error`}
				render={props => {
					const Component = withNavFlow(MoonpayAuthErrorModal);
					return <Component {...props} />;
				}}
			/>
			<Route exact path={`${match.path}/terms`} component={MoonpayAgreementContainer} />
		</Switch>
	);
});

export default MoonPayAuthContainer;
