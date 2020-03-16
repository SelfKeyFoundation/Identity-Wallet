import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors, kycOperations } from 'common/kyc';
import { transactionSelectors } from 'common/transaction';
import { marketplaceSelectors } from 'common/marketplace';
import { identitySelectors } from 'common/identity';
import { ordersSelectors } from 'common/marketplace/orders';
import { MarketplaceNotariesComponent } from '../common/marketplace-notaries-component';
import { MarketplaceProcessStarted } from '../../common/marketplace-process-started';

const styles = theme => ({});

class NotarizationPaymentCompleteContainer extends MarketplaceNotariesComponent {
	async componentWillMount() {
		const { vendorId } = this.props;
		await this.loadRelyingParty({ rp: vendorId, authenticated: true });
	}

	async componentDidMount() {
		const { order, product, productId, vendorId } = this.props;

		this.saveTransactionHash();
		this.clearRelyingParty();

		this.trackEcommerceTransaction({
			transactionHash: order.paymentHash,
			price: product.price,
			code: productId,
			rpName: vendorId
		});
	}

	saveTransactionHash = async () => {
		const { order, transaction, product, vendorId, dispatch } = this.props;
		const application = this.getLastApplication();

		const transactionHash = order ? order.paymentHash : transaction.transactionHash;
		const amountKey = order ? order.amount : transaction.amount;

		if (!this.userHasPaid() && transactionHash) {
			await dispatch(
				kycOperations.updateRelyingPartyKYCApplicationPayment(
					vendorId,
					application.id,
					transactionHash
				)
			);

			await dispatch(
				kycOperations.updateApplicationsOperation({
					id: application.id,
					payments: {
						amount: product.price,
						amountKey,
						transactionHash,
						date: Date.now(),
						status: 'Sent KEY'
					}
				})
			);
		} else {
			// TODO: what to do if no order or currentApplication exists?
			console.error('No current application or order');
			dispatch(push(this.cancelRoute()));
		}
	};

	getNextRoute = () => this.selfKeyIdRoute();

	onBackClick = () => this.props.dispatch(push(this.cancelRoute()));

	onContinueClick = () => this.props.dispatch(push(this.getNextRoute()));

	render() {
		const { vendor } = this.props;
		const body = (
			<React.Fragment>
				<Typography variant="h1" gutterBottom>
					Notarization Process Started
				</Typography>
				<Typography variant="body1" gutterBottom>
					Thank you for payment!
				</Typography>
				<Typography variant="body1" gutterBottom>
					One of our our notaries is reviewing the information you submitted and{' '}
					<strong>
						will contact you shortly to continue the process and set up a live call with
						you.
					</strong>{' '}
					The call is intended for identity verification and to prove that you are in a
					clear state of mind. If you have any questions in the meantime, you can reach us
					at:
				</Typography>
				<Typography variant="body2" color="primary" gutterBottom className="email">
					{vendor.contactEmail}
				</Typography>
			</React.Fragment>
		);

		return (
			<MarketplaceProcessStarted
				title={`Notarization KYC Process`}
				body={body}
				onBackClick={this.onBackClick}
				onSelfKeyClick={this.onContinueClick}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { productId, vendorId, orderId } = props.match.params;
	const authenticated = true;
	const identity = identitySelectors.selectIdentity(state);
	return {
		productId,
		vendorId,
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
		product: marketplaceSelectors.selectInventoryItemByFilter(
			state,
			'notaries',
			p => p.sku === productId,
			identity.type
		),
		transaction: transactionSelectors.getTransaction(state),
		address: getWallet(state).address,
		currentApplication: kycSelectors.selectCurrentApplication(state),
		order: ordersSelectors.getOrder(state, orderId),
		rp: kycSelectors.relyingPartySelector(state, vendorId),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			vendorId,
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(NotarizationPaymentCompleteContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as NotarizationPaymentCompleteContainer };
