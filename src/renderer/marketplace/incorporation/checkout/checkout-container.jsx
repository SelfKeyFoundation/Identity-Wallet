import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { kycOperations } from 'common/kyc';
import { incorporationsSelectors } from 'common/incorporations';
import { withStyles } from '@material-ui/core/styles';
import { getIncorporationPrice } from '../common';
import { ethGasStationInfoOperations } from 'common/eth-gas-station';
import PaymentCheckout from '../../common/payment-checkout';
import * as CheckoutUtil from '../../common/checkout-util';

const MARKETPLACE_INCORPORATIONS_ROOT_PATH = '/main/marketplace-incorporation';
const VENDOR_NAME = 'Far Horizon Capital Inc';
const styles = theme => ({});

export class IncorporationCheckout extends React.Component {
	async componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());

		const authenticated = true;
		// If session is not authenticated, reauthenticate with KYC-Chain
		// Otherwise, just check if user has already applied to redirect
		// back to incorporations page
		if (this.props.rpShouldUpdate) {
			await this.props.dispatch(
				kycOperations.loadRelyingParty('incorporations', authenticated)
			);
		} else {
			await this.checkIfUserCanIncorporate();
		}
	}

	getVendorName = _ => {
		const { program } = this.props;
		return program['Wallet Vendor Name'] || VENDOR_NAME;
	};

	checkIfUserCanIncorporate = async () => {
		if (CheckoutUtil.userHasApplied() && !CheckoutUtil.applicationWasRejected())
			await this.props.dispatch(push(this.getCancelRoute()));
	};

	getPrice = () => {
		const { program } = this.props;
		return getIncorporationPrice(program);
	};

	getPaymentParameters = _ => CheckoutUtil.getPaymentParameters(this.props, this.getPrice());

	getCancelRoute = () => {
		const { companyCode, countryCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_INCORPORATIONS_ROOT_PATH}/details/${companyCode}/${countryCode}/${templateId}`;
	};

	getPayRoute = () => {
		const { companyCode, countryCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_INCORPORATIONS_ROOT_PATH}/pay-confirmation/${companyCode}/${countryCode}/${templateId}`;
	};

	onBackClick = () => this.props.dispatch(push(this.getCancelRoute()));

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

	onStartClick = _ => {
		const { program } = this.props;
		const { templateId } = this.props.match.params;

		// For easy kyc testing, use the following test templateId
		// templateId = 5c6fadbf77c33d5c28718d7b';
		this.props.dispatch(
			kycOperations.startCurrentApplicationOperation(
				'incorporations',
				templateId,
				this.getPayRoute(),
				this.getCancelRoute(),
				program.Region,
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
		const countryCode = this.props.match.params.countryCode;

		return (
			<PaymentCheckout
				{...this.props}
				title={`Pay Incorporation Fee: ${this.props.program.Region}`}
				countryCode={countryCode}
				{...this.getPaymentParameters()}
				options={this.getProgramOptions(this.props.program.wallet_options)}
				startButtonText={'Start Incorporation'}
				initialDocsText={CheckoutUtil.DEFAULT_DOCS_TEXT}
				kycProcessText={CheckoutUtil.DEFAULT_KYC_PROCESS_TEXT}
				getFinalDocsText={
					'Once the incorporations process is done you will receive all the relevant documents, for your new company, on your email.'
				}
				onBackClick={this.onBackClick}
				onStartClick={this.onStartClick}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		...CheckoutUtil.getCheckoutProps(state, props),
		program: incorporationsSelectors.getIncorporationsDetails(
			state,
			props.match.params.companyCode
		)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(IncorporationCheckout));
