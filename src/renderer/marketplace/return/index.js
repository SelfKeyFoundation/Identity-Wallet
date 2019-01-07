import React from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';
import ReturnContainer from './containers/return';
import { UnlockBox } from 'selfkey-ui';

export const ReturnWrapper = props => {
	return (
		<Provider store={store}>
			<UnlockBox text="Return KEY Deposit" closeAction={props.closeAction}>
				<ReturnContainer {...props} />
			</UnlockBox>
		</Provider>
	);
};

export default ReturnWrapper;
