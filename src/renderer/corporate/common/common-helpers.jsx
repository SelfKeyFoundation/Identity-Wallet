import React from 'react';
import { SmallRoundCompany, SmallRoundPerson } from 'selfkey-ui';

import {
	JURISDICTION_ATTRIBUTE,
	NATIONALITY_ATTRIBUTE,
	COUNTRY_ATTRIBUTE
} from 'common/identity/constants';

const getEntityType = profile => profile.identity.type;

const getEntityIcon = profile =>
	getEntityType(profile) === 'individual' ? <SmallRoundPerson /> : <SmallRoundCompany />;

const getProfileName = profile =>
	getEntityType(profile) === 'individual'
		? `${profile.lastName}, ${profile.firstName}`
		: profile.entityName;

const getMemberPositions = profile => profile.identity.positions.join(', ');

const getProfileEmail = profile => profile.email;

const getProfileJurisdiction = profile => {
	const jurisdiction =
		getEntityType(profile) === 'individual'
			? getProfileIdAttribute(profile, NATIONALITY_ATTRIBUTE)
			: getProfileIdAttribute(profile, JURISDICTION_ATTRIBUTE);
	if (!jurisdiction) {
		return '';
	} else {
		return jurisdiction.country ? jurisdiction.name : jurisdiction;
	}
};

const getProfileResidency = profile => {
	const residency =
		getEntityType(profile) === 'individual'
			? getProfileIdAttribute(profile, COUNTRY_ATTRIBUTE)
			: getProfileIdAttribute(profile, JURISDICTION_ATTRIBUTE);
	if (!residency) {
		return '';
	} else {
		return residency.country ? residency.name : residency;
	}
};

const getMemberEquity = profile => profile.identity.equity;

const getProfileIdAttribute = (profile, idAttribute) => {
	// TODO: check valid idAttributes
	const attribute = profile.allAttributes.find(a => a.type.content.$id === idAttribute);
	if (attribute && attribute.data.value) {
		return attribute.data.value.denonym ? attribute.data.value.denonym : attribute.data.value;
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
