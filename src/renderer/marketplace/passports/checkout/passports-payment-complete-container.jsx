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
		const { order, program, vendorId } = this.props;

		this.saveTransactionHash();
		this.clearRelyingParty();

		this.trackEcommerceTransaction({
			transactionHash: order.paymentHash,
			price: program.price,
			code: program.data.programCode,
			jurisdiction: program.data.country,
			rpName: vendorId
		});
	}

	saveTransactionHash = async () => {
		const { order, transaction, program, vendorId } = this.props;
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
						amount: program.price,
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
		return this.processStartedRoute();
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
	const { programCode, vendorId, templateId, orderId } = props.match.params;
	const authenticated = true;
	const identity = identitySelectors.selectIdentity(state);
	const program = marketplaceSelectors.selectPassportsByFilter(
		state,
		c => c.data.programCode === programCode
	);
	return {
		identity,
		programCode,
		templateId,
		vendorId,
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
		program,
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
