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

const selectDocumentsByAttributeIds = (state, walletId, attributeIds) =>
	identitySelectors.selectDocuments(state, walletId).reduce((acc, curr) => {
		if (!attributeIds.includes(curr.attributeId)) return acc;
		acc[curr.attributeId] = curr;
		return acc;
	}, {});

const selectFullIdAttributesByIds = (state, walletId, attributeIds) => {
	const documents = selectDocumentsByAttributeIds(state, walletId, attributeIds);
	const types = identitySelectors.selectIdentity(state).idAtrributeTypesById;
	return identitySelectors
		.selectIdAttributes(state, walletId)
		.filter(attr => attributeIds.includes(attr.id))
		.map(attr => {
			return {
				value: attr.data,
				id: types[attr.typeId].url,
				schema: types[attr.typeId].schema,
				documents: documents[attr.id] || []
			};
		});
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
	selectFullIdAttributesByIds
};

export default identitySelectors;
