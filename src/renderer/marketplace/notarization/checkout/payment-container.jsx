import BN from 'bignumber.js';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { featureIsEnabled } from 'common/feature-flags';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors, kycOperations } from 'common/kyc';
import { marketplaceSelectors } from 'common/marketplace';
import { identitySelectors } from 'common/identity';
import { pricesSelectors } from 'common/prices';
import { ordersOperations } from 'common/marketplace/orders';
import { MarketplaceNotariesComponent } from '../common/marketplace-notaries-component';

const styles = theme => ({});

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
		const { vendor, vendorId, productId, product, documents, message } = this.props;

		const application = this.getLastApplication();
		const priceUSD = product.price * documents.length;
		const price = this.priceInKEY(priceUSD);
		const vendorName = vendor.name;
		const vendorDID = vendor.paymentAddress;

		if (documents.length > 0) {
			const attributes = documents.map(document => document.type.url);

			// Send user message to notary via KYCC messages API
			if (message) {
				await this.props.dispatch(
					kycOperations.postKYCApplicationChat({
						rpName: vendorId,
						application,
						message
					})
				);
			}

			// Add additional requirements to this KYCC application
			await this.props.dispatch(
				kycOperations.addAdditionalTemplateRequirements({
					rpName: vendorId,
					application,
					attributes
				})
			);

			// Upload the addtional files to KYCC
			await this.props.dispatch(
				kycOperations.uploadAdditionalFiles({
					rpName: vendorId,
					application,
					files: documents
				})
			);
		}

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
				vendorWallet: featureIsEnabled('paymentContract') ? '' : vendor.paymentAddress
			})
		);
	}

	render = () => null;
}

const mapStateToProps = (state, props) => {
	const { templateId, vendorId, productId, documentList } = props.match.params;
	const authenticated = true;
	const identity = identitySelectors.selectIdentity(state);
	const profile = identitySelectors.selectIndividualProfile(state);
	const documents = documentList
		? documentList
				.split(',')
				.map(documentId => profile.documents.find(d => d.id === +documentId))
		: [];

	return {
		templateId,
		vendorId,
		productId,
		documents,
		message: kycSelectors.selectMessages(state),
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
