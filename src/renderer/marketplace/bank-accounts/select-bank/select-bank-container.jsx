import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors, kycOperations } from 'common/kyc';
import { marketplaceSelectors } from 'common/marketplace';
import { MarketplaceBankAccountsComponent } from '../common/marketplace-bank-accounts-component';
import { OptionSelection } from '../common/option-selection';

const styles = theme => ({});

class BankAccountsSelectBankContainer extends MarketplaceBankAccountsComponent {
	async componentDidMount() {
		await this.loadRelyingParty({ rp: this.props.vendorId, authenticated: true });
	}

	getNextRoute = () => this.processStartedRoute();

	onBackClick = () => this.props.dispatch(push(this.cancelRoute()));

	onStartClick = async selection => {
		const { templateId, vendorId } = this.props;
		const application = this.getLastApplication();
		let questions = [];

		const templateQuestionId = this.getBankQuestionId(application.questions);
		if (templateQuestionId) {
			questions = [
				{
					id: templateQuestionId,
					data: [selection]
				}
			];
		}

		await this.props.dispatch(
			kycOperations.updateRelyingPartyKYCApplication(
				vendorId,
				templateId,
				application.id,
				false,
				questions
			)
		);

		this.props.dispatch(push(this.getNextRoute()));
	};

	render() {
		const { jurisdiction, countryCode } = this.props;
		return (
			<OptionSelection
				jurisdiction={jurisdiction}
				title={`Choose your preferred Bank in ${jurisdiction.data.region}`}
				description1={`Please, choose a preferred bank and an account type to continue with the process. Make sure to check
					whether you fulfill the requirements below and whether you are required or not to make a personal
					visit to the banker to finalize the account opening.`}
				description2={`Selecting a preferred option does not guarantee opening an account with that specific bank. We
					start the process with your option first, but if you are not eligible for that specific bank we
					will suggest another bank from those available in the specific jurisdiction.`}
				banks={jurisdiction.data.accounts}
				selected={this.getExistingBankPreferenceSelection(this.getLastApplication())}
				countryCode={countryCode}
				onBackClick={this.onBackClick}
				onStartClick={this.onStartClick}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { accountCode, countryCode, templateId, vendorId } = props.match.params;
	const authenticated = true;
	return {
		vendorId,
		templateId,
		countryCode,
		accountCode,
		jurisdiction: marketplaceSelectors.selectBankJurisdictionByAccountCode(state, accountCode),
		publicKey: getWallet(state).publicKey,
		currentApplication: kycSelectors.selectCurrentApplication(state),
		rp: kycSelectors.relyingPartySelector(state, vendorId),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			vendorId,
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(BankAccountsSelectBankContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsSelectBankContainer };
