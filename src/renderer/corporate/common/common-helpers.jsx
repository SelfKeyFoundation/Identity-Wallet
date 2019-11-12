import React from 'react';
import { SmallRoundCompany, SmallRoundPerson } from 'selfkey-ui';
import { withStyles } from '@material-ui/core/styles';

const getEntityIcon = entry => {
	if (entry.entity.type === 'individual') {
		return <SmallRoundPerson />;
	} else {
		return <SmallRoundCompany />;
	}
};

const getEntityName = entry => {
	if (entry.entity.type === 'individual') {
		return `${entry.entity.lastName}, ${entry.entity.firstName}`;
	} else {
		return `${entry.entity.companyName}`;
	}
};

const getEntityEmail = entry => entry.entity.email;

const getEntityRoles = entry => entry.positions.map(p => p.position).join(', ');

const getEntityJurisdiction = entry => {
	const idAttribute =
		entry.entity.type === 'individual'
			? 'http://platform.selfkey.org/schema/attribute/nationality.json'
			: 'http://platform.selfkey.org/schema/attribute/legal-jurisdiction.json';
	const attribute = entry.attributes.find(a => a.type.content.$id === idAttribute);
	if (attribute && attribute.data.value) {
		return attribute.data.value;
	}
};

const getEntityResidency = entry => {
	const idAttribute =
		entry.entity.type === 'individual'
			? 'http://platform.selfkey.org/schema/attribute/country-of-residency.json'
			: 'http://platform.selfkey.org/schema/attribute/legal-jurisdiction.json';
	const attribute = entry.attributes.find(a => a.type.content.$id === idAttribute);
	if (attribute && attribute.data.value) {
		return attribute.data.value;
	}
};

const getEntityEquity = entry => {
	const shareholder = entry.positions.find(p => p.position === 'shareholder');
	if (shareholder) {
		return shareholder.equity;
	} else {
		return '';
	}
};

export {
	getEntityIcon,
	getEntityName,
	getEntityEmail,
	getEntityRoles,
	getEntityJurisdiction,
	getEntityResidency,
	getEntityEquity
};
