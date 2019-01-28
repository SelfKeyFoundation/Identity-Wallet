import React, { Component } from 'react';
import { connect } from 'react-redux';
import { identitySelectors } from 'common/identity';
import SelfkeyId from '../components/selfkey-id';
// import { identitySelectors, identityOperations } from 'common/identity';
// import { walletSelectors } from 'common/wallet';

const BASIC_ATTRIBUTES = {
	'http://platform.selfkey.org/schema/attribute/first-name.json': 1,
	'http://platform.selfkey.org/schema/attribute/last-name.json': 1,
	'http://platform.selfkey.org/schema/attribute/middle-name.json': 1,
	'http://platform.selfkey.org/schema/attribute/email.json': 1,
	'http://platform.selfkey.org/schema/attribute/country-of-residency.json': 1,
	'http://platform.selfkey.org/schema/attribute/address.json': 1
};

class SelfkeyIdContainerComponent extends Component {
	render() {
		return <SelfkeyId {...this.props} />;
	}
}

const mapStateToProps = (state, props) => {
	const skId = identitySelectors.selectSelfkeyId(state);
	const allAttributes = skId.attributes;
	const attributes = allAttributes.filter(attr => !attr.documents.length);
	const basicAttributes = attributes.filter(attr => BASIC_ATTRIBUTES[attr.type.url]);

	// FIXME: document type should be determined by attribute type
	const documents = allAttributes.filter(attr => attr.documents.length);

	return {
		...skId,
		allAttributes,
		basicAttributes,
		attributes,
		documents
	};
};
export const SelfkeyIdContainer = connect(mapStateToProps)(SelfkeyIdContainerComponent);

export default SelfkeyIdContainer;
