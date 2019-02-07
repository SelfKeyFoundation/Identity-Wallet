import React, { Component } from 'react';
import { connect } from 'react-redux';
import { identitySelectors, identityOperations } from 'common/identity';
import SelfkeyId from '../components/selfkey-id';
// import { identitySelectors, identityOperations } from 'common/identity';
// import { walletSelectors } from 'common/wallet';

class SelfkeyIdContainerComponent extends Component {
	handleAttributeDelete = attributeId =>
		this.props.dispatch(identityOperations.removeIdAttributeOperation(attributeId));
	render() {
		return <SelfkeyId {...this.props} onAttributeDelete={this.handleAttributeDelete} />;
	}
}

const mapStateToProps = (state, props) => {
	return {
		...identitySelectors.selectSelfkeyId(state)
	};
};
export const SelfkeyIdContainer = connect(mapStateToProps)(SelfkeyIdContainerComponent);

export default SelfkeyIdContainer;
