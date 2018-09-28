import React from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';
import Unlock from './containers/unlock';
import { UnlockBox } from 'selfkey-ui';

export const UnlockWrapper = props => {
	return (
		<Provider store={store}>
			<UnlockBox closeAction={props.closeAction}>
				<Unlock
					minGasPrice={11800000000}
					maxGasPrice={13000000000}
					gasLimit={45000}
					fiat="USD"
					fiatRate={217.73}
					{...props}
					onCancel={props.closeAction}
					onConfirm={props.confirmAction}
				/>
			</UnlockBox>
		</Provider>
	);
};

export default UnlockWrapper;
