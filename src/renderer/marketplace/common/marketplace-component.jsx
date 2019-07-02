import { Component } from 'react';
import {
	APPLICATION_REJECTED,
	APPLICATION_CANCELLED,
	APPLICATION_APPROVED,
	APPLICATION_ANSWER_REQUIRED
} from 'common/kyc/status_codes';

import config from 'common/config';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { getWallet } from 'common/wallet/selectors';
import { ethGasStationInfoSelectors } from 'common/eth-gas-station';
import { pricesSelectors } from 'common/prices';
import { kycSelectors } from 'common/kyc';
import EthUnits from 'common/utils/eth-units';

import ReactPiwik from 'react-piwik';
const FIXED_GAS_LIMIT_PRICE = 21000;
const CRYPTOCURRENCY = config.constants.primaryToken;

class MarketplaceComponent extends Component {
	DEFAULT_DOCS_TEXT =
		'You will be required to provide a few basic informations about yourself like full name and email. This will be done through SelfKey ID Wallet.';

	DEFAULT_KYC_PROCESS_TEXT =
		'You will undergo a standard KYC process and our team will get in touch with you to make sure we have all the information needed.';

	userHasApplied = () => {
		const application = this.getLastApplication(this.props);
		return !!application;
	};

	applicationWasRejected = () => {
		const application = this.getLastApplication(this.props);
		if (!application) {
			return false;
		}
		// Process is cancelled or Process is rejected
		return application.currentStatus === 3 || application.currentStatus === 8;
	};

	getPaymentParameters = (props, price) => {
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

	getLastApplication = () => {
		const { rp } = this.props;
		const { templateId } = this.props.match.params;

		if (!rp || !rp.authenticated) return false;
		const { applications } = this.props.rp;
		if (!applications || applications.length === 0) return false;

		applications.sort((a, b) => {
			const aDate = new Date(a.createdAt);
			const bDate = new Date(b.createdAt);
			return aDate > bDate ? 1 : -1;
		});

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

	getApplicationStatus = () => {
		if (this.props.rp && this.props.rp.authenticated && this.userHasApplied()) {
			if (this.applicationCompleted()) return 'completed';
			if (this.applicationWasRejected()) return 'rejected';
			if (!this.userHasPaid()) return 'unpaid';
			if (this.applicationRequiresAdditionalDocuments()) return 'additionalRequirements';

			return 'progress';
		}
		return null;
	};

	userHasApplied = () => {
		const application = this.getLastApplication();
		return !!application;
	};

	userHasPaid = () => {
		const application = this.getLastApplication();
		if (!application || !application.payments) {
			return false;
		}
		return !!application.payments.length;
	};

	applicationWasRejected = () => {
		const application = this.getLastApplication();
		if (!application) {
			return false;
		}
		return (
			application.currentStatus === APPLICATION_REJECTED ||
			application.currentStatus === APPLICATION_CANCELLED
		);
	};

	applicationCompleted = () => {
		const application = this.getLastApplication();
		if (!application) {
			return false;
		}
		return application.currentStatus === APPLICATION_APPROVED;
	};

	applicationRequiresAdditionalDocuments = () => {
		const application = this.getLastApplication();
		if (!application) {
			return false;
		}
		return application.currentStatus === APPLICATION_ANSWER_REQUIRED;
	};

	// Can only apply if:
	// - store data has loaded (isLoading prop)
	// - there is a valid price for this product (from airtable)
	// - KYCC templateId exists for this product (from airtable)
	// - user has not applied before or previous application was rejected
	// This probably needs some rethinking, some products might not need KYC
	canApply = price => {
		const { templateId } = this.props.match.params;

		if (this.props.rp && this.props.rp.authenticated) {
			return !!(
				templateId &&
				price &&
				(!this.userHasApplied() || this.applicationWasRejected())
			);
		} else {
			return !!(templateId && price);
		}
	};

	// Redirects to KYCC passing a jwt token for auto-login
	redirectToKYCC = rp => {
		const application = this.getLastApplication();
		const instanceUrl = rp.session.ctx.config.rootEndpoint;

		const url = `${instanceUrl}/applications/${application.id}?access_token=${
			rp.session.access_token.jwt
		}`;
		window.openExternal(null, url);
	};

	trackEcommerceTransaction = ({
		transactionHash,
		code,
		jurisdiction,
		rpName,
		price,
		quantity = 1
	}) => {
		ReactPiwik.push(['addEcommerceItem', code, jurisdiction, rpName, price, quantity]);

		ReactPiwik.push(['trackEcommerceOrder', transactionHash, price]);
	};
}

const getCheckoutProps = (state, props) => {
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

export { MarketplaceComponent, getCheckoutProps };
