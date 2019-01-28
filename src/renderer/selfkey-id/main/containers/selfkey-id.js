import React, { Component } from 'react';
import { connect } from 'react-redux';
import { identitySelectors } from 'common/identity';
import SelfkeyId from '../components/selfkey-id';
// import { identitySelectors, identityOperations } from 'common/identity';
// import { walletSelectors } from 'common/wallet';

class SelfkeyIdContainerComponent extends Component {
	render() {
		return <SelfkeyId {...this.props} />;
	}
}

const mapStateToProps = (state, props) => {
	return {
		...identitySelectors.selectSelfkeyId(state)
	};
};
export const SelfkeyIdContainer = connect(mapStateToProps)(SelfkeyIdContainerComponent);

export default SelfkeyIdContainer;
