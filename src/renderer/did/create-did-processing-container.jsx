import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { TransactionProcessingPopup } from '../common/transaction-processing-popup';
import { didSelectors } from 'common/did';

class CreateDIDProcessingContainerComponent extends PureComponent {
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
	return { didOriginUrl: didSelectors.selectOriginUrl(state) };
};

export const CreateDIDProcessingContainer = connect(mapStateToProps)(
	CreateDIDProcessingContainerComponent
);

export default CreateDIDProcessingContainer;
