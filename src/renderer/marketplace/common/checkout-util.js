import EthUnits from 'common/utils/eth-units';
import config from 'common/config';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { getWallet } from 'common/wallet/selectors';
import { ethGasStationInfoSelectors } from 'common/eth-gas-station';
import { pricesSelectors } from 'common/prices';
import { kycSelectors } from 'common/kyc';

const FIXED_GAS_LIMIT_PRICE = 21000;
const CRYPTOCURRENCY = config.constants.primaryToken;

export const DEFAULT_DOCS_TEXT =
	'You will be required to provide a few basic informations about yourself like full name and email. This will be done through SelfKey ID Wallet.';
export const DEFAULT_KYC_PROCESS_TEXT =
	'You will undergo a standard KYC process and our team will get in touch with you to make sure we have all the information needed.';

export const getLastApplication = props => {
	const { rp } = props;
	const { templateId } = props.match.params;

	if (!rp || !rp.authenticated) return false;

	const { applications } = props.rp;
	if (!applications || applications.length === 0) return false;

	let application;
	let index = applications.length - 1;
	for (; index >= 0; index--) {
		if (applications[index].template === templateId) {
			application = applications[index];
			break;
		}
	}
	return application;
};

export const userHasApplied = props => {
	const application = getLastApplication(props);
	return !!application;
};

export const applicationWasRejected = props => {
	const application = getLastApplication(props);
	if (!application) {
		return false;
	}
	// Process is cancelled or Process is rejected
	return application.currentStatus === 3 || application.currentStatus === 8;
};

export const getPaymentParameters = (props, price) => {
	const { keyRate, ethRate, ethGasStationInfo, cryptoCurrency } = props;
	const gasPrice = ethGasStationInfo.fast;
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
};

export const getCheckoutProps = (state, props) => {
	const authenticated = true;

	return {
		...getLocale(state),
		publicKey: getWallet(state).publicKey,
		...getFiatCurrency(state),
		...ethGasStationInfoSelectors.getEthGasStationInfo(state),
		tokens: getTokens(state).splice(1), // remove ETH
		ethRate: pricesSelectors.getRate(state, 'ETH', 'USD'),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		cryptoCurrency: CRYPTOCURRENCY,

		rp: kycSelectors.relyingPartySelector(state, 'incorporations'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'incorporations',
			authenticated
		)
	};
};
