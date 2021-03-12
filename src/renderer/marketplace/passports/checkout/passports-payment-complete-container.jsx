import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/styles';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors, kycOperations } from 'common/kyc';
import { marketplaceSelectors } from 'common/marketplace';
import { transactionSelectors } from 'common/transaction';
import { ordersSelectors } from 'common/marketplace/orders';
import { MarketplacePassportsComponent } from '../common/marketplace-passports-component';
import { PassportsPaymentComplete } from './payment-complete';
import { identitySelectors } from 'common/identity';

const styles = theme => ({});

class PassportsPaymentCompleteContainerComponent extends MarketplacePassportsComponent {
	async componentWillMount() {
		await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: true });
	}

	async componentDidMount() {
		const { order, jurisdiction, vendorId } = this.props;

		this.saveTransactionHash();
		this.clearRelyingParty();

		this.trackEcommerceTransaction({
			transactionHash: order.paymentHash,
			price: jurisdiction.price,
			code: jurisdiction.data.accountCode,
			jurisdiction: jurisdiction.data.region,
			rpName: vendorId
		});
	}

	saveTransactionHash = async () => {
		const { order, transaction, jurisdiction, vendorId } = this.props;
		const application = this.getLastApplication();
		const transactionHash = order ? order.paymentHash : transaction.transactionHash;
		const amountKey = order ? order.amount : transaction.amount;

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
						amount: jurisdiction.price,
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
			this.props.dispatch(push(this.cancelRoute()));
		}
	};

	getNextRoute = () => {
		// INFO: should we check if bank is already selected ?
		return this.selectBankRoute();
	};

	onBackClick = () => this.props.dispatch(push(this.cancelRoute()));

	onContinueClick = () => this.props.dispatch(push(this.getNextRoute()));

	render() {
		const { vendor, identity } = this.props;
		return (
			<PassportsPaymentComplete
				email={vendor.contactEmail}
				identity={identity}
				onBackClick={this.onBackClick}
				onContinueClick={this.onContinueClick}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { accountCode, vendorId, templateId, orderId } = props.match.params;
	const authenticated = true;
	const identity = identitySelectors.selectIdentity(state);
	return {
		identity,
		accountCode,
		templateId,
		vendorId,
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
		jurisdiction: marketplaceSelectors.selectBankJurisdictionByAccountCode(
			state,
			accountCode,
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

const styledComponent = withStyles(styles)(PassportsPaymentCompleteContainerComponent);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as PassportsPaymentCompleteContainer };
