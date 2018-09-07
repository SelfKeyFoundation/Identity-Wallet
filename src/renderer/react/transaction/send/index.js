import React from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';
import TransactionSendBox from './containers/transaction-send-box';

export class TransactionSendBoxWrapper extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<TransactionSendBox {...this.props} />
			</Provider>
		);
	}
}

export default TransactionSendBoxWrapper;
