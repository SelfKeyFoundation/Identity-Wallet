import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MoonPayPaymentContainer from './payment-container';
import MoonPayTransactionContainer from './transaction-container';
import MoonPaySelectCardContainer from './select-card-container';
import MoonPayTransactionFailedContainer from './transaction-failed-container';
import MoonPayTransactionCompletedContainer from './transaction-completed-container';
import MoonPayTransactionCheckContainer from './transaction-check-container';

export const MoonPayPaymentRouter = props => {
	const { match } = props;

	return (
		<Switch>
			<Route exact path={`${match.path}`} component={MoonPayPaymentContainer} />
			<Route
				exact
				path={`${match.path}/select-card`}
				component={MoonPaySelectCardContainer}
			/>

			<Route
				exact
				path={`${match.path}/transaction`}
				component={MoonPayTransactionContainer}
			/>

			<Route
				exact
				path={`${match.path}/failed`}
				component={MoonPayTransactionFailedContainer}
			/>

			<Route
				exact
				path={`${match.path}/completed`}
				component={MoonPayTransactionCompletedContainer}
			/>

			<Route
				exact
				path={`${match.path}/check`}
				component={MoonPayTransactionCheckContainer}
			/>
		</Switch>
	);
};

export default MoonPayPaymentRouter;
