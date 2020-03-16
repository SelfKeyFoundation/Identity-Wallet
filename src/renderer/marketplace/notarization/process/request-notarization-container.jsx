import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core';
import { identitySelectors } from 'common/identity';
import { kycOperations } from 'common/kyc';
import { marketplaceSelectors } from 'common/marketplace';
import MarketplaceNotariesComponent from '../common/marketplace-notaries-component';
import RequestNotarizationPage from './request-notarization-page';
import { CreateAttributeContainer } from '../../../attributes';

const styles = theme => ({});

class RequestNotarizationContainer extends MarketplaceNotariesComponent {
	state = {
		popup: null
	};

	onBackClick = () => this.props.dispatch(push(this.rootPath()));

	onStartClick = () => {
		const { templateId, vendorId, dispatch, vendor } = this.props;

		// TODO: Check available key

		dispatch(
			kycOperations.startCurrentApplicationOperation(
				vendorId,
				templateId,
				this.payRoute(),
				this.cancelRoute(),
				`Notarization Checklist`,
				`You are about to start the notarisation process.
				Please double check your required documents are valid where necessary.
				Failure to do so will result in delays in the notarisation process.
				You may also be asked to provide more information by the service provider.`,
				vendor.name,
				vendor.privacyPolicy,
				vendor.termsOfService
			)
		);
	};

	handleAddDocument = () => this.setState({ popup: 'create-attribute', isDocument: true });

	handlePopupClose = () => this.setState({ popup: null });

	render() {
		const { documents } = this.props;
		const { popup } = this.state;

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
					documents={documents}
					popup={this.state.popup}
					onBackClick={this.onBackClick}
					onStartClick={this.onStartClick}
					handleAddDocument={this.handleAddDocument}
					handlePopupClose={this.handlePopupClose}
				/>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { templateId, vendorId, productId } = props.match.params;

	return {
		templateId,
		vendorId,
		productId,
		vendor: marketplaceSelectors.selectVendorById(state, vendorId),
		...identitySelectors.selectIndividualProfile(state)
	};
};

const styledComponent = withStyles(styles)(RequestNotarizationContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as RequestNotarizationContainer };
