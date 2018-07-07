import React from 'react';
import { Provider } from 'react-redux';
import { getInitialStateRenderer } from 'electron-redux';
import configureStore from 'common/configure-store';
import PriceBox from './containers/price-box';

const initialState = getInitialStateRenderer();
const store = configureStore(initialState, 'renderer');

console.log('initialState', initialState);
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
