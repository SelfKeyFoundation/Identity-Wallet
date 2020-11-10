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
import { MarketplaceKeyFiComponent } from '../common/marketplace-keyfi-component';
import { identitySelectors } from 'common/identity';

const styles = theme => ({});

class KeyFiPayContainer extends MarketplaceKeyFiComponent {
	async componentDidMount() {
		await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: true });
		await this.createOrder();
	}

	priceInKEY = priceUSD => {
		return new BN(priceUSD * 0.8).dividedBy(this.props.keyRate).toString();
	};

	priceInETH = priceUSD => {
		return new BN(priceUSD).dividedBy(this.props.ethRate).toString();
	};

	async createOrder() {
		const { product, vendorId, vendor, cryptoCurrency } = this.props;
		const application = this.getLastApplication();
		const price =
			cryptoCurrency === 'KEY'
				? this.priceInKEY(product.price)
				: this.priceInETH(product.price);
		const walletAddress = vendor.paymentAddress;
		const vendorDID = vendor.did;
		const vendorName = vendor.name;

		this.props.dispatch(
			ordersOperations.startOrderOperation({
				productInfo: `KeyFi.ai Credential`,
				applicationId: application.id,
				amount: price,
				vendorId,
				itemId: product.sku,
				vendorDID,
				vendorName,
				backUrl: this.cancelRoute(),
				completeUrl: this.paymentCompleteRoute(),
				vendorWallet: featureIsEnabled('paymentContract') ? '' : walletAddress,
				cryptoCurrency
			})
		);
	}

	onBackClick = () => this.props.dispatch(push(this.cancelRoute()));

	onPayClick = () => this.props.dispatch(push(this.paymentCompleteRoute()));

	render = () => null;
}

const mapStateToProps = (state, props) => {
	const { productId, templateId, vendorId, cryptoCurrency } = props.match.params;
	const authenticated = true;
	const identity = identitySelectors.selectIdentity(state);
	return {
		productId,
		templateId,
		vendorId,
		cryptoCurrency,
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
		product: marketplaceSelectors.selectInventoryItemBySku(state, 'keyfi_kyc', identity.type),
		address: getWallet(state).address,
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		ethRate: pricesSelectors.getRate(state, 'ETH', 'USD'),
		currentApplication: kycSelectors.selectCurrentApplication(state),
		rp: kycSelectors.relyingPartySelector(state, vendorId),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			vendorId,
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(KeyFiPayContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as MarketplaceKeyFiPayContainer };
