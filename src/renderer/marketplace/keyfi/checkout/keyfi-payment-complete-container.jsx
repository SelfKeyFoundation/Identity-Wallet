import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/styles';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors, kycOperations } from 'common/kyc';
import { marketplaceSelectors } from 'common/marketplace';
import { transactionSelectors } from 'common/transaction';
import { ordersSelectors } from 'common/marketplace/orders';
import { MarketplaceKeyFiComponent } from '../common/marketplace-keyfi-component';
import { KeyFiPaymentComplete } from './keyfi-payment-complete';
import { identitySelectors } from 'common/identity';

const styles = theme => ({});

class MarketplaceKeyFiPaymentCompleteContainer extends MarketplaceKeyFiComponent {
	async componentWillMount() {
		await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: true });
	}

	async componentDidMount() {
		const { order, product, vendorId } = this.props;

		if (order) {
			this.saveTransactionHash();
			this.clearRelyingParty();
			this.trackEcommerceTransaction({
				transactionHash: order.paymentHash,
				price: product.price,
				code: product.sku,
				rpName: vendorId
			});
		}
	}

	saveTransactionHash = async () => {
		const { order, transaction, product, vendorId } = this.props;
		const application = this.getLastApplication();
		const transactionHash = order ? order.paymentHash : transaction.transactionHash;
		const amountCryptoCurrency = order ? order.amount : transaction.amount;

		if (!this.userHasPaid() && transactionHash) {
			await this.props.dispatch(
				kycOperations.updateRelyingPartyKYCApplicationPayment(
					vendorId,
					application.id,
					transactionHash
				)
			);

			await this.props.dispatch(
				kycOperations.updateApplicationsOperation({
					id: application.id,
					payments: {
						amount: product.price,
						amountCryptoCurrency,
						transactionHash,
						date: Date.now(),
						status: `Sent ${order.cryptoCurrency}`
					}
				})
			);
		} else {
			// TODO: what to do if no order or currentApplication exists?
			console.error('No current application or order');
			this.props.dispatch(push(this.cancelRoute()));
		}
	};

	getNextRoute = () => this.selfKeyIdRoute();

	onBackClick = () => this.props.dispatch(push(this.cancelRoute()));

	onContinueClick = () => this.props.dispatch(push(this.getNextRoute()));

	render() {
		const { vendor } = this.props;
		return (
			<KeyFiPaymentComplete
				email={vendor.contactEmail}
				onBackClick={this.onBackClick}
				onContinueClick={this.onContinueClick}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { productId, templateId, vendorId, orderId } = props.match.params;
	const authenticated = true;
	const identity = identitySelectors.selectIdentity(state);
	const product = marketplaceSelectors.selectInventoryItemBySku(
		state,
		'keyfi_kyc',
		identity.type
	);
	const order = orderId ? ordersSelectors.getOrder(state, orderId) : null;
	return {
		productId,
		templateId,
		vendorId,
		product,
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
		transaction: transactionSelectors.getTransaction(state),
		address: getWallet(state).address,
		currentApplication: kycSelectors.selectCurrentApplication(state),
		order,
		rp: kycSelectors.relyingPartySelector(state, vendorId),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			vendorId,
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(MarketplaceKeyFiPaymentCompleteContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as MarketplaceKeyFiPaymentCompleteContainer };
