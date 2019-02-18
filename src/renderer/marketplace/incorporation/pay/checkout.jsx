import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { getWallet } from 'common/wallet/selectors';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { CloseButtonIcon } from 'selfkey-ui';
import { incorporationsSelectors } from 'common/incorporations';
import { pricesSelectors } from 'common/prices';
import { FlagCountryName } from '../common';

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
		lineHeight: '1.5em',
		fontSize: '14px',
		'& p': {
			marginBottom: '1em'
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
	onBackClick = _ =>
		this.props.dispatch(
			push(
				`/main/marketplace-incorporation/details/${this.props.match.params.companyCode}/${
					this.props.match.params.countryCode
				}`
			)
		);

	onPayClick = _ =>
		this.props.dispatch(
			push(
				`/main/marketplace-incorporation/process-started/${
					this.props.match.params.companyCode
				}/${this.props.match.params.countryCode}`
			)
		);

	render() {
		const { classes, program } = this.props;
		const { countryCode } = this.props.match.params;

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
										To start the Singapore incorporation process you are
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
											done trough SelfKey ID Wallet.
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
											You will undergo a standard KYC process and our team
											will get in touch with you to make sure we have all the
											information needed.
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
										<div className="rowItem price">$1600</div>
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
										<div className="rowItem">Singapore Mailing Address</div>
										<div className="rowItem time">1 year</div>
										<div className="rowItem price">$300</div>
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
										<div className="rowItem">Singapore Local Director</div>
										<div className="rowItem time">-</div>
										<div className="rowItem price">$3000</div>
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
										<div className="rowItem price">Total: $1600</div>
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
										<div className="rowItem price">$1</div>
									</Grid>
								</div>
							</div>
						</div>
						<div className={classes.payButton}>
							<Button variant="contained" size="large" onClick={this.onPayClick}>
								Pay Incorporation
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
	return {
		publicKey: getWallet(state).publicKey,
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		program: incorporationsSelectors.getIncorporationsDetails(
			state,
			props.match.params.companyCode
		)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(IncorporationCheckout));
