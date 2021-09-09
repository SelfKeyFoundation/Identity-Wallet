import EthUnits from 'common/utils/eth-units';
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/styles';
import { ethGasStationInfoSelectors, ethGasStationInfoOperations } from 'common/eth-gas-station';
import { pricesSelectors } from 'common/prices';
import { identitySelectors } from 'common/identity';
import { kycSelectors, kycOperations } from 'common/kyc';
import { marketplaceSelectors } from 'common/marketplace';
import MarketplaceNotariesComponent from '../common/marketplace-notaries-component';
import RequestNotarizationPage from './request-notarization-page';
import { CreateAttributeContainer } from '../../../attributes';

const FIXED_GAS_LIMIT_PRICE = 45000;

const styles = theme => ({});

class RequestNotarizationContainer extends MarketplaceNotariesComponent {
	state = {
		popup: null,
		selectedDocuments: [],
		message: null
	};

	componentWillMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());
	}

	onBackClick = () => this.props.dispatch(push(this.rootPath()));

	onStartClick = () => {
		const { templateId, vendorId, dispatch, vendor } = this.props;
		const { message } = this.state;

		// TODO: Check available key
		const documentList = this.state.selectedDocuments.join(',');

		dispatch(
			kycOperations.startCurrentApplicationOperation(
				vendorId,
				templateId,
				this.payRoute(documentList),
				this.cancelRoute(),
				`Notarization Checklist`,
				`You are about to start the notarisation process.
				Please double check your required documents are valid where necessary.
				Failure to do so will result in delays in the notarisation process.
				You may also be asked to provide more information by the service provider.`,
				`notarizing documents`,
				vendor.name,
				vendor.privacyPolicy,
				vendor.termsOfService,
				message
			)
		);
	};

	handleAddDocument = () => this.setState({ popup: 'create-attribute', isDocument: true });

	handlePopupClose = () => this.setState({ popup: null });

	handleSelectDocument = (event, checked) => {
		const { selectedDocuments } = this.state;
		const documentId = +event.target.value;
		if (checked) {
			this.setState(prevState => ({
				selectedDocuments: [...prevState.selectedDocuments, documentId]
			}));
		} else {
			const index = selectedDocuments.indexOf(documentId);
			if (index !== -1) {
				selectedDocuments.splice(index, 1);
			}
			this.setState({ selectedDocuments: [...selectedDocuments] });
		}
	};

	handleMessage = event => {
		this.setState({ message: event.target.value });
	};

	handleStatusActionClick = event => {
		const { rp } = this.props;
		if (rp && rp.authenticated && this.userHasApplied()) {
			if (this.applicationCompleted() || this.applicationWasRejected()) {
				this.props.dispatch(push(this.manageApplicationsRoute()));
			} else if (this.applicationRequiresAdditionalDocuments()) {
				this.redirectToKYCC(rp);
			} else if (!this.userHasPaid()) {
				this.props.dispatch(push(this.payRoute()));
			}
		}
		return null;
	};

	getPaymentParameters() {
		const { ethRate, ethGasStationInfo } = this.props;
		const gasPrice =
			ethGasStationInfo && ethGasStationInfo.medium
				? ethGasStationInfo.medium.suggestedMaxFeePerGas
				: 0;
		const gasLimit = FIXED_GAS_LIMIT_PRICE;
		const gasEthFee = EthUnits.toEther(gasPrice * gasLimit, 'gwei');
		const gasUsdFee = gasEthFee * ethRate;
		return {
			gasEthFee,
			gasUsdFee
		};
	}

	render() {
		const { documents, product, keyRate } = this.props;
		const { popup, selectedDocuments, message } = this.state;
		const { gasEthFee, gasUsdFee } = this.getPaymentParameters();

		return (
			<React.Fragment>
				{popup === 'create-attribute' && (
					<CreateAttributeContainer
						open={true}
						onClose={this.handlePopupClose}
						isDocument={this.state.isDocument}
					/>
				)}
				<RequestNotarizationPage
					loading={this.props.loading}
					documents={documents}
					product={product}
					keyRate={keyRate}
					gasEthFee={gasEthFee}
					gasUsdFee={gasUsdFee}
					selectedDocuments={selectedDocuments}
					message={message}
					popup={this.state.popup}
					onBackClick={this.onBackClick}
					onStartClick={this.onStartClick}
					handleAddDocument={this.handleAddDocument}
					handlePopupClose={this.handlePopupClose}
					handleSelectDocument={this.handleSelectDocument}
					handleMessage={this.handleMessage}
					applicationStatus={this.getApplicationStatus()}
					onStatusAction={this.handleStatusActionClick}
				/>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { templateId, vendorId, productId } = props.match.params;
	const identity = identitySelectors.selectIdentity(state);
	return {
		templateId,
		vendorId,
		productId,
		product: marketplaceSelectors.selectInventoryItemByFilter(
			state,
			'notaries',
			p => p.sku === productId,
			identity.type
		),
		isLoading: marketplaceSelectors.isInventoryLoading(state),
		rp: kycSelectors.relyingPartySelector(state, vendorId),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		ethRate: pricesSelectors.getRate(state, 'ETH', 'USD'),
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
		...identitySelectors.selectIndividualProfile(state),
		...ethGasStationInfoSelectors.getEthGasStationInfo(state)
	};
};

const styledComponent = withStyles(styles)(RequestNotarizationContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as RequestNotarizationContainer };
