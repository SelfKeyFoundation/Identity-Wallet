import React from 'react';
import { CryptoPriceBox } from 'selfkey-ui';

class PriceBox extends React.Component {
	render() {
		console.log('this.props', this.props);
		return <CryptoPriceBox {...this.props} />;
	}
}

export default PriceBox;
