export const EMAIL_ATTRIBUTE = 'http://platform.selfkey.org/schema/attribute/email.json';
export const FIRST_NAME_ATTRIBUTE = 'http://platform.selfkey.org/schema/attribute/first-name.json';
export const LAST_NAME_ATTRIBUTE = 'http://platform.selfkey.org/schema/attribute/last-name.json';
export const MIDDLE_NAME_ATTRIBUTE =
	'http://platform.selfkey.org/schema/attribute/middle-name.json';
export const COUNTRY_ATTRIBUTE =
	'http://platform.selfkey.org/schema/attribute/country-of-residency.json';

export const ENTITY_NAME_ATTRIBUTE =
	'http://platform.selfkey.org/schema/attribute/company-name.json';
export const ENTITY_TYPE_ATTRIBUTE =
	'http://platform.selfkey.org/schema/attribute/legal-entity-type.json';
export const JURISDICTION_ATTRIBUTE =
	'http://platform.selfkey.org/schema/attribute/legal-jurisdiction.json';
export const CREATION_DATE_ATTRIBUTE =
	'http://platform.selfkey.org/schema/attribute/incorporation-date.json';
export const TAX_ID_ATTRIBUTE = 'http://platform.selfkey.org/schema/attribute/tax-id-number.json';
export const ADDRESS_ATTRIBUTE = 'http://platform.selfkey.org/schema/attribute/address.json';

export const NATIONALITY_ATTRIBUTE =
	'http://platform.selfkey.org/schema/attribute/nationality.json';
export const RESIDENCY_ATTRIBUTE =
	'http://platform.selfkey.org/schema/attribute/country-of-residency.json';
export const PHONE_ATTRIBUTE = 'http://platform.selfkey.org/schema/attribute/phone-number.json';

export const BASIC_ATTRIBUTES = {
	[FIRST_NAME_ATTRIBUTE]: 1,
	[LAST_NAME_ATTRIBUTE]: 1,
	[MIDDLE_NAME_ATTRIBUTE]: 1,
	[EMAIL_ATTRIBUTE]: 1,
	[COUNTRY_ATTRIBUTE]: 1,
	[ADDRESS_ATTRIBUTE]: 1
};

export const BASIC_CORPORATE_ATTRIBUTES = {
	[ENTITY_NAME_ATTRIBUTE]: 1,
	[ENTITY_TYPE_ATTRIBUTE]: 1,
	[JURISDICTION_ATTRIBUTE]: 1,
	[EMAIL_ATTRIBUTE]: 1,
	[CREATION_DATE_ATTRIBUTE]: 1,
	[TAX_ID_ATTRIBUTE]: 1
};

export const CORPORATE_STRUCTURE =
	'http://platform.selfkey.org/schema/attribute/corporate-structure.json';

export const individualMemberAttributes = [
	{ key: 'firstName', type: FIRST_NAME_ATTRIBUTE, name: 'First Name', required: true },
	{ key: 'lastName', type: LAST_NAME_ATTRIBUTE, name: 'Last Name', required: true },
	{ key: 'citizenship', type: NATIONALITY_ATTRIBUTE, name: 'Citizenship', required: true },
	{ key: 'residency', type: RESIDENCY_ATTRIBUTE, name: 'Residency', required: true },
	{ key: 'email', type: EMAIL_ATTRIBUTE, name: 'Email', required: true },
	{ key: 'phone', type: PHONE_ATTRIBUTE, name: 'Phone' }
];

export const corporateMemberAttributes = [
	{ key: 'entityName', type: ENTITY_NAME_ATTRIBUTE, name: 'Legal Entity Name', required: true },
	{ key: 'entityType', type: ENTITY_TYPE_ATTRIBUTE, name: 'Legal Entity Type', required: true },
	{
		key: 'jurisdiction',
		type: JURISDICTION_ATTRIBUTE,
		name: 'Legal Jurisdiction',
		required: true
	},
	{
		key: 'createDate',
		type: CREATION_DATE_ATTRIBUTE,
		name: 'Incorporation Date',
		required: true
	},
	{ key: 'email', type: EMAIL_ATTRIBUTE, name: 'Email', required: true },
	{ key: 'taxId', type: TAX_ID_ATTRIBUTE, name: 'Tax Id' }
];
