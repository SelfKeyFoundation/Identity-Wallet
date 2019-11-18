import React from 'react';
import { SmallRoundCompany, SmallRoundPerson } from 'selfkey-ui';

const getEntityType = entry => entry.identity.type;

const getEntityIcon = entry => {
	if (entry.identity.type === 'individual') {
		return <SmallRoundPerson />;
	} else {
		return <SmallRoundCompany />;
	}
};

const getEntityName = entry => {
	if (entry.identity.type === 'individual') {
		return `${entry.lastName}, ${entry.firstName}`;
	} else {
		return `${entry.entityName}`;
	}
};

const getEntityEmail = entry => {
	const idAttribute = 'http://platform.selfkey.org/schema/attribute/email.json';
	const attribute = entry.attributes.find(a => a.type.content.$id === idAttribute);
	if (attribute && attribute.data.value) {
		return attribute.data.value;
	}
};

const getEntityRoles = entry => entry.identity.positions.join(', ');

const getEntityJurisdiction = entry => {
	const idAttribute =
		entry.identity.type === 'individual'
			? 'http://platform.selfkey.org/schema/attribute/nationality.json'
			: 'http://platform.selfkey.org/schema/attribute/legal-jurisdiction.json';
	const attribute = entry.attributes.find(a => a.type.content.$id === idAttribute);
	if (attribute && attribute.data.value) {
		return attribute.data.value;
	}
};

const getEntityResidency = entry => {
	const idAttribute =
		entry.identity.type === 'individual'
			? 'http://platform.selfkey.org/schema/attribute/country-of-residency.json'
			: 'http://platform.selfkey.org/schema/attribute/legal-jurisdiction.json';
	const attribute = entry.attributes.find(a => a.type.content.$id === idAttribute);
	if (attribute && attribute.data.value) {
		return attribute.data.value;
	}
};

const getEntityEquity = entry => entry.identity.equity;

export {
	getEntityType,
	getEntityIcon,
	getEntityName,
	getEntityEmail,
	getEntityRoles,
	getEntityJurisdiction,
	getEntityResidency,
	getEntityEquity
};
