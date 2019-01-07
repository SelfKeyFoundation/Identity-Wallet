import React from 'react';
import { Provider } from 'react-redux';
import store from '../../common/store';
import TransactionSendProgressBox from './containers/transaction-send-progress-box';

export class TransactionSendProgressBoxWrapper extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<TransactionSendProgressBox {...this.props} />
			</Provider>
		);
	}
}

export default TransactionSendProgressBoxWrapper;
