import { walletSelectors } from '../wallet';

const selectIdentity = state => state.identity;

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
		);

const selectExpiredIdAttributeTypes = state => {
	let now = Date.now();
	return identitySelectors
		.selectIdAttributeTypes(state)
		.filter(attributeType => attributeType.expires <= now);
};

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

const selectDocuments = (state, walletId) =>
	identitySelectors
		.selectIdentity(state)
		.documents.map(docId => identitySelectors.selectIdentity(state).documentsById[docId])
		.filter(doc => doc.walletId === walletId);

const selectIdAttributes = (state, walletId) =>
	identitySelectors
		.selectIdentity(state)
		.attributes.map(attrId => identitySelectors.selectIdentity(state).attributesById[attrId])
		.filter(attr => attr.walletId === walletId);

const selectDocumentsByAttributeIds = (state, walletId, attributeIds = null) =>
	identitySelectors.selectDocuments(state, walletId).reduce((acc, curr) => {
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
	const documents = selectDocumentsByAttributeIds(state, walletId, attributeIds);
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
		});
};

const selectSelfkeyId = state => {
	const wallet = walletSelectors.getWallet(state);

	const attributes = identitySelectors.selectFullIdAttributesByIds(state, wallet.id);

	return {
		wallet,
		profilePicture: wallet.profilePicture,
		attributes
	};
};

export const identitySelectors = {
	selectIdentity,
	selectRepositories,
	selectExpiredRepositories,
	selectIdAttributeTypes,
	selectExpiredIdAttributeTypes,
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
