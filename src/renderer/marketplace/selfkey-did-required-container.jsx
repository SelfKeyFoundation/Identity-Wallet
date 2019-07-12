import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { MarketplaceDIDRequired } from './selfkey-did-required';

class MarketplaceSelfkeyDIDRequiredContainer extends Component {
	handleConfirm = evt => {
		evt.preventDefault();
		this.props.dispatch(push('/main/selfkeyId'));
	};
	handleClose = () => {
		this.props.dispatch(push('/main/marketplace-categories'));
	};
	render() {
		return <MarketplaceDIDRequired onConfirm={this.handleConfirm} onClose={this.handleClose} />;
	}
}

const connectedComponent = connect()(MarketplaceSelfkeyDIDRequiredContainer);

export { connectedComponent as MarketplaceSelfkeyDIDRequiredContainer };
export default connectedComponent;
