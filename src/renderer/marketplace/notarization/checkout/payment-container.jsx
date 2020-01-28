import BN from 'bignumber.js';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { featureIsEnabled } from 'common/feature-flags';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors } from 'common/kyc';
import { pricesSelectors } from 'common/prices';
import { ordersOperations } from 'common/marketplace/orders';
import { MarketplaceNotariesComponent } from '../common/marketplace-notaries-component';

const styles = theme => ({});
const VENDOR_NAME = 'SelfKey Certifier';

class NotarizationPaymentContainer extends MarketplaceNotariesComponent {
	async componentDidMount() {
		await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: true });
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

		this.props.dispatch(
			ordersOperations.startOrderOperation({
				productInfo: `SelfKey Notarization`,
				applicationId: application.id,
				amount: price,
				vendorId,
				itemId: companyCode,
				vendorDID,
				vendorName,
				backUrl: this.cancelRoute(),
				completeUrl: this.paymentCompleteRoute(),
				vendorWallet: featureIsEnabled('paymentContract') ? '' : walletAddress
			})
		);
	}

	render = () => null;
}

const mapStateToProps = (state, props) => {
	const { companyCode, templateId, vendorId } = props.match.params;
	const authenticated = true;
	return {
		companyCode,
		templateId,
		vendorId,
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
