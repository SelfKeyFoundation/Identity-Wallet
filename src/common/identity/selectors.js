import { walletSelectors } from '../wallet';
import { jsonSchema } from './utils';

const EMAIL_ATTRIBUTE = 'http://platform.selfkey.org/schema/attribute/email.json';
const FIRST_NAME_ATTRIBUTE = 'http://platform.selfkey.org/schema/attribute/first-name.json';
const LAST_NAME_ATTRIBUTE = 'http://platform.selfkey.org/schema/attribute/last-name.json';
const MIDDLE_NAME_ATTRIBUTE = 'http://platform.selfkey.org/schema/attribute/middle-name.json';

const BASIC_ATTRIBUTES = {
	[FIRST_NAME_ATTRIBUTE]: 1,
	[LAST_NAME_ATTRIBUTE]: 1,
	[MIDDLE_NAME_ATTRIBUTE]: 1,
	[EMAIL_ATTRIBUTE]: 1,
	'http://platform.selfkey.org/schema/attribute/country-of-residency.json': 1,
	'http://platform.selfkey.org/schema/attribute/address.json': 1
};

const selectIdentity = state => state.identity;

const selectCountries = state => identitySelectors.selectIdentity(state).countries;

const selectRepositories = state =>
	identitySelectors
		.selectIdentity(state)
		.repositories.map(id => identitySelectors.selectIdentity(state).repositoriesById[id]);

const selectExpiredRepositories = state => {
	let now = Date.now();
	return identitySelectors.selectRepositories(state).filter(repo => repo.expires <= now);
};

const selectIdAttributeTypes = state =>
	identitySelectors
		.selectIdentity(state)
		.idAtrributeTypes.map(
			id => identitySelectors.selectIdentity(state).idAtrributeTypesById[id]
		)
		.filter(t => t && t.content);

const selectExpiredIdAttributeTypes = state => {
	let now = Date.now();
	return identitySelectors
		.selectIdAttributeTypes(state)
		.filter(attributeType => attributeType.expires <= now);
};

const selectIdAttributeTypeByUrl = (state, url) =>
	identitySelectors.selectIdAttributeTypes(state).find(t => t.url === url);

const selectUiSchemas = state =>
	identitySelectors
		.selectIdentity(state)
		.uiSchemas.map(id => identitySelectors.selectIdentity(state).uiSchemasById[id]);

const selectExpiredUiSchemas = state => {
	let now = Date.now();
	return identitySelectors
		.selectUiSchemas(state)
		.filter(uiSelectors => uiSelectors.expires <= now);
};

const selectDocuments = state =>
	identitySelectors
		.selectIdentity(state)
		.documents.map(docId => identitySelectors.selectIdentity(state).documentsById[docId]);

const selectIdAttributes = (state, walletId) =>
	identitySelectors
		.selectIdentity(state)
		.attributes.map(attrId => identitySelectors.selectIdentity(state).attributesById[attrId])
		.filter(attr => attr.walletId === walletId);

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

const selectFullIdAttributesByIds = (state, walletId, attributeIds = null) => {
	const identity = identitySelectors.selectIdentity(state);
	const documents = selectDocumentsByAttributeIds(state, attributeIds);
	const types = identity.idAtrributeTypesById;

	return identitySelectors
		.selectIdAttributes(state, walletId)
		.filter(attr => !attributeIds || attributeIds.includes(attr.id))
		.map(attr => {
			const type = types[attr.typeId];
			const defaultRepository = identity.repositoriesById[type.defaultRepositoryId];
			const defaultUiSchema = identitySelectors.selectUiSchema(
				state,
				type.id,
				defaultRepository.id
			);

			return {
				...attr,
				type,
				defaultRepository,
				defaultUiSchema,
				documents: documents[attr.id] || []
			};
		})
		.filter(attr => attr.type && attr.type.content);
};

const selectSelfkeyId = state => {
	const wallet = walletSelectors.getWallet(state);

	const allAttributes = identitySelectors.selectFullIdAttributesByIds(state, wallet.id);

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
		wallet,
		profilePicture: wallet.profilePicture,
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
	selectUiSchema
};

export default identitySelectors;
