import React from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';
import UnlockContainer from './containers/unlock';
import { UnlockBox } from 'selfkey-ui';

export const UnlockWrapper = props => {
	return (
		<Provider store={store}>
			<UnlockBox closeAction={props.closeAction}>
				<UnlockContainer {...props} />
			</UnlockBox>
		</Provider>
	);
};

export default UnlockWrapper;
