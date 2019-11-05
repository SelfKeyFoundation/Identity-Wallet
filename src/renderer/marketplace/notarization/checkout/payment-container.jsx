import BN from 'bignumber.js';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { featureIsEnabled } from 'common/feature-flags';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors } from 'common/kyc';
import { pricesSelectors } from 'common/prices';
import { marketplaceSelectors } from 'common/marketplace';
import { ordersOperations } from 'common/marketplace/orders';
import { MarketplaceNotariesComponent } from '../common/marketplace-notaries-component';

const styles = theme => ({});
const VENDOR_NAME = 'Far Horizon Capital Inc';

class NotarizationPaymentContainer extends MarketplaceNotariesComponent {
	async componentDidMount() {
		await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: true });
		await this.createOrder();
	}

	priceInKEY = priceUSD => {
		return new BN(priceUSD).dividedBy(this.props.keyRate).toString();
	};

	async createOrder() {
		// const { program, companyCode } = this.props;
		const companyCode = 'companyCode';
		const application = this.getLastApplication();
		// const price = this.priceInKEY(program.price);
		const price = 2017;
		// const walletAddress = program.walletAddress;
		const walletAddress = '0x23d233933c86f93b74705cf0d236b39f474249f8';
		const vendorId = 'flagtheory_notarization';
		// const vendorDID = program.didAddress;
		const vendorDID = '0xee10a3335f48e10b444e299cf017d57879109c1e32cec3e31103ceca7718d0ec';
		// TODO: get vendor name from RP store
		const vendorName = VENDOR_NAME;

		this.props.dispatch(
			ordersOperations.startOrderOperation({
				productInfo: `Notarization Test`,
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
	console.log('lofasz: ');
	console.log(props.match.params);
	return {
		companyCode,
		templateId,
		vendorId,
		program: marketplaceSelectors.selectIncorporationByFilter(
			state,
			c => c.data.companyCode === companyCode
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

const styledComponent = withStyles(styles)(NotarizationPaymentContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as NotarizationPaymentContainer };
