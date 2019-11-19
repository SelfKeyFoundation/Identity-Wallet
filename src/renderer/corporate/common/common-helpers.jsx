import React from 'react';
import { SmallRoundCompany, SmallRoundPerson } from 'selfkey-ui';
import {
	EMAIL_ATTRIBUTE,
	JURISDICTION_ATTRIBUTE,
	NATIONALITY_ATTRIBUTE,
	COUNTRY_ATTRIBUTE
} from 'common/identity/constants';

const getEntityType = entry => entry.identity.type;

const getEntityIcon = entry => {
	if (entry.identity.type === 'individual') {
		return <SmallRoundPerson />;
	} else {
		return <SmallRoundCompany />;
	}
};

const getProfileName = entry => {
	if (entry.identity.type === 'individual') {
		return `${entry.lastName}, ${entry.firstName}`;
	} else {
		return `${entry.entityName}`;
	}
};

const getMemberPositions = profile => profile.identity.positions.join(', ');

const getProfileEmail = profile => getProfileIdAttribute(profile, EMAIL_ATTRIBUTE);

const getProfileJurisdiction = profile => {
	if (profile.identity.type === 'individual') {
		return getProfileIdAttribute(profile, NATIONALITY_ATTRIBUTE);
	} else {
		return getProfileIdAttribute(profile, JURISDICTION_ATTRIBUTE);
	}
	/*
			? 'http://platform.selfkey.org/schema/attribute/nationality.json'
			: 'http://platform.selfkey.org/schema/attribute/legal-jurisdiction.json';
	const attribute = entry.allAttributes.find(a => a.type.content.$id === idAttribute);
	if (attribute && attribute.data.value) {
		return attribute.data.value.denonym ? attribute.data.value.denonym : attribute.data.value;
	}
	*/
};

const getProfileResidency = profile => {
	if (profile.identity.type === 'individual') {
		return getProfileIdAttribute(profile, COUNTRY_ATTRIBUTE);
	} else {
		return getProfileIdAttribute(profile, JURISDICTION_ATTRIBUTE);
	}
};

const getMemberEquity = entry => entry.identity.equity;

const getProfileIdAttribute = (profile, idAttribute) => {
	// TODO: check valid idAttributes
	const attribute = profile.allAttributes.find(a => a.type.content.$id === idAttribute);
	if (attribute && attribute.data.value) {
		return attribute.data.value;
	}
};

export {
	getProfileIdAttribute,
	getProfileName,
	getEntityType,
	getEntityIcon,
	getMemberPositions,
	getProfileEmail,
	getMemberEquity,
	getProfileJurisdiction,
	getProfileResidency
};
