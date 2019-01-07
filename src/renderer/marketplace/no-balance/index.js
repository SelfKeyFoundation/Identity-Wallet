import React from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';
import WithoutBalance from './containers/no-balance';
import { UnlockBox } from 'selfkey-ui';

export const WithoutBalanceWrapper = props => {
	return (
		<Provider store={store}>
			<UnlockBox closeAction={props.closeAction}>
				<WithoutBalance {...props} />
			</UnlockBox>
		</Provider>
	);
};

export default WithoutBalanceWrapper;
