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
import { MarketplacePassportsComponent } from '../common/marketplace-passports-component';

const styles = theme => ({});

class PassportsPaymentContainerComponent extends MarketplacePassportsComponent {
	async componentDidMount() {
		await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: true });
		await this.createOrder();
	}

	priceInKEY = priceUSD => {
		return new BN(priceUSD).dividedBy(this.props.keyRate).toString();
	};

	async createOrder() {
		const { program, programCode, vendorId, vendor } = this.props;
		const application = this.getLastApplication();
		const price = this.priceInKEY(program.price);
		const walletAddress = program.walletAddress;
		const vendorDID = program.didAddress;
		const vendorName = vendor.name;

		this.props.dispatch(
			ordersOperations.startOrderOperation({
				productInfo: `Passport/Residency application for ${program.data.country}`,
				applicationId: application.id,
				amount: price,
				vendorId,
				itemId: programCode,
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
	const { programCode, templateId, vendorId } = props.match.params;
	const authenticated = true;
	const program = marketplaceSelectors.selectPassportsByFilter(
		state,
		c => c.data.programCode === programCode
	);
	return {
		programCode,
		templateId,
		vendorId,
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
		program,
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

const styledComponent = withStyles(styles)(PassportsPaymentContainerComponent);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as PassportsPaymentContainer };
