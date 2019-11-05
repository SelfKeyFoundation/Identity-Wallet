import { jsonSchema, identityAttributes } from './utils';
import { forceUpdateAttributes } from 'common/config';
import { walletSelectors } from 'common/wallet';

const EMAIL_ATTRIBUTE = 'http://platform.selfkey.org/schema/attribute/email.json';
const FIRST_NAME_ATTRIBUTE = 'http://platform.selfkey.org/schema/attribute/first-name.json';
const LAST_NAME_ATTRIBUTE = 'http://platform.selfkey.org/schema/attribute/last-name.json';
const MIDDLE_NAME_ATTRIBUTE = 'http://platform.selfkey.org/schema/attribute/middle-name.json';
const COUNTRY_ATTRIBUTE = 'http://platform.selfkey.org/schema/attribute/country-of-residency.json';

const ENTITY_NAME = 'http://platform.selfkey.org/schema/attribute/company-name.json';
const ENTITY_TYPE = 'http://platform.selfkey.org/schema/attribute/legal-entity-type.json';
const JURISDICTION = 'http://platform.selfkey.org/schema/attribute/legal-jurisdiction.json';
const CREATION_DATE = 'http://platform.selfkey.org/schema/attribute/incorporation-date.json';
const TAX_ID = 'http://platform.selfkey.org/schema/attribute/tax-id-number.json';

const BASIC_ATTRIBUTES = {
	[FIRST_NAME_ATTRIBUTE]: 1,
	[LAST_NAME_ATTRIBUTE]: 1,
	[MIDDLE_NAME_ATTRIBUTE]: 1,
	[EMAIL_ATTRIBUTE]: 1,
	[COUNTRY_ATTRIBUTE]: 1,
	'http://platform.selfkey.org/schema/attribute/address.json': 1
};

const BASIC_CORPORATE_ATTRIBUTES = {
	[ENTITY_NAME]: 1,
	[ENTITY_TYPE]: 1,
	[JURISDICTION]: 1,
	[EMAIL_ATTRIBUTE]: 1,
	[CREATION_DATE]: 1,
	[TAX_ID]: 1
};

const selectIdentity = state => state.identity;

const selectCountries = state => {
	const type = identitySelectors.selectIdAttributeTypeByUrl(state, COUNTRY_ATTRIBUTE);
	if (
		!type ||
		!type.content ||
		!type.content.properties ||
		!type.content.properties.country ||
		!type.content.properties.country.enum
	) {
		return identitySelectors.selectIdentity(state).countries;
	}
	const codes = type.content.properties.country.enum;
	const names = type.content.properties.country.enumNames;
	return codes.map((code, index) => ({ code, name: names[index] }));
};

const selectRepositories = state =>
	identitySelectors
		.selectIdentity(state)
		.repositories.map(id => identitySelectors.selectIdentity(state).repositoriesById[id]);

const selectExpiredRepositories = state => {
	let now = Date.now();
	return identitySelectors
		.selectRepositories(state)
		.filter(repo => forceUpdateAttributes || repo.expires <= now);
};

const selectIdAttributeTypes = (state, entityType = ['individual'], includeSystem = false) => {
	if (!Array.isArray(entityType)) {
		entityType = [entityType];
	}
	return identitySelectors
		.selectIdentity(state)
		.idAtrributeTypes.map(
			id => identitySelectors.selectIdentity(state).idAtrributeTypesById[id]
		)
		.filter(t => {
			if (!t || !t.content || (t.content.system && !includeSystem)) return false;

			if (!t.content.entityType && !entityType.includes('individual')) {
				return false;
			}
			let hasEntityType = entityType.reduce((acc, curr) => {
				if (acc) return acc;
				return (t.content.entityType || ['individual']).includes(curr);
			}, false);
			return hasEntityType;
		});
};

const selectExpiredIdAttributeTypes = state => {
	let now = Date.now();
	return identitySelectors
		.selectIdAttributeTypes(state, ['individual', 'corporate'], true)
		.filter(attributeType => forceUpdateAttributes || attributeType.expires <= now);
};

const selectIdAttributeTypeByUrl = (state, url, entityType, includeSystem) =>
	identitySelectors
		.selectIdAttributeTypes(state, entityType, includeSystem)
		.find(t => t.url === url);

const selectUiSchemas = state =>
	identitySelectors
		.selectIdentity(state)
		.uiSchemas.map(id => identitySelectors.selectIdentity(state).uiSchemasById[id]);

const selectExpiredUiSchemas = state => {
	let now = Date.now();
	return identitySelectors
		.selectUiSchemas(state)
		.filter(uiSelectors => forceUpdateAttributes || uiSelectors.expires <= now);
};

const selectDocuments = state =>
	identitySelectors
		.selectIdentity(state)
		.documents.map(docId => identitySelectors.selectIdentity(state).documentsById[docId]);

const selectIdAttributes = (state, identityId) =>
	identitySelectors
		.selectIdentity(state)
		.attributes.map(attrId => identitySelectors.selectIdentity(state).attributesById[attrId])
		.filter(attr => attr.identityId === identityId);

const selectDocumentsByAttributeIds = (state, attributeIds = null) =>
	identitySelectors.selectDocuments(state).reduce((acc, curr) => {
		if (attributeIds !== null && !attributeIds.includes(curr.attributeId)) return acc;
		acc[curr.attributeId] = acc[curr.attributeId] || [];
		acc[curr.attributeId].push(curr);
		return acc;
	}, {});

const selectUiSchema = (state, typeId, repositoryId) =>
	(identitySelectors.selectUiSchemas(state) || []).find(
		schema => schema.repositoryId === repositoryId && typeId === schema.attributeTypeId
	);

const selectFullIdAttributesByIds = (state, identityId, attributeIds = null) => {
	const identity = identitySelectors.selectIdentity(state);
	const documents = selectDocumentsByAttributeIds(state, attributeIds);
	const types = identity.idAtrributeTypesById;

	return identitySelectors
		.selectIdAttributes(state, identityId)
		.filter(attr => !attributeIds || attributeIds.includes(attr.id))
		.map(attr => {
			const type = types[attr.typeId];
			const defaultRepository = identity.repositoriesById[type.defaultRepositoryId];
			const defaultUiSchema = identitySelectors.selectUiSchema(
				state,
				type.id,
				defaultRepository.id
			);
			const attrDocs = documents[attr.id] || [];
			const isValid = identityAttributes.validate(type.content, attr.data.value, attrDocs);
			return {
				...attr,
				type,
				defaultRepository,
				defaultUiSchema,
				isValid,
				documents: attrDocs
			};
		})
		.filter(attr => attr.type && attr.type.content);
};

const selectSelfkeyId = state => {
	const identity = identitySelectors.selectCurrentIdentity(state);
	const wallet = walletSelectors.getWallet(state);
	const allAttributes = identitySelectors.selectFullIdAttributesByIds(state, identity.id);

	// FIXME: all base attribute types should be rendered (even if not created yet)
	const basicAttributes = allAttributes.reduce(
		(acc, curr) => {
			const { url } = curr.type;
			if (!BASIC_ATTRIBUTES[url]) return acc;
			if (acc.seen[url]) return acc;
			acc.seen[url] = 1;
			acc.attrs.push(curr);
			return acc;
		},
		{ seen: {}, attrs: [] }
	).attrs;
	const attributes = allAttributes.filter(
		attr => !jsonSchema.containsFile(attr.type.content) && !basicAttributes.includes(attr)
	);

	// FIXME: document type should be determined by attribute type
	const documents = allAttributes.filter(attr => jsonSchema.containsFile(attr.type.content));

	const getBasicInfo = (type, basicAttrs) => {
		let attr = basicAttrs.find(attr => attr.type.url === type);
		if (!attr || !attr.data || !attr.data.value) return '';
		return attr.data.value;
	};
	return {
		identity,
		wallet,
		profilePicture: identity.profilePicture,
		allAttributes,
		attributes,
		basicAttributes,
		documents,
		email: getBasicInfo(EMAIL_ATTRIBUTE, basicAttributes),
		firstName: getBasicInfo(FIRST_NAME_ATTRIBUTE, basicAttributes),
		lastName: getBasicInfo(LAST_NAME_ATTRIBUTE, basicAttributes),
		middleName: getBasicInfo(MIDDLE_NAME_ATTRIBUTE, basicAttributes)
	};
};

const selectIdentityById = (state, id) => {
	const tree = selectIdentity(state);
	return tree.identitiesById[id];
};

const selectAllIdentities = (state, onlyRoot = true) => {
	const tree = selectIdentity(state);
	const identities = tree.identities.map(id => tree.identitiesById[id]);
	if (onlyRoot) {
		return identities.filter(ident => ident.rootIdentity);
	}
	return identities;
};

const selectCurrentIdentity = state => {
	const tree = selectIdentity(state);
	return selectIdentityById(state, tree.currentIdentity);
};

const selectCorporateJurisdictions = state => {
	const idType = selectIdAttributeTypeByUrl(
		state,
		'http://platform.selfkey.org/schema/attribute/legal-jurisdiction.json',
		'corporate'
	);
	if (!idType) return [];
	return idType.content.enum;
};

const selectCorporateLegalEntityTypes = state => {
	const idType = selectIdAttributeTypeByUrl(
		state,
		'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
		'corporate'
	);
	if (!idType) return [];
	return idType.content.enum;
};

const selectCurrentCorporateProfile = state => {
	const identity = identitySelectors.selectCurrentIdentity(state);
	return identitySelectors.selectCorporateProfile(state, identity.id);
};

const selectBasicCorporateAttributeTypes = state => {
	let map = BASIC_CORPORATE_ATTRIBUTES;

	let allTypes = selectIdAttributeTypes(state, 'corporate');

	return allTypes
		.filter(t => map[t.url])
		.reduce((acc, curr) => {
			curr = { ...curr };
			switch (curr.url) {
				case EMAIL_ATTRIBUTE:
					acc.email = curr;
					curr.required = false;
					return acc;
				case TAX_ID:
					acc.taxId = curr;
					curr.required = false;
					return acc;
				case ENTITY_NAME:
					acc.entityName = curr;
					curr.required = true;
					return acc;
				case ENTITY_TYPE:
					acc.entityType = curr;
					curr.required = true;
					return acc;
				case CREATION_DATE:
					acc.creationDate = curr;
					curr.required = true;
					return acc;
				case JURISDICTION:
					acc.jurisdiction = curr;
					curr.required = true;
					return acc;
				default:
					return acc;
			}
		}, {});
};

const selectChildrenIdentities = (state, identityId) => {
	const identity = selectIdentityById(state, identityId);

	if (!identity || identity.type === 'individual') {
		return [];
	}

	return selectAllIdentities(state, false).filter(idnt => idnt.parentId === identityId);
};

const selectMemberIdentities = (state, identityId, circleMap = {}) => {
	if (circleMap[identityId]) {
		return [];
	}

	circleMap[identityId] = true;

	const identities = selectChildrenIdentities(state, identityId);

	return identities.reduce((acc, curr) => {
		if (curr.type === 'individual') {
			return acc;
		}
		const members = selectMemberIdentities(state, curr.id, circleMap);

		return acc.concat(members);
	}, []);
};

const selectCorporateProfile = (state, id) => {
	const identity = identitySelectors.selectIdentityById(state, id);
	if (!identity) return {};
	const wallet = walletSelectors.getWallet(state);
	const allAttributes = identitySelectors.selectFullIdAttributesByIds(state, identity.id);

	// FIXME: all base attribute types should be rendered (even if not created yet)
	const basicAttributes = allAttributes.reduce(
		(acc, curr) => {
			const { url } = curr.type;
			if (!BASIC_CORPORATE_ATTRIBUTES[url]) return acc;
			if (acc.seen[url]) return acc;
			acc.seen[url] = 1;
			acc.attrs.push(curr);
			return acc;
		},
		{ seen: {}, attrs: [] }
	).attrs;
	const attributes = allAttributes.filter(attr => !jsonSchema.containsFile(attr.type.content));

	// FIXME: document type should be determined by attribute type
	const documents = allAttributes.filter(attr => jsonSchema.containsFile(attr.type.content));

	const getBasicInfo = (type, basicAttrs) => {
		let attr = basicAttrs.find(attr => attr.type.url === type);
		if (!attr || !attr.data || !attr.data.value) return '';
		return attr.data.value;
	};
	// TODO max: move profile picture to identity model
	return {
		identity,
		wallet,
		profilePicture: identity.profilePicture,
		allAttributes,
		attributes,
		basicAttributes,
		documents,
		email: getBasicInfo(EMAIL_ATTRIBUTE, basicAttributes),
		taxId: getBasicInfo(TAX_ID, basicAttributes),
		entityName: getBasicInfo(ENTITY_NAME, basicAttributes),
		entityType: getBasicInfo(ENTITY_TYPE, basicAttributes),
		creationDate: getBasicInfo(CREATION_DATE, basicAttributes),
		jurisdiction: getBasicInfo(JURISDICTION, basicAttributes)
	};
};

export const identitySelectors = {
	selectIdentity,
	selectCountries,
	selectRepositories,
	selectExpiredRepositories,
	selectIdAttributeTypes,
	selectExpiredIdAttributeTypes,
	selectIdAttributeTypeByUrl,
	selectUiSchemas,
	selectExpiredUiSchemas,
	selectDocuments,
	selectIdAttributes,
	selectDocumentsByAttributeIds,
	selectFullIdAttributesByIds,
	selectSelfkeyId,
	selectUiSchema,
	selectCurrentIdentity,
	selectIdentityById,
	selectAllIdentities,
	selectCorporateJurisdictions,
	selectCorporateLegalEntityTypes,
	selectCorporateProfile,
	selectCurrentCorporateProfile,
	selectBasicCorporateAttributeTypes,
	selectChildrenIdentities,
	selectMemberIdentities
};

export default identitySelectors;
