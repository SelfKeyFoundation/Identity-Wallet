import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { getWallet } from 'common/wallet/selectors';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
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
	howItWorksBox: {
		width: '25%',
		padding: '2em 2%',
		margin: '2em auto',
		color: '#FFF',
		background: '#313D49',
		'& header span': {
			color: '#00C0D9',
			fontWeight: 'bold',
			fontSize: '20px'
		},
		'& div': {}
	},
	priceTable: {
		padding: '2em',
		background: '#313D49'
	},
	priceRow: {
		' & > div': {
			width: '30%'
		}
	}
});

export class IncorporationCheckout extends React.Component {
	onBackClick = _ =>
		this.props.dispatch(
			push(
				`/main/marketplace-incorporation/detail/${this.props.match.params.companyCode}/${
					this.props.match.params.countryCode
				}`
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
						<div>
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
						<div>
							<Typography variant="body2" gutterBottom>
								How the service works
							</Typography>
							<Grid
								container
								direction="row"
								justify="space-between"
								alignItems="center"
								spacing={0}
								className={classes.howItWorks}
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
						<div>
							<Typography variant="body2" gutterBottom>
								Service Costs
							</Typography>

							<div className={classes.priceTable}>
								<div className={classes.priceRow}>
									<Grid
										container
										direction="row"
										justify="flext-start"
										alignItems="center"
										spacing={0}
									>
										<div>Incorporation Fee</div>
										<div>-</div>
										<div>$1600</div>
									</Grid>
								</div>
								<div className={classes.priceRow}>
									<Grid
										container
										direction="row"
										justify="flext-start"
										alignItems="center"
										spacing={0}
									>
										<div>Singapore Mailing Address</div>
										<div>1 year</div>
										<div>$300</div>
									</Grid>
								</div>
								<div className={classes.priceRow}>
									<Grid
										container
										direction="row"
										justify="flext-start"
										alignItems="center"
										spacing={0}
									>
										<div>Singapore Local Director</div>
										<div>-</div>
										<div>$3000</div>
									</Grid>
								</div>
								<div className={classes.rowSeparator} />
								<div className={classes.priceRow}>
									<Grid
										container
										direction="row"
										justify="flext-start"
										alignItems="center"
										spacing={0}
									>
										<div>Cost Fee</div>
										<div />
										<div>$1600</div>
									</Grid>
								</div>
								<div className={classes.priceRow}>
									<Grid
										container
										direction="row"
										justify="flext-start"
										alignItems="center"
										spacing={0}
									>
										<div>Network Transaction Fee</div>
										<div />
										<div>$1</div>
									</Grid>
								</div>
							</div>
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
