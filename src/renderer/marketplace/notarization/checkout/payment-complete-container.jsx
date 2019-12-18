import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors, kycOperations } from 'common/kyc';
import { transactionSelectors } from 'common/transaction';
import { marketplaceSelectors } from 'common/marketplace';
import { ordersSelectors } from 'common/marketplace/orders';
import { MarketplaceNotariesComponent } from '../common/marketplace-notaries-component';
import { MarketplaceProcessStarted } from '../../common/marketplace-process-started';

const styles = theme => ({});

class NotarizationPaymentCompleteContainer extends MarketplaceNotariesComponent {
	async componentWillMount() {
		await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: true });
	}

	async componentDidMount() {
		const { order, companyCode, program, vendorId } = this.props;

		this.saveTransactionHash();
		this.clearRelyingParty();

		this.trackEcommerceTransaction({
			transactionHash: order.paymentHash,
			price: program.price,
			code: companyCode,
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
	const { companyCode, vendorId, orderId } = props.match.params;
	const authenticated = true;
	return {
		companyCode,
		vendorId,
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
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
