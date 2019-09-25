import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { TransactionProcessingPopup } from '../common/transaction-processing-popup';
import { walletSelectors } from 'common/wallet';

class CreateDIDProcessingContainerComponent extends Component {
	handleCloseAction = _ => {
		this.props.dispatch(push(this.props.didOriginUrl));
	};

	render() {
		return (
			<React.Fragment>
				<TransactionProcessingPopup
					closeAction={this.handleCloseAction}
					title="Processing"
				/>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state, props) => {
	return { didOriginUrl: walletSelectors.getDidOriginUrl(state) };
};

export const CreateDIDProcessingContainer = connect(mapStateToProps)(
	CreateDIDProcessingContainerComponent
);

export default CreateDIDProcessingContainer;
