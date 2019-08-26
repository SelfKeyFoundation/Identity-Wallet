import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import config from 'common/config';
import EthUnits from 'common/utils/eth-units';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { getWallet } from 'common/wallet/selectors';
import { ethGasStationInfoSelectors, ethGasStationInfoOperations } from 'common/eth-gas-station';
import { pricesSelectors } from 'common/prices';
import { kycSelectors, kycOperations } from 'common/kyc';
import { incorporationsSelectors } from 'common/incorporations';
import { PaymentCheckout } from '../../common/payment-checkout';
import { MarketplaceIncorporationsComponent } from '../common/marketplace-incorporations-component';

const styles = theme => ({});
const CRYPTOCURRENCY = config.constants.primaryToken;
const FIXED_GAS_LIMIT_PRICE = 21000;

class IncorporationsCheckoutContainer extends MarketplaceIncorporationsComponent {
	async componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());

		await this.loadRelyingParty({ rp: 'incorporations', authenticated: true });

		this.checkIfUserCanIncorporate();
	}

	checkIfUserCanIncorporate = async () => {
		if (!this.canApply(this.props.program.price)) {
			this.props.dispatch(push(this.cancelRoute()));
		}
	};

	getProgramOptions = options => {
		if (!options) return [];
		const strArray = options.split('-');

		const optionsArray = strArray.map((text, idx) => {
			if (!text) return false;

			let price = text.match(/\(.*\)/);
			let notes = text.match(/\[.*\]/);
			const id = `options-${idx}`;

			price = price ? price[0].replace('(', '').replace(')', '') : '';
			price = price ? parseInt(price) : '';
			notes = notes ? notes[0].replace('[', '').replace(']', '') : '';

			let description = text
				.replace(/\(.*\)/, '')
				.replace(/\[.*\]/, '')
				.trim();

			return { price, notes, description, id };
		});

		return optionsArray.filter(el => el !== false);
	};

	getPaymentParameters() {
		const { keyRate, ethRate, ethGasStationInfo, cryptoCurrency, program } = this.props;
		const gasPrice = ethGasStationInfo.fast;
		const price = program.price;
		const keyAmount = price / keyRate;
		const gasLimit = FIXED_GAS_LIMIT_PRICE;
		const ethFee = EthUnits.toEther(gasPrice * gasLimit, 'gwei');
		const usdFee = ethFee * ethRate;

		return {
			cryptoCurrency,
			keyRate,
			gasPrice,
			gasLimit,
			price,
			keyAmount,
			ethFee,
			usdFee
		};
	}

	onBackClick = () => this.props.dispatch(push(this.cancelRoute()));

	onStartClick = async () => {
		const { program } = this.props;
		const { templateId } = this.props.match.params;

		this.props.dispatch(
			kycOperations.startCurrentApplicationOperation(
				'incorporations',
				templateId,
				this.payRoute(),
				this.cancelRoute(),
				`Incorporate in ${program.Region}`,
				`You are about to begin the incorporation process in ${
					program.Region
				}. Please double check your
				required documents are Certified True or Notarized where necessary. Failure to do so
				will result in delays in the incorporation process. You may also be asked to provide
				more information by the service provider`,
				'conducting KYC',
				'Far Horizon Capital Inc',
				'https://flagtheory.com/privacy-policy',
				'http://flagtheory.com/terms-and-conditions'
			)
		);
	};

	render() {
		const { program } = this.props;
		const countryCode = this.props.match.params.countryCode;
		return (
			<PaymentCheckout
				title={`Pay Incorporation Fee: ${program.Region}`}
				description={program.wallet_description}
				timeToForm={program['Time to form (weeks)']}
				program={program}
				countryCode={countryCode}
				{...this.getPaymentParameters()}
				options={program.checkoutOptions}
				price={program.price}
				onBackClick={this.onBackClick}
				onStartClick={this.onStartClick}
				startButtonText={'Start Application'}
				initialDocsText={
					'You will be required to provide a few basic informations about yourself like full name and email. This will be done through SelfKey ID Wallet.'
				}
				kycProcessText={
					'You will undergo a standard KYC process and our team will get in touch with you to make sure we have all the information needed.'
				}
				getFinalDocsText={
					'Once the incorporations process is done you will receive all the relevant documents, for your new company, on your email.'
				}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { companyCode } = props.match.params;
	const authenticated = true;
	return {
		program: incorporationsSelectors.getIncorporationsDetails(state, companyCode),
		...getLocale(state),
		...getFiatCurrency(state),
		...ethGasStationInfoSelectors.getEthGasStationInfo(state),
		tokens: getTokens(state).splice(1), // remove ETH
		address: getWallet(state).address,
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		ethRate: pricesSelectors.getRate(state, 'ETH', 'USD'),
		cryptoCurrency: CRYPTOCURRENCY,
		rp: kycSelectors.relyingPartySelector(state, 'incorporations'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'incorporations',
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(IncorporationsCheckoutContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as IncorporationsCheckoutContainer };
