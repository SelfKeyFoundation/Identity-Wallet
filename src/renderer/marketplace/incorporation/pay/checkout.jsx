import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import config from 'common/config';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors, kycOperations } from 'common/kyc';
import { incorporationsSelectors } from 'common/incorporations';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { CloseButtonIcon } from 'selfkey-ui';
import { pricesSelectors } from 'common/prices';
import { FlagCountryName, sanitize, getIncorporationPrice } from '../common';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { ethGasStationInfoSelectors, ethGasStationInfoOperations } from 'common/eth-gas-station';
import EthUnits from 'common/utils/eth-units';

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
				`Incorporation Checklist: ${program.Region}`,
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
		const { classes, program } = this.props;
		const { countryCode } = this.props.match.params;
		const { price, keyAmount, usdFee, ethFee } = this.getPaymentParameters();
		const options = this.getProgramOptions(program.wallet_options);

		return (
			<div className={classes.container}>
				<CloseButtonIcon onClick={this.onBackClick} className={classes.closeIcon} />
				<Grid
					container
					justify="flex-start"
					alignItems="flex-start"
					className={classes.containerHeader}
				>
					<div>
						<FlagCountryName code={countryCode} />
					</div>
					<Typography variant="body2" gutterBottom className="region">
						Pay Incorporation Fee: {program.Region}
					</Typography>
				</Grid>
				<div className={classes.contentContainer}>
					<Grid
						container
						justify="flex-start"
						alignItems="center"
						className={classes.content}
					>
						<div className={classes.whatYouGet}>
							<Typography variant="body2" gutterBottom>
								What you get
							</Typography>
							<Grid
								container
								direction="row"
								justify="space-between"
								alignItems="center"
								spacing={0}
							>
								<div
									className={classes.description}
									dangerouslySetInnerHTML={{
										__html: sanitize(program.wallet_description)
									}}
								/>
								<div className={classes.descriptionHelp}>
									<p>Time to form: {program['Time to form (weeks)']} week(s).</p>
									<p>
										All our incorporation services include a yearly consulting
										session, a dedicated account manager and access to our
										global network of trusted business services, including
										introductions to accountants, financial, tax and legal
										advisors at no cost.
									</p>
								</div>
							</Grid>
						</div>
						<div className={classes.howItWorks}>
							<Typography variant="body2" gutterBottom>
								How the service works
							</Typography>
							<Grid
								container
								direction="row"
								justify="space-between"
								alignItems="center"
								spacing={0}
							>
								<div className={classes.howItWorksBox}>
									<header>
										<span>1</span>
										<Typography variant="h4" gutterBottom>
											Provide initial documents
										</Typography>
									</header>
									<div>
										<Typography variant="h3" gutterBottom>
											You will be required to provide a few basic informations
											about yourself like full name and email. This will be
											done through SelfKey ID Wallet.
										</Typography>
									</div>
								</div>
								<div className={classes.howItWorksBox}>
									<header>
										<span>2</span>
										<Typography variant="h4" gutterBottom>
											KYC Process
										</Typography>
									</header>
									<div>
										<Typography variant="h3" gutterBottom>
											You will undergo a standard KYC process and our team
											will get in touch with you to make sure we have all the
											information needed.
										</Typography>
									</div>
								</div>
								<div className={classes.howItWorksBox}>
									<header>
										<span>3</span>
										<Typography variant="h4" gutterBottom>
											Get final documents
										</Typography>
									</header>
									<div>
										<Typography variant="h3" gutterBottom>
											Once the incorporations process is done you will receive
											all the relevant documents, for your new company, on
											your email.
										</Typography>
									</div>
								</div>
							</Grid>
						</div>
						<div className={classes.serviceCost}>
							<Typography variant="body2" gutterBottom>
								Service Costs
							</Typography>

							<div className={classes.priceTable}>
								{options.map(option => (
									<div key={option.id} className={classes.priceRow}>
										<Grid
											container
											direction="row"
											justify="flex-start"
											alignItems="center"
											spacing={0}
										>
											<div className="rowItem">{option.description}</div>
											<div className="rowItem time">{option.notes}</div>
											<div className="rowItem price">
												{option.price && (
													<React.Fragment>
														${option.price.toLocaleString()}
													</React.Fragment>
												)}
											</div>
										</Grid>
									</div>
								))}
								<div className={classes.rowSeparator} />
								<div className={classes.priceRow}>
									<Grid
										container
										direction="row"
										justify="flex-start"
										alignItems="center"
										spacing={0}
									>
										<div className="rowItem">Cost</div>
										<div className="rowItem time" />
										<div className="rowItem price">
											Total: ${price.toLocaleString()}
											<div className="time">
												{keyAmount.toLocaleString()} KEY
											</div>
										</div>
									</Grid>
								</div>
								<div className={classes.priceRow}>
									<Grid
										container
										direction="row"
										justify="flex-start"
										alignItems="center"
										spacing={0}
									>
										<div className="rowItem transactionFee">
											Network Transaction Fee
										</div>
										<div className="rowItem time" />
										<div className="rowItem price">
											${usdFee.toLocaleString()}
											<div className="time">
												{ethFee.toLocaleString()} ETH
											</div>
										</div>
									</Grid>
								</div>
							</div>
						</div>
						<div className={classes.payButton}>
							<Button variant="contained" size="large" onClick={this.onStartClick}>
								Start Incorporation
							</Button>
							<Button variant="outlined" size="large" onClick={this.onBackClick}>
								Cancel
							</Button>
						</div>
					</Grid>
				</div>
			</div>
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
