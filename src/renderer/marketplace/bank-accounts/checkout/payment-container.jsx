import BN from 'bignumber.js';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/styles';
import { featureIsEnabled } from 'common/feature-flags';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors } from 'common/kyc';
import { pricesSelectors } from 'common/prices';
import { marketplaceSelectors } from 'common/marketplace';
import { ordersOperations } from 'common/marketplace/orders';
import { MarketplaceBankAccountsComponent } from '../common/marketplace-bank-accounts-component';
import { identitySelectors } from 'common/identity';

const styles = theme => ({});

class BankAccountsPaymentContainer extends MarketplaceBankAccountsComponent {
	async componentDidMount() {
		await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: true });
		await this.createOrder();
	}

	priceInKEY = priceUSD => {
		return new BN(priceUSD).dividedBy(this.props.keyRate).toString();
	};

	async createOrder() {
		const { jurisdiction, accountCode, vendorId, vendor } = this.props;
		const application = this.getLastApplication();
		const price = this.priceInKEY(jurisdiction.price);
		const walletAddress = jurisdiction.walletAddress;
		const vendorDID = jurisdiction.didAddress;
		const vendorName = vendor.name;

		this.props.dispatch(
			ordersOperations.startOrderOperation({
				productInfo: `Bank account in ${jurisdiction.data.region}`,
				applicationId: application.id,
				amount: price,
				vendorId,
				itemId: accountCode,
				vendorDID,
				vendorName,
				backUrl: this.cancelRoute(),
				completeUrl: this.paymentCompleteRoute(),
				vendorWallet: featureIsEnabled('paymentContract') ? '' : walletAddress
			})
		);
	}

	onBackClick = () => this.props.dispatch(push(this.cancelRoute()));

	onPayClick = () => this.props.dispatch(push(this.selectBankRoute()));

	render = () => null;
}

const mapStateToProps = (state, props) => {
	const { accountCode, templateId, vendorId } = props.match.params;
	const authenticated = true;
	const identity = identitySelectors.selectIdentity(state);
	return {
		accountCode,
		templateId,
		vendorId,
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
		jurisdiction: marketplaceSelectors.selectBankJurisdictionByAccountCode(
			state,
			accountCode,
			identity.type
		),
		address: getWallet(state).address,
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		currentApplication: kycSelectors.selectCurrentApplication(state),
		rp: kycSelectors.relyingPartySelector(state, vendorId),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			vendorId,
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(BankAccountsPaymentContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsPaymentContainer };
