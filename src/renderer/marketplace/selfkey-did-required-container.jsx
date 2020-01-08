import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { MarketplaceDIDRequired } from './selfkey-did-required';
import { didOperations } from 'common/did';

const MARKETPLACE_PATH = '/main/marketplace';

class MarketplaceSelfkeyDIDRequiredContainer extends PureComponent {
	handleConfirm = evt => {
		evt.preventDefault();
		this.props.dispatch(didOperations.startCreateDidFlowOperation(MARKETPLACE_PATH));
	};
	handleClose = () => {
		this.props.dispatch(push(MARKETPLACE_PATH));
	};
	handleEnterDID = evt => {
		evt.preventDefault();
		this.props.dispatch(didOperations.startAssociateDidFlowOperation(MARKETPLACE_PATH));
	};
	render() {
		return (
			<MarketplaceDIDRequired
				onConfirm={this.handleConfirm}
				onEnterDid={this.handleEnterDID}
				onClose={this.handleClose}
			/>
		);
	}
}

const connectedComponent = connect(state => ({}))(MarketplaceSelfkeyDIDRequiredContainer);

export { connectedComponent as MarketplaceSelfkeyDIDRequiredContainer };
export default connectedComponent;
