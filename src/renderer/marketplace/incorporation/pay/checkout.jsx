import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import config from 'common/config';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors, kycOperations } from 'common/kyc';
import { incorporationsSelectors } from 'common/incorporations';
import { withStyles } from '@material-ui/core/styles';
import { pricesSelectors } from 'common/prices';
import { getIncorporationPrice } from '../common';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { ethGasStationInfoSelectors, ethGasStationInfoOperations } from 'common/eth-gas-station';
import EthUnits from 'common/utils/eth-units';
import PaymentCheckout from '../../common/payment-checkout';

const FIXED_GAS_LIMIT_PRICE = 21000;
const CRYPTOCURRENCY = config.constants.primaryToken;
const VENDOR_NAME = 'Far Horizon Capital Inc';

const styles = theme => ({
	container: {
		position: 'relative',
		width: '100%',
		margin: '0 auto',
		maxWidth: '960px'
	},
	containerHeader: {
		padding: '22px 30px',
		background: '#2A3540',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		},
		'& .region': {
			marginLeft: '1em',
			marginTop: '0.25em',
			marginBottom: '0',
			fontSize: '24px'
		}
	},
	closeIcon: {
		position: 'absolute',
		right: '-20px',
		top: '-20px'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		padding: '30px'
	},
	whatYouGet: {
		paddingBottom: '30px',
		marginBottom: '30px',
		borderBottom: '2px solid #475768'
	},
	description: {
		margin: '1em 1em 1em 0',
		fontFamily: 'Lato, arial',
		color: '#FFF',
		width: '60%',
		borderRight: '1px solid #475768',
		lineHeight: '1.4em',
		fontSize: '14px',
		'& p': {
			marginBottom: '1.5em',
			lineHeight: '1.4em',
			maxWidth: '90%'
		},
		'& strong': {
			fontWeight: 'bold',
			color: theme.palette.secondary.main,
			display: 'block',
			padding: '0',
			borderBottom: '1px solid #435160',
			marginBottom: '0.5em',
			marginTop: '0em'
		},
		'& ul': {
			listStyle: 'outside',
			lineHeight: '1.4em',
			marginLeft: '1.5em',
			marginBottom: '1.5em'
		},
		'& ul li': {
			lineHeight: '1.4em',
			marginBottom: '0.5em'
		},
		'& a': {
			color: theme.palette.secondary.main
		}
	},
	descriptionHelp: {
		width: '35%',
		color: theme.palette.secondary.main,
		fontFamily: 'Lato, arial',
		fontSize: '12px',
		lineHeight: '1.5em',
		'& p': {
			marginBottom: '1em'
		}
	},
	howItWorks: {
		paddingBottom: '30px',
		marginBottom: '30px',
		borderBottom: '2px solid #475768'
	},
	howItWorksBox: {
		width: '26%',
		padding: '2em 3%',
		margin: '2em 0',
		color: '#FFF',
		background: '#313D49',
		'& header h4': {
			display: 'inline-block',
			marginLeft: '0.5em',
			fontSize: '16px'
		},
		'& header span': {
			color: '#00C0D9',
			fontWeight: 'bold',
			fontSize: '20px'
		},
		'& h3': {
			fontSize: '13px'
		}
	},
	serviceCost: {
		width: '100%',
		paddingBottom: '30px',
		marginBottom: '30px'
	},
	priceTable: {
		padding: '2em',
		margin: '2em 0',
		background: '#313D49'
	},
	priceRow: {
		padding: '10px 0',
		'& div.rowItem': {
			width: '33%',
			color: '#FFF'
		},
		'& div.price': {
			color: '#00C0D9',
			fontWeight: 'bold',
			textAlign: 'right',
			'& .time': {
				marginTop: '5px'
			}
		},
		'& div.time': {
			color: theme.palette.secondary.main,
			fontSize: '13px'
		},
		'& div.rowItem.transactionFee': {
			color: theme.palette.secondary.main
		}
	},
	rowSeparator: {
		border: '1px solid #475768',
		margin: '30px 0'
	},
	payButton: {
		width: '100%',
		'& button': {
			marginRight: '30px'
		}
	}
});

export class IncorporationCheckout extends React.Component {
	async componentDidMount() {
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
		this.loadData();
	}

	loadData = () => {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
	};

	getVendorName = _ => {
		const { program } = this.props;
		return program['Wallet Vendor Name'] || VENDOR_NAME;
	};

	checkIfUserCanIncorporate = async () => {
		if (this.userHasApplied() && !this.applicationWasRejected())
			await this.props.dispatch(push(this.getCancelRoute()));
	};

	getLastApplication = () => {
		const { templateId } = this.props.match.params;
		// For easy kyc testing, use the following test templateId
		// const templateId = '5c6fadbf77c33d5c28718d7b';
		if (!this.props.rp) return false;

		const { applications } = this.props.rp;
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

	userHasApplied = () => {
		const application = this.getLastApplication();
		return !!application;
	};

	applicationWasRejected = () => {
		const application = this.getLastApplication();
		if (!application) {
			return false;
		}
		// Process is cancelled or Process is rejected
		return application.currentStatus === 3 || application.currentStatus === 8;
	};

	getPrice = () => {
		const { program } = this.props;
		return getIncorporationPrice(program);
	};

	getPaymentParameters = _ => {
		const { keyRate, ethRate, ethGasStationInfo, cryptoCurrency } = this.props;
		const gasPrice = ethGasStationInfo.fast;
		const price = this.getPrice();
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

	getCancelRoute = () => {
		const { companyCode, countryCode, templateId } = this.props.match.params;
		return `/main/marketplace-incorporation/details/${companyCode}/${countryCode}/${templateId}`;
	};

	getPayRoute = () => {
		const { companyCode, countryCode, templateId } = this.props.match.params;
		return `/main/marketplace-incorporation/pay-confirmation/${companyCode}/${countryCode}/${templateId}`;
	};

	onBackClick = () => this.props.dispatch(push(this.getCancelRoute()));

	getAgreement = program => {
		// FIXME: TBD if this info should be stored on Airtable
		const vendor = this.getVendorName();
		const privacyURL = 'https://flagtheory.com/privacy-policy';
		const termsURL = 'http://flagtheory.com/terms-and-conditions';
		const purpose = 'conducting KYC';

		return (
			<div>
				I consent to share my information with ${vendor}, for the purposes of ${purpose} in
				accordance with their{' '}
				<a href={privacyURL} target={'_blank'}>
					privacy policy
				</a>{' '}
				and{' '}
				<a href={termsURL} target={'_blank'}>
					terms and conditions
				</a>
				.
			</div>
		);
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
		const { program } = this.props;
		return (
			<PaymentCheckout
				{...this.props}
				title={`Pay Incorporation Fee: ${program.Region}`}
				description={program.wallet_description}
				timeToForm={program['Time to form (weeks)']}
				countryCode={this.props.match.params.countryCode}
				{...this.getPaymentParameters()}
				options={this.getProgramOptions(program.wallet_options)}
				onBackClick={this.onBackClick}
				onStartClick={this.onStartClick}
				startButtonText={'Start Incorporation'}
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
	const authenticated = true;
	return {
		...getLocale(state),
		...getFiatCurrency(state),
		...ethGasStationInfoSelectors.getEthGasStationInfo(state),
		tokens: getTokens(state).splice(1), // remove ETH
		publicKey: getWallet(state).publicKey,
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		ethRate: pricesSelectors.getRate(state, 'ETH', 'USD'),
		cryptoCurrency: CRYPTOCURRENCY,
		program: incorporationsSelectors.getIncorporationsDetails(
			state,
			props.match.params.companyCode
		),
		rp: kycSelectors.relyingPartySelector(state, 'incorporations'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'incorporations',
			authenticated
		)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(IncorporationCheckout));
