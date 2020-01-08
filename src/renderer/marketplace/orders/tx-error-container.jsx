import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { TransactionErrorPopup } from '../../common/transaction-error-popup';
import { ordersOperations } from '../../../common/marketplace/orders';

class MarketplaceOrderTxErrorContainer extends PureComponent {
	handleCloseAction = _ => {
		this.props.dispatch(ordersOperations.cancelCurrentOrderOperation());
	};

	render() {
		return (
			<React.Fragment>
				<TransactionErrorPopup closeAction={this.handleCloseAction} title="Error" />
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {};
};

const connectedComponent = connect(mapStateToProps)(MarketplaceOrderTxErrorContainer);

export { connectedComponent as MarketplaceOrderTxErrorContainer };

export default connectedComponent;
