import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core';
import { memoizedIdentitySelectors } from 'common/identity';
import MarketplaceNotariesComponent from '../common/marketplace-notaries-component';
import RequestNotarizationPage from './request-notarization-page';
import { CreateAttributeContainer } from '../../../attributes';

const styles = theme => ({});

class RequestNotarizationContainer extends MarketplaceNotariesComponent {
	state = {
		popup: null,
		isTocAccepted: false
	};

	onBackClick = () => this.props.dispatch(push(this.rootPath()));
	onStartClick = () => this.props.dispatch(push(this.tocPath()));
	// onStartClick = () => {
	// 	this.state.isTocAccepted ? '' : this.props.dispatch(push(this.tocPath()));
	// };

	handleAddDocument = () => {
		this.setState({ popup: 'create-attribute', isDocument: true });
	};

	handlePopupClose = () => {
		this.setState({ popup: null });
	};

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
	return {
		...memoizedIdentitySelectors.selectIndividualProfile(state)
	};
};

const styledComponent = withStyles(styles)(RequestNotarizationContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as RequestNotarizationContainer };
