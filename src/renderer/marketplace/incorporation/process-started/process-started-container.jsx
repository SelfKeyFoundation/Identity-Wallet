import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { getWallet } from 'common/wallet/selectors';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { incorporationsSelectors } from 'common/incorporations';
import { pricesSelectors } from 'common/prices';
import { transactionSelectors } from 'common/transaction';
import { kycSelectors, kycOperations } from 'common/kyc';
import ReactPiwik from 'react-piwik';
import { MarketplaceProcessStarted } from '../../common/marketplace-process-started';

const styles = theme => ({});

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
		this.clearRelyingParty();

		ReactPiwik.push([
			'addEcommerceItem',
			this.props.program['Company code'],
			this.props.program.Region,
			'Incorporation',
			this.props.program['Wallet Price'],
			1
		]);

		ReactPiwik.push([
			'trackEcommerceOrder',
			this.props.transaction.transactionHash,
			this.props.program['Wallet Price']
		]);
	}

	saveTransactionHash = async () => {
		const { currentApplication, transaction, rp } = this.props;

		if (currentApplication && transaction) {
			const application = rp.applications[rp.applications.length - 1];
			await this.props.dispatch(
				kycOperations.updateRelyingPartyKYCApplicationPayment(
					'incorporations',
					application.id,
					transaction.transactionHash
				)
			);

			await this.props.dispatch(
				kycOperations.updateApplicationsOperation({
					id: application.id,
					payments: {
						amount: this.props.program['Wallet Price'],
						amountKey: transaction.amount,
						transactionHash: transaction.transactionHash,
						date: Date.now(),
						status: 'Sent KEY'
					}
				})
			);
		} else {
			// TODO: what to do if no transaction or currentApplication exists?
		}
	};

	clearRelyingParty = async () => {
		// Clear relying party session after a payment
		await this.props.dispatch(kycOperations.clearRelyingPartyOperation());
	};

	onBackClick = () => this.props.dispatch(push(`/main/dashboard`));

	onSelfKeyClick = () => this.props.dispatch(push(`/main/selfkeyId`));

	render() {
		const body = (
			<React.Fragment>
				<Typography variant="h1" gutterBottom>
					Incorporation Process Started
				</Typography>
				<Typography variant="body1" gutterBottom>
					Thank you for payment!
				</Typography>
				<Typography variant="body2" gutterBottom>
					One of our our managers is reviewing the information you submitted and{' '}
					<strong>will contact you shortly on the e-mail you provided</strong>, to
					continue the process. If you have any questions in the meantime, you can reach
					us at:
				</Typography>
				<Typography variant="body2" color="primary" gutterBottom className="email">
					support@flagtheory.com
				</Typography>
			</React.Fragment>
		);

		return (
			<MarketplaceProcessStarted
				title={`KYC Process`}
				body={body}
				onBackClick={this.onBackClick}
				onSelfKeyClick={this.onSelfKeyClick}
			/>
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
