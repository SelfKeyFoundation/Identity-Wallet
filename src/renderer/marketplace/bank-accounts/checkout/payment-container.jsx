import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors } from 'common/kyc';
import { bankAccountsOperations, bankAccountsSelectors } from 'common/bank-accounts';
import { MarketplaceComponent } from '../../common/marketplace-component';
import { PaymentContract } from '../../common/payment-contract';

const styles = theme => ({});
const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = '/main/marketplace-bank-accounts';

class BankAccountsPaymentContainer extends MarketplaceComponent {
	async componentDidMount() {
		await this.loadRelyingParty({ rp: 'incorporations', authenticated: true });

		if (!this.props.accountType) {
			await this.props.dispatch(bankAccountsOperations.loadBankAccountsOperation());
		}
	}

	getCancelRoute = () => {
		const { accountCode, countryCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/details/${accountCode}/${countryCode}/${templateId}`;
	};

	onBackClick = () => this.props.dispatch(push(this.getCancelRoute()));

	onPayClick = () => {
		console.error('TODO: not implemented, replace payment-complete route with correct one');

		const { accountCode, countryCode, templateId } = this.props.match.params;
		this.props.dispatch(
			push(
				`${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/payment-complete/${accountCode}/${countryCode}/${templateId}`
			)
		);
	};

	render() {
		const { accountType } = this.props;
		console.error('TODO: not implemented gas price for pre-approval');

		return (
			<PaymentContract
				whyLink={'https://help.selfkey.org/'}
				price={accountType.price}
				gas={`Not implemented`}
				onBackClick={this.onBackClick}
				onPayClick={this.onPayClick}
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

const styledComponent = withStyles(styles)(BankAccountsPaymentContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsPaymentContainer };
