import BN from 'bignumber.js';
import config from 'common/config';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors } from 'common/kyc';
import { pricesSelectors } from 'common/prices';
import { bankAccountsSelectors } from 'common/bank-accounts';
import { ordersOperations } from 'common/marketplaces/orders';
import { MarketplaceBankAccountsComponent } from '../common/marketplace-bank-accounts-component';

const styles = theme => ({});
const VENDOR_NAME = 'Far Horizon Capital Inc';
const VENDOR_DID = '0xee10a3335f48e10b444e299cf017d57879109c1e32cec3e31103ceca7718d0ec';
const CRYPTOCURRENCY = config.constants.primaryToken;

class BankAccountsPaymentContainer extends MarketplaceBankAccountsComponent {
	async componentDidMount() {
		await this.loadRelyingParty({ rp: 'incorporations', authenticated: true });
		await this.loadBankAccounts();
		await this.createOrder();
	}

	priceInKEY = priceUSD => {
		return new BN(priceUSD).dividedBy(this.props.keyRate).toString();
	};

	async createOrder() {
		const { accountType } = this.props;
		const { accountCode } = this.props.match.params;
		const application = this.getLastApplication();
		const price = this.priceInKEY(accountType.price);

		this.props.dispatch(
			ordersOperations.startOrderOperation({
				applicationId: application.id,
				amount: price,
				vendorId: 'FlagTheory',
				itemId: accountCode,
				vendorDID: VENDOR_DID,
				productInfo: `Bank account in ${accountType.region}`,
				vendorName: VENDOR_NAME,
				backUrl: this.cancelRoute(),
				completeUrl: this.paymentCompleteRoute()
			})
		);
	}

	onBackClick = () => this.props.dispatch(push(this.cancelRoute()));

	onPayClick = () => this.props.dispatch(push(this.selectBankRoute()));

	render = () => null;
}

const mapStateToProps = (state, props) => {
	const { accountCode } = props.match.params;
	const authenticated = true;

	return {
		accountType: bankAccountsSelectors.getTypeByAccountCode(state, accountCode),
		banks: bankAccountsSelectors.getDetailsByAccountCode(state, accountCode),
		publicKey: getWallet(state).publicKey,
		keyRate: pricesSelectors.getRate(state, CRYPTOCURRENCY, 'USD'),
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
