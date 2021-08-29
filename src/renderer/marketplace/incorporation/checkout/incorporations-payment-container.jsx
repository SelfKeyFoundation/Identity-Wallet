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
import { MarketplaceIncorporationsComponent } from '../common/marketplace-incorporations-component';

const styles = theme => ({});

class IncorporationsPaymentContainer extends MarketplaceIncorporationsComponent {
	async componentDidMount() {
		await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: true });
		await this.createOrder();
	}

	priceInKEY = priceUSD => {
		return new BN(priceUSD).dividedBy(this.props.keyRate).toString();
	};

	async createOrder() {
		const { program, companyCode, vendorId, vendor } = this.props;
		const application = this.getLastApplication();
		const price = this.priceInKEY(program.price);
		const walletAddress = program.walletAddress;
		const vendorDID = program.didAddress;
		const vendorName = vendor.name;

		this.props.dispatch(
			ordersOperations.startOrderOperation({
				productInfo: `Incorporate in ${program.data.region}`,
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

	onBackClick = () => this.props.dispatch(push(this.cancelRoute()));

	onPayClick = () => this.props.dispatch(push(this.paymentCompleteRoute()));

	render = () => null;
}

const mapStateToProps = (state, props) => {
	const { companyCode, templateId, vendorId } = props.match.params;
	const authenticated = true;
	return {
		companyCode,
		templateId,
		vendorId,
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
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

const styledComponent = withStyles(styles)(IncorporationsPaymentContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as IncorporationsPaymentContainer };
