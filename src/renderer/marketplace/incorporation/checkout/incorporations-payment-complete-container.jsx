import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors, kycOperations } from 'common/kyc';
import { incorporationsSelectors } from 'common/incorporations';
import { transactionSelectors } from 'common/transaction';
import { MarketplaceIncorporationsComponent } from '../common/marketplace-incorporations-component';
import { MarketplaceProcessStarted } from '../../common/marketplace-process-started';

const styles = theme => ({});

const VENDOR_EMAIL = `support@flagtheory.com`;

class IncorporationsPaymentCompleteContainer extends MarketplaceIncorporationsComponent {
	async componentWillMount() {
		await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: true });
	}

	async componentDidMount() {
		const { transaction, companyCode, program, vendorId } = this.props;

		this.saveTransactionHash();
		this.clearRelyingParty();

		this.trackEcommerceTransaction({
			transactionHash: transaction.transactionHash,
			price: program.price,
			code: companyCode,
			jurisdiction: program.data.region,
			rpName: vendorId
		});
	}

	saveTransactionHash = async () => {
		const { transaction, program, vendorId } = this.props;
		const application = this.getLastApplication();

		if (!this.userHasPaid() && transaction) {
			await this.props.dispatch(
				kycOperations.updateRelyingPartyKYCApplicationPayment(
					vendorId,
					application.id,
					transaction.transactionHash
				)
			);

			await this.props.dispatch(
				kycOperations.updateApplicationsOperation({
					id: application.id,
					payments: {
						amount: program.price,
						amountKey: transaction.amount,
						transactionHash: transaction.transactionHash,
						date: Date.now(),
						status: 'Sent KEY'
					}
				})
			);
		} else {
			// TODO: what to do if no transaction or currentApplication exists?
			console.error('No current application or transaction');
			this.props.dispatch(push(this.cancelRoute()));
		}
	};

	getNextRoute = () => {
		return this.selfKeyIdRoute();
	};

	onBackClick = () => this.props.dispatch(push(this.cancelRoute()));

	onContinueClick = () => this.props.dispatch(push(this.getNextRoute()));

	render() {
		const body = (
			<React.Fragment>
				<Typography variant="h1" gutterBottom>
					Incorporation Process Started
				</Typography>
				<Typography variant="body1" gutterBottom>
					Thank you for payment!
				</Typography>
				<Typography variant="body2" gutterBottom>
					One of our managers is reviewing the information you submitted and{' '}
					<strong>will contact you shortly on the e-mail you provided </strong>, to
					continue the process. If you have any questions in the meantime, you can reach
					us at:
				</Typography>
				<Typography variant="body2" color="primary" gutterBottom className="email">
					{VENDOR_EMAIL}
				</Typography>
			</React.Fragment>
		);

		return (
			<MarketplaceProcessStarted
				title={`KYC Process Started`}
				body={body}
				onBackClick={this.onBackClick}
				onSelfKeyClick={this.onContinueClick}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { companyCode, vendorId } = props.match.params;
	const authenticated = true;
	return {
		companyCode,
		vendorId,
		program: incorporationsSelectors.getIncorporationsDetails(state, companyCode),
		transaction: transactionSelectors.getTransaction(state),
		address: getWallet(state).address,
		currentApplication: kycSelectors.selectCurrentApplication(state),
		rp: kycSelectors.relyingPartySelector(state, vendorId),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			vendorId,
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(IncorporationsPaymentCompleteContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as IncorporationsPaymentCompleteContainer };
