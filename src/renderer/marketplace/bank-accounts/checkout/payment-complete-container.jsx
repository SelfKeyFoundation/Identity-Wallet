import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors, kycOperations } from 'common/kyc';
import { bankAccountsSelectors } from 'common/bank-accounts';
import { transactionSelectors } from 'common/transaction';
import { MarketplaceComponent } from '../../common/marketplace-component';
import { BankAccountsPaymentComplete } from './payment-complete';

const styles = theme => ({});
const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = '/main/marketplace-bank-accounts';

class BankAccountsPaymentCompleteContainer extends MarketplaceComponent {
	async componentWillMount() {
		await this.loadRelyingParty({ rp: 'incorporations', authenticated: true });
	}

	async componentDidMount() {
		const { transaction, accountType } = this.props;

		this.saveTransactionHash();
		this.clearRelyingParty();

		this.trackEcommerceTransaction({
			transactionHash: transaction.transactionHash,
			price: accountType.price,
			code: accountType.accountCode,
			jurisdiction: accountType.region,
			rpName: 'Bank Accounts'
		});
	}

	saveTransactionHash = async () => {
		// const { transaction, accountType } = this.props;
		const application = this.getLastApplication();
		// FIXME: remove this after payment is implemented, for testing purposes only
		const { accountType } = this.props;
		let transaction = this.props.transaction;
		if (!transaction || !transaction.transactionHash) {
			transaction = {
				amount: 10,
				transactionHash: 'test-hash-not-real'
			};
		}

		if (!this.userHasPaid() && transaction) {
			await this.props.dispatch(
				kycOperations.updateRelyingPartyKYCApplicationPayment(
					'incorporations',
					application.id,
					transaction.transactionHash
				)
			);

			await this.props.dispatch(
				kycOperations.updateApplicationsOperation({
					id: application.id,
					payments: {
						amount: accountType.price,
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
			this.props.dispatch(push(this.getCancelRoute()));
		}
	};

	getCancelRoute = () => {
		const { accountCode, countryCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/details/${accountCode}/${countryCode}/${templateId}`;
	};

	getNextRoute = () => {
		const { accountCode, countryCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/select-bank/${accountCode}/${countryCode}/${templateId}`;
	};

	onBackClick = () => this.props.dispatch(push(this.getCancelRoute()));

	onContinueClick = () => this.props.dispatch(push(this.getNextRoute()));

	render() {
		return (
			<BankAccountsPaymentComplete
				email={'support@flagtheory.com'}
				onBackClick={this.onBackClick}
				onContinueClick={this.onContinueClick}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { accountCode } = props.match.params;
	const authenticated = true;
	return {
		accountType: bankAccountsSelectors.getTypeByAccountCode(state, accountCode),
		banks: bankAccountsSelectors.getDetailsByAccountCode(state, accountCode),
		transaction: transactionSelectors.getTransaction(state),
		publicKey: getWallet(state).publicKey,
		currentApplication: kycSelectors.selectCurrentApplication(state),
		rp: kycSelectors.relyingPartySelector(state, 'incorporations'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'incorporations',
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(BankAccountsPaymentCompleteContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsPaymentCompleteContainer };
