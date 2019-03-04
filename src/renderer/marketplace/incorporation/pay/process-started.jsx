import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { getWallet } from 'common/wallet/selectors';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { CloseButtonIcon, HourGlassLargeIcon } from 'selfkey-ui';
import { incorporationsSelectors } from 'common/incorporations';
import { pricesSelectors } from 'common/prices';
import { transactionSelectors } from 'common/transaction';
import { kycSelectors, kycOperations } from 'common/kyc';

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
	icon: {
		width: '120px'
	},
	content: {
		width: 'calc(100% - 120px)'
	},
	description: {
		fontFamily: 'Lato, arial',
		color: '#FFF',
		lineHeight: '1.5em',
		fontSize: '14px',
		'& p': {
			marginBottom: '1em'
		},
		'& p.email': {
			color: '#00C0D9',
			padding: '10px 0 10px 0'
		},
		'& strong': {
			fontWeight: '700'
		}
	},
	instructions: {
		padding: '30px 0',
		borderTop: '1px solid #475768'
	},
	footer: {
		width: '100%',
		'& button': {
			marginRight: '30px'
		}
	}
});

export class IncorporationProcessStarted extends React.Component {
	async componentWillMount() {
		const authenticated = true;

		if (this.props.rpShouldUpdate) {
			await this.props.dispatch(
				kycOperations.loadRelyingParty('incorporations', authenticated)
			);
		}
	}

	componentDidMount() {
		this.saveTransactionHash();
	}

	saveTransactionHash = async () => {
		const { currentApplication, transaction, rp } = this.props;

		console.log(this.props);

		if (currentApplication && transaction) {
			const application = rp.applications[rp.applications.length - 1];
			console.log(application);
			await this.props.dispatch(
				kycOperations.updateRelyingPartyKYCApplicationPayment(
					'incorporations',
					application.id,
					transaction.transactionHash
				)
			);
		} else {
			// TODO: what to do if no transaction or currentApplication exists?
		}
	};

	onBackClick = () => this.props.dispatch(push(`/main/dashboard`));

	onSelfKeyClick = () => this.props.dispatch(push(`/main/dashboard`));

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.container}>
				<CloseButtonIcon onClick={this.onBackClick} className={classes.closeIcon} />
				<Grid
					container
					justify="flex-start"
					alignItems="flex-start"
					className={classes.containerHeader}
				>
					<Typography variant="body2" gutterBottom className="region">
						KYC Process
					</Typography>
				</Grid>
				<div className={classes.contentContainer}>
					<Grid
						container
						justify="flex-start"
						alignItems="flex-start"
						className={classes.content}
					>
						<div className={classes.icon}>
							<HourGlassLargeIcon />
						</div>
						<div className={classes.content}>
							<div className={classes.description}>
								<Typography variant="body1" gutterBottom>
									Thank you for payment!
								</Typography>
								<Typography variant="body2" gutterBottom>
									One of our our managers is reviewing the information you
									submitted and{' '}
									<strong>
										will contact you shortly on the e-mail you provided
									</strong>
									, to continue the process. If you have any questions in the
									meantime, you can reach us at:
								</Typography>
								<Typography
									variant="body2"
									color="primary"
									gutterBottom
									className="email"
								>
									support@incorporations.io
								</Typography>
							</div>
							<div className={classes.instructions}>
								<Typography variant="subtitle2" color="secondary" gutterBottom>
									The application is available to you at any point under the
									marketplace applications tab, in your SelfKey ID Profile.
								</Typography>
							</div>
							<div className={classes.footer}>
								<Button
									variant="contained"
									size="large"
									onClick={this.onSelfKeyClick}
								>
									Go to Profile
								</Button>
								<Button variant="outlined" size="large" onClick={this.onBackClick}>
									Close
								</Button>
							</div>
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
		publicKey: getWallet(state).publicKey,
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		transaction: transactionSelectors.getTransaction(state),
		currentApplication: kycSelectors.selectCurrentApplication(state),
		rp: kycSelectors.relyingPartySelector(state, 'incorporations'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'incorporations',
			authenticated
		),
		program: incorporationsSelectors.getIncorporationsDetails(
			state,
			props.match.params.companyCode
		)
	};
};

export default connect(mapStateToProps)(withStyles(styles)(IncorporationProcessStarted));
