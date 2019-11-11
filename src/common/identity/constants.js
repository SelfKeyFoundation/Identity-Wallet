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
