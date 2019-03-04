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
import { FlagCountryName } from '../common';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { ethGasStationInfoSelectors, ethGasStationInfoOperations } from 'common/eth-gas-station';
import EthUnits from 'common/utils/eth-units';

const FIXED_GAS_LIMIT_PRICE = 21000;
const CRYPTOCURRENCY = config.constants.primaryToken;

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
		right: '-24px',
		top: '-24px'
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
			color: '#93B0C1',
			display: 'block',
			padding: '6px',
			borderBottom: '1px solid #435160',
			marginBottom: '0.5em',
			marginTop: '1em'
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
		}
	},
	descriptionHelp: {
		width: '35%',
		color: '#93B0C1',
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
			textAlign: 'right'
		},
		'& div.time': {
			color: '#93B0C1',
			fontSize: '13px'
		},
		'& div.rowItem.transactionFee': {
			color: '#93B0C1'
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
			await this.checkIfUserHasApplied();
		}
		this.loadData();
	}

	loadData = () => {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
	};

	checkIfUserHasApplied = async () => {
		if (this.userHasApplied()) await this.props.dispatch(push(this.getCancelRoute()));
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

	getIncorporationPrice = () => {
		const { program } = this.props;
		const price = program['active_test_price']
			? program['test_price']
			: program['Wallet Price'];
		return parseInt(price.replace(/\$/, '').replace(/,/, ''));
	};

	getPaymentParameters = _ => {
		const { keyRate, ethRate, ethGasStationInfo, cryptoCurrency } = this.props;
		const gasPrice = ethGasStationInfo.fast;
		const price = this.getIncorporationPrice();
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
		const { companyCode, countryCode } = this.props.match.params;
		return `/main/marketplace-incorporation/pay-confirmation/${companyCode}/${countryCode}`;
	};

	onBackClick = () => this.props.dispatch(push(this.getCancelRoute()));

	onStartClick = _ => {
		const { program } = this.props;
		const { templateId } = this.props.match.params;

		// For easy kyc testing, use the following test templateId
		// templateId = 5c6fadbf77c33d5c28718d7b';

		// TODO: some of this info should be loaded from airtable
		// FIXME: replace test wallet in production
		this.props.dispatch(
			kycOperations.startCurrentApplicationOperation(
				'incorporations',
				templateId,
				this.getPayRoute(),
				this.getCancelRoute(),
				`Incorporation Checklist: ${program.Region}`,
				`You are about to being the incorporation process in ${
					program.Region
				}. Please double check your required documents are Certified True or Notarized where necessary. Failure to do so will result in delays in the incorporation process. You may also be asked to provide more information by the service provider.`,
				'I understand SelfKey Wallet LLC will pass this information to Far Horizon Capital Inc, that will provide incorporation services in Singapore at my request and will communicate with me at my submitted email address above.'
			)
		);
	};

	render() {
		const { classes, program } = this.props;
		const { countryCode } = this.props.match.params;
		const { price, keyAmount, usdFee, ethFee } = this.getPaymentParameters();

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
								<div className={classes.description}>
									<p>
										To start the {program.Region} incorporation process you are
										required to pay a fee. Our incorporation package includes:
									</p>
									<ul>
										<li>Registration and Government Fees</li>
										<li>Corporate Secretary (1 year), which includes:</li>
										<ul>
											<li>Change of Registered Business Address</li>
											<li>
												Appointment/Resignation of Corporate Representative
											</li>
											<li>Appointment/Change of Auditors</li>
											<li>Change of Financial year end</li>
											<li>AGM & Annual returns</li>
											<li>Allotment of share options to employees</li>
										</ul>
										<li>
											Certified Copies of Constitutional Documents for bank
											account opening
										</li>
										<li>Courier fees</li>
									</ul>
								</div>
								<div className={classes.descriptionHelp}>
									<p>Time to form: 1 week.</p>
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
								<div className={classes.priceRow}>
									<Grid
										container
										direction="row"
										justify="flex-start"
										alignItems="center"
										spacing={0}
									>
										<div className="rowItem">Incorporation Fee</div>
										<div className="rowItem time">-</div>
										<div className="rowItem price">-</div>
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
										<div className="rowItem">Mailing Address</div>
										<div className="rowItem time">1 year</div>
										<div className="rowItem price">-</div>
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
										<div className="rowItem">Local Director</div>
										<div className="rowItem time">-</div>
										<div className="rowItem price">-</div>
									</Grid>
								</div>
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
												${keyAmount.toLocaleString()}
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
											<div className="time">${ethFee.toLocaleString()}</div>
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
