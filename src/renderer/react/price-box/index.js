import React from 'react';
import { Provider } from 'react-redux';
import store from '../common/store';
import PriceBox from './containers/price-box';

export class PriceBoxWrapper extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<PriceBox {...this.props} />
			</Provider>
		);
	}
}

export default PriceBoxWrapper;
