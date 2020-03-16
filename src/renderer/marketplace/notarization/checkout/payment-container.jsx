import BN from 'bignumber.js';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { featureIsEnabled } from 'common/feature-flags';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors } from 'common/kyc';
import { marketplaceSelectors } from 'common/marketplace';
import { identitySelectors } from 'common/identity';
import { pricesSelectors } from 'common/prices';
import { ordersOperations } from 'common/marketplace/orders';
import { MarketplaceNotariesComponent } from '../common/marketplace-notaries-component';

const styles = theme => ({});
const VENDOR_NAME = 'SelfKey Certifier';

class NotarizationPaymentContainer extends MarketplaceNotariesComponent {
	async componentDidMount() {
		const { vendorId } = this.props;
		await this.loadRelyingParty({ rp: vendorId, authenticated: true });
		await this.createOrder();
	}

	priceInKEY = priceUSD => {
		return new BN(priceUSD).dividedBy(this.props.keyRate).toString();
	};

	async createOrder() {
		const { program, companyCode } = this.props;
		// const companyCode = 'companyCode';
		const application = this.getLastApplication();
		const price = this.priceInKEY(program.price);
		// const price = 2017;
		const walletAddress = program.walletAddress;
		// const walletAddress = '0x24233C848BdA9AD4559772763aC869d6305D177e';
		const vendorId = 'selfkey_certifier';
		const vendorDID = program.didAddress;
		// const vendorDID = '0x96a101c36b1ac67098d85e4fac750ac538ed9800942ac5def9272c19accced9e';
		const vendorName = VENDOR_NAME;
		/*
		const { product, vendor, vendorId, productId } = this.props;
		const application = this.getLastApplication();
		const price = this.priceInKEY(product.price);
		const vendorDID = vendor.paymentAddress;
		const vendorName = vendor.name;
		*/

		this.props.dispatch(
			ordersOperations.startOrderOperation({
				productInfo: `SelfKey Notarization`,
				applicationId: application.id,
				amount: price,
				vendorId,
				itemId: productId,
				vendorDID,
				vendorName,
				backUrl: this.cancelRoute(),
				completeUrl: this.paymentCompleteRoute(),
				vendorWallet: featureIsEnabled('paymentContract') ? '' : vendor.paymentAddres
			})
		);
	}

	render = () => null;
}

const mapStateToProps = (state, props) => {
	const { templateId, vendorId, productId } = props.match.params;
	const authenticated = true;
	const identity = identitySelectors.selectIdentity(state);

	return {
		templateId,
		vendorId,
		productId,
		product: marketplaceSelectors.selectInventoryItemByFilter(
			state,
			'notaries',
			p => p.sku === productId,
			identity.type
		),
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
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

const styledComponent = withStyles(styles)(NotarizationPaymentContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as NotarizationPaymentContainer };
