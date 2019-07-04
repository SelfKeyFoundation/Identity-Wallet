import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransactionProcessingPopup } from '../../common/transaction-processing-popup';
import { ordersOperations } from '../../../common/marketplaces/orders';

class MarketplaceOrderTxInProgressContainer extends Component {
	handleCloseAction = _ => {
		this.props.dispatch(ordersOperations.hideCurrentPaymentUIOperation());
	};

	render() {
		return (
			<React.Fragment>
				<TransactionProcessingPopup
					closeAction={this.handleCloseAction}
					title="Processing"
				/>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {};
};

const connectedComponent = connect(mapStateToProps)(MarketplaceOrderTxInProgressContainer);

export { connectedComponent as MarketplaceOrderTxInProgressContainer };

export default connectedComponent;
