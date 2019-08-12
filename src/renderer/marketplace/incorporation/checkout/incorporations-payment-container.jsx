import BN from 'bignumber.js';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { featureIsEnabled } from 'common/feature-flags';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors } from 'common/kyc';
import { pricesSelectors } from 'common/prices';
import { incorporationsSelectors } from 'common/incorporations';
import { ordersOperations } from 'common/marketplace/orders';
import { MarketplaceIncorporationsComponent } from '../common/marketplace-incorporations-component';

const styles = theme => ({});
// TODO: future improvement load from rp config
const VENDOR_NAME = 'Far Horizon Capital Inc';

class IncorporationsPaymentContainer extends MarketplaceIncorporationsComponent {
	async componentDidMount() {
		await this.loadRelyingParty({ rp: 'incorporations', authenticated: true });
		await this.createOrder();
	}

	priceInKEY = priceUSD => {
		return new BN(priceUSD).dividedBy(this.props.keyRate).toString();
	};

	async createOrder() {
		const { program } = this.props;
		const { companyCode } = this.props.match.params;
		const application = this.getLastApplication();
		const price = this.priceInKEY(program.price);
		const walletAddress = program.walletAddress;
		const vendorDID = program.didAddress;

		this.props.dispatch(
			ordersOperations.startOrderOperation({
				applicationId: application.id,
				amount: price,
				vendorId: 'FlagTheory',
				itemId: companyCode,
				vendorDID,
				productInfo: `Incorporate in ${program.Region}`,
				vendorName: VENDOR_NAME,
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
	const { companyCode } = props.match.params;
	const authenticated = true;
	return {
		program: incorporationsSelectors.getIncorporationsDetails(state, companyCode),
		publicKey: getWallet(state).publicKey,
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		currentApplication: kycSelectors.selectCurrentApplication(state),
		rp: kycSelectors.relyingPartySelector(state, 'incorporations'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'incorporations',
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(IncorporationsPaymentContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as IncorporationsPaymentContainer };
