import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { TransactionProcessingPopup } from '../../../common/transaction-processing-popup';

class CreateDIDProcessingComponent extends Component {
	handleCloseAction = _ => {
		this.props.dispatch(push('/main/selfkeyId'));
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
	return {};
};

export const CreateDIDProcessing = connect(mapStateToProps)(CreateDIDProcessingComponent);

export default CreateDIDProcessing;
