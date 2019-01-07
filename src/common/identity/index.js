import { getGlobalContext } from '../context';
import { createAliasedAction } from 'electron-redux';
import { walletSelectors } from '../wallet';

export const initialState = {
	repositories: [],
	repositoriesById: {},
	idAtrributeTypes: [],
	idAtrributeTypesById: {},
	uiSchemas: [],
	uiSchemasById: {},
	documents: [],
	documentsById: {},
	attributes: [],
	attributesById: {}
};

export const identityTypes = {
	IDENTITY_REPOSITORIES_LOAD: 'identity/repositories/LOAD',
	IDENTITY_REPOSITORIES_SET: 'identity/repositories/SET',
	IDENTITY_REPOSITORIES_UPDATE_REMOTE: 'identity/repositories/UPDATE_REMOTE',
	IDENTITY_ID_ATTRIBUTE_TYPES_LOAD: 'identity/id-atribute_types/LOAD',
	IDENTITY_ID_ATTRIBUTE_TYPES_SET: 'identity/id-atribute_types/SET',
	IDENTITY_ID_ATTRIBUTE_TYPES_UPDATE_REMOTE: 'identity/id-atribute_types/UPDATE_REMOTE',
	IDENTITY_UI_SCHEMAS_LOAD: 'identity/ui-schemas/LOAD',
	IDENTITY_UI_SCHEMAS_SET: 'identity/ui-schemas/SET',
	IDENTITY_UI_SCHEMAS_UPDATE_REMOTE: 'identity/ui-schemas/UPDATE_REMOTE',
	IDENTITY_DOCUMENTS_LOAD: 'identity/documents/LOAD',
	IDENTITY_DOCUMENTS_SET: 'identity/documents/SET',
	IDENTITY_DOCUMENT_ADD: 'identity/documents/ADD',
	IDENTITY_DOCUMENT_UPDATE: 'identity/documents/ADD',
	IDENTITY_DOCUMENTS_DELETE: 'identity/documents/DELETE_ONE',
	IDENTITY_DOCUMENT_DELETE: 'identity/documents/DELETE',
	IDENTITY_ATTRIBUTES_LOAD: 'identity/attributes/LOAD',
	IDENTITY_ATTRIBUTES_SET: 'identity/attributes/SET',
	IDENTITY_ATTRIBUTE_ADD: 'identity/attribute/ADD',
	IDENTITY_ATTRIBUTE_REMOVE: 'identity/attribute/REMOVE',
	IDENTITY_ATTRIBUTE_CREATE: 'identity/attribute/CREATE',
	IDENTITY_ATTRIBUTE_UPDATE: 'identity/attribute/UPDATE',
	IDENTITY_ATTRIBUTE_EDIT: 'identity/attribute/EDIT',
	IDENTITY_ATTRIBUTES_DELETE: 'identity/attributes/DELETE',
	IDENTITY_ATTRIBUTE_DELETE: 'identity/attributes/DELETE_ONE',
	IDENTITY_ATTRIBUTE_DOCUMENTS_LOAD: 'identity/attribute_documents/LOAD',
	IDENTITY_ATTRIBUTE_DOCUMENTS_SET: 'identity/attribute_documents/SET',
	IDENTITY_ATTRIBUTE_DOCUMENTS_DELETE: 'identity/attribute_documents/DELETE',
	IDENTITY_DOCUMENT_REMOVE: 'identity/documents/REMOVE',
	IDENTITY_UNLOCK: 'identity/UNLOCK',
	IDENTITY_LOCK: 'identity/LOCK'
};

const identityActions = {
	setRepositoriesAction: repos => ({
		type: identityTypes.IDENTITY_REPOSITORIES_SET,
		payload: repos
	}),
	setIdAttributeTypesAction: attributeTypes => ({
		type: identityTypes.IDENTITY_ID_ATTRIBUTE_TYPES_SET,
		payload: attributeTypes
	}),
	setUiSchemasAction: uiSchemas => ({
		type: identityTypes.IDENTITY_UI_SCHEMAS_SET,
		payload: uiSchemas
	}),
	setDocumentsAction: (walletId, documents) => ({
		type: identityTypes.IDENTITY_DOCUMENTS_SET,
		payload: {
			walletId,
			documents
		}
	}),
	deleteDocumentsAction: walletId => ({
		type: identityTypes.IDENTITY_DOCUMENTS_DELETE,
		payload: walletId
	}),
	setIdAttributesAction: (walletId, attributes) => ({
		type: identityTypes.IDENTITY_ATTRIBUTES_SET,
		payload: {
			walletId,
			attributes
		}
	}),
	deleteIdAttributesAction: walletId => ({
		type: identityTypes.IDENTITY_ATTRIBUTES_DELETE,
		payload: walletId
	}),
	deleteIdAttributeAction: attributeId => ({
		type: identityTypes.IDENTITY_ATTRIBUTE_DELETE,
		payload: attributeId
	}),
	addIdAttributeAction: attribute => ({
		type: identityTypes.IDENTITY_ATTRIBUTE_ADD,
		payload: attribute
	}),
	setDocumentsForAttributeAction: (attributeId, documents) => ({
		type: identityTypes.IDENTITY_ATTRIBUTE_DOCUMENTS_SET,
		payload: { attributeId, documents }
	}),
	deleteDocumentsForAttributeAction: attributeId => ({
		type: identityTypes.IDENTITY_ATTRIBUTE_DOCUMENTS_DELETE,
		payload: attributeId
	}),
	addDocumentAction: attribute => ({
		type: identityTypes.IDENTITY_DOCUMENT_ADD,
		payload: attribute
	}),
	updateDocumentAction: attribute => ({
		type: identityTypes.IDENTITY_DOCUMENT_UPDATE,
		payload: attribute
	}),
	updateIdAttributeAction: attribute => ({
		type: identityTypes.IDENTITY_ATTRIBUTE_UPDATE,
		payload: attribute
	}),
	deleteDocumentAction: documentId => ({
		type: identityTypes.IDENTITY_DOCUMENT_DELETE,
		payload: documentId
	})
};

const loadRepositoriesOperation = () => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let repos = await identityService.loadRepositories();
	await dispatch(identityActions.setRepositoriesAction(repos));
};

const updateExpiredRepositoriesOperation = () => async (dispatch, getState) => {
	let expired = identitySelectors.selectExpiredRepositories(getState());
	const identityService = getGlobalContext().identityService;
	await identityService.updateRepositories(expired);
	await operations.loadRepositoriesOperation(dispatch, getState);
};

const loadIdAttributeTypesOperation = () => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let attributeTypes = await identityService.loadIdAttributeTypes();
	await dispatch(identityActions.setIdAttributeTypesAction(attributeTypes));
};

const updateExpiredIdAttributeTypesOperation = () => async (dispatch, getState) => {
	let expired = identitySelectors.selectExpiredIdAttributeTypes(getState());
	const identityService = getGlobalContext().identityService;
	await identityService.updateIdAttributeTypes(expired);
	await operations.loadIdAttributeTypesOperation(dispatch, getState);
};

const loadUiSchemasOperation = () => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let uiSchemas = await identityService.loadUiSchemas();
	await dispatch(identityActions.setUiSchemasAction(uiSchemas));
};

const updateExpiredUiSchemasOperation = () => async (dispatch, getState) => {
	let expired = identitySelectors.selectExpiredUiSchemas(getState());
	const identityService = getGlobalContext().identityService;
	await identityService.updateUiSchemas(expired);
	await operations.loadUiSchemasOperation(dispatch, getState);
};

const loadDocumentsOperation = walletId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let documents = await identityService.loadDocuments(walletId);
	documents = documents.map(doc => ({ ...doc, walletId }));
	await dispatch(identityActions.setDocumentsAction(documents));
};

const loadIdAttributesOperation = walletId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let attributes = await identityService.loadIdAttributes(walletId);
	await dispatch(identityActions.setIdAttributesAction(walletId, attributes));
};

const loadDocumentsForAttributeOperation = attrId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let documents = await identityService.loadDocumentsForAttribute(attrId);
	await dispatch(identityActions.setDocumentsForAttributeAction(attrId, documents));
};

const removeDocumentOperation = documentId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	await identityService.removeDocument(documentId);
	await dispatch(identityActions.deleteDocumentAction(documentId));
};

const createIdAttributeOperation = attribute => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	attribute = await identityService.createIdAttribute(attribute);
	await operations.loadDocumentsForAttributeOperation(attribute.id)(dispatch, getState);
	await dispatch(identityActions.addIdAttributeAction(attribute));
};

const removeIdAttributeOperation = attributeId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	await identityService.deleteIdAttribute(attributeId);
	await dispatch(identityActions.deleteDocumentsForAttributeAction(attributeId));
	await dispatch(identityActions.deleteIdAttributeAction(attributeId));
};

const editIdAttributeOperation = attribute => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	await identityService.editIdAttribute(attribute);
	await operations.loadDocumentsForAttributeOperation(attribute.id)(dispatch, getState);
	await dispatch(identityActions.updateIdAttributeAction(attribute));
};

const lockIdentityOperation = walletId => async (dispatch, getState) => {
	await dispatch(identityActions.deleteIdAttributesAction(walletId));
	await dispatch(identityActions.deleteDocumentsAction(walletId));
};
const unlockIdentityOperation = () => async (dispatch, getState) => {
	console.log('HEY');
	const walletId = walletSelectors.getWallet(getState()).id;
	await operations.loadDocumentsOperation(walletId)(dispatch, getState);
	await operations.loadIdAttributesOperation(walletId)(dispatch, getState);
};

const operations = {
	loadRepositoriesOperation,
	updateExpiredRepositoriesOperation,
	loadIdAttributeTypesOperation,
	updateExpiredIdAttributeTypesOperation,
	loadUiSchemasOperation,
	updateExpiredUiSchemasOperation,
	loadDocumentsOperation,
	loadIdAttributesOperation,
	loadDocumentsForAttributeOperation,
	removeDocumentOperation,
	createIdAttributeOperation,
	removeIdAttributeOperation,
	editIdAttributeOperation,
	unlockIdentityOperation,
	lockIdentityOperation
};

const identityOperations = {
	...identityActions,
	loadRepositoriesOperation: createAliasedAction(
		identityTypes.IDENTITY_REPOSITORIES_LOAD,
		operations.loadRepositoriesOperation
	),
	updateExpiredRepositoriesOperation: createAliasedAction(
		identityTypes.IDENTITY_REPOSITORIES_UPDATE_REMOTE,
		operations.updateExpiredRepositoriesOperation
	),
	loadIdAttributeTypesOperation: createAliasedAction(
		identityTypes.IDENTITY_ID_ATTRIBUTE_TYPES_LOAD,
		operations.loadIdAttributeTypesOperation
	),
	updateExpiredIdAttributeTypesOperation: createAliasedAction(
		identityTypes.IDENTITY_ID_ATTRIBUTE_TYPES_UPDATE_REMOTE,
		operations.updateExpiredIdAttributeTypesOperation
	),
	loadUiSchemasOperation: createAliasedAction(
		identityTypes.IDENTITY_UI_SCHEMAS_LOAD,
		operations.loadUiSchemasOperation
	),
	updateExpiredUiSchemasOperation: createAliasedAction(
		identityTypes.IDENTITY_UI_SCHEMAS_UPDATE_REMOTE,
		operations.updateExpiredUiSchemasOperation
	),
	loadDocumentsOperation: createAliasedAction(
		identityTypes.IDENTITY_DOCUMENTS_LOAD,
		operations.loadDocumentsOperation
	),
	loadIdAttributesOperation: createAliasedAction(
		identityTypes.IDENTITY_ATTRIBUTES_LOAD,
		operations.loadIdAttributesOperation
	),
	loadDocumentsForAttributeOperation: createAliasedAction(
		identityTypes.IDENTITY_ATTRIBUTE_DOCUMENTS_LOAD,
		operations.loadDocumentsForAttributeOperation
	),
	removeDocumentOperation: createAliasedAction(
		identityTypes.IDENTITY_DOCUMENT_REMOVE,
		operations.removeDocumentOperation
	),
	createIdAttributeOperation: createAliasedAction(
		identityTypes.IDENTITY_ATTRIBUTE_CREATE,
		operations.createIdAttributeOperation
	),
	removeIdAttributeOperation: createAliasedAction(
		identityTypes.IDENTITY_ATTRIBUTE_REMOVE,
		operations.removeIdAttributeOperation
	),
	unlockIdentityOperation: createAliasedAction(
		identityTypes.IDENTITY_UNLOCK,
		operations.unlockIdentityOperation
	),
	lockIdentityOperation: createAliasedAction(
		identityTypes.IDENTITY_LOCK,
		operations.lockIdentityOperation
	)
};

const setRepositoriesReducer = (state, action) => {
	let repositories = action.payload || [];
	let repositoriesById = repositories.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	repositories = repositories.map(repo => repo.id);
	return { ...state, repositories, repositoriesById };
};

const setIdAttributeTypesReducer = (state, action) => {
	let idAtrributeTypes = action.payload || [];
	let idAtrributeTypesById = idAtrributeTypes.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	idAtrributeTypes = idAtrributeTypes.map(attr => attr.id);
	return { ...state, idAtrributeTypes, idAtrributeTypesById };
};

const setUiSchemasReducer = (state, action) => {
	let uiSchemas = action.payload || [];
	let uiSchemasById = uiSchemas.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	uiSchemas = uiSchemas.map(attr => attr.id);
	return { ...state, uiSchemas, uiSchemasById };
};

const setDocumentsReducer = (state, action) => {
	let oldDocuments = state.documents
		.map(docId => state.documentsById[docId])
		.filter(doc => doc.walletId !== action.walletId);
	let documents = [...oldDocuments, ...(action.payload.documents || [])];
	let documentsById = documents.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	documents = documents.map(attr => attr.id);
	return { ...state, documents, documentsById };
};

const setAttributeDocumentsReducer = (state, action) => {
	let oldDocuments = state.documents
		.map(docId => state.documentsById[docId])
		.filter(doc => doc.attributeId !== action.attributeId);
	let documents = [...oldDocuments, ...(action.payload.documents || [])];
	let documentsById = documents.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	documents = documents.map(attr => attr.id);
	return { ...state, documents, documentsById };
};

const deleteAttributeDocumentsReducer = (state, action) => {
	let documents = state.documents
		.map(docId => state.documentsById[docId])
		.filter(doc => doc.attributeId !== action.payload);
	let documentsById = documents.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	documents = documents.map(attr => attr.id);
	return { ...state, documents, documentsById };
};

const deleteDocumentsReducer = (state, action) => {
	let documents = state.documents
		.map(docId => state.documentsById[docId])
		.filter(doc => doc.walletId !== action.payload);
	let documentsById = documents.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	documents = documents.map(attr => attr.id);
	return { ...state, documents, documentsById };
};

const setIdAttributesReducer = (state, action) => {
	let oldIdAttributes = state.attributes
		.map(attrId => state.attributesById[attrId])
		.filter(attr => attr.walletId !== action.payload.walletId);
	let attributes = [...oldIdAttributes, ...(action.payload.attributes || [])];
	let attributesById = attributes.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	attributes = attributes.map(attr => attr.id);
	return { ...state, attributes, attributesById };
};

const deleteIdAttributesReducer = (state, action) => {
	let attributes = state.attributes
		.map(attrId => state.attributesById[attrId])
		.filter(attr => attr.walletId !== action.payload);
	let attributesById = attributes.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	attributes = attributes.map(attr => attr.id);
	return { ...state, attributes, attributesById };
};

const addIdAttributeReducer = (state, action) => {
	let attributes = [...state.attributes, action.payload.id];
	let attributesById = { ...state.attributesById, [action.payload.id]: action.payload };
	return { ...state, attributes, attributesById };
};

const addDocumentReducer = (state, action) => {
	let documents = [...state.documents, action.payload.id];
	let documentsById = { ...state.documentsById, [action.payload.id]: action.payload };
	return { ...state, documents, documentsById };
};

const updateIdAttributeReducer = (state, action) => {
	if (!state.attributes.includes(action.payload.id)) return state;
	let attributesById = {
		...state.attributesById,
		[action.payload.id]: {
			...state.attributesById[action.payload.id],
			...action.payload
		}
	};
	return { ...state, attributesById };
};

const updateDocumentReducer = (state, action) => {
	if (!state.documents.includes(action.payload.id)) return state;
	let documentsById = {
		...state.documentsById,
		[action.payload.id]: {
			...state.documentsById[action.payload.id],
			...action.payload
		}
	};
	return { ...state, documentsById };
};

const deleteDocumentReducer = (state, action) => {
	if (!state.documents.includes(action.payload)) return state;
	let documents = state.documents.filter(id => id !== action.payload);
	let documentsById = { ...state.documentsById };
	delete documentsById[action.payload];
	return { ...state, documentsById, documents };
};

const deleteIdAttributeReducer = (state, action) => {
	if (!state.attributes.includes(action.payload)) return state;
	let attributes = state.attributes.filter(id => id !== action.payload);
	let attributesById = { ...state.attributesById };
	delete attributesById[action.payload];
	return { ...state, attributesById, attributes };
};

const identityReducers = {
	setRepositoriesReducer,
	setIdAttributeTypesReducer,
	setUiSchemasReducer,
	setDocumentsReducer,
	deleteDocumentsReducer,
	setIdAttributesReducer,
	deleteIdAttributesReducer,
	setAttributeDocumentsReducer,
	deleteAttributeDocumentsReducer,
	addIdAttributeReducer,
	addDocumentReducer,
	updateIdAttributeReducer,
	updateDocumentReducer,
	deleteDocumentReducer,
	deleteIdAttributeReducer
};

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

const identitySelectors = {
	selectIdentity,
	selectRepositories,
	selectExpiredRepositories,
	selectIdAttributeTypes,
	selectExpiredIdAttributeTypes,
	selectUiSchemas,
	selectExpiredUiSchemas,
	selectDocuments,
	selectIdAttributes
};

export const testExports = { operations };

export { identitySelectors, identityReducers, identityActions, identityOperations };

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case identityTypes.IDENTITY_REPOSITORIES_SET:
			return identityReducers.setRepositoriesReducer(state, action);
		case identityTypes.IDENTITY_ID_ATTRIBUTE_TYPES_SET:
			return identityReducers.setIdAttributeTypesReducer(state, action);
		case identityTypes.IDENTITY_UI_SCHEMAS_SET:
			return identityReducers.setUiSchemasReducer(state, action);
		case identityTypes.IDENTITY_DOCUMENTS_SET:
			return identityReducers.setDocumentsReducer(state, action);
		case identityTypes.IDENTITY_DOCUMENTS_DELETE:
			return identityReducers.deleteDocumentsReducer(state, action);
		case identityTypes.IDENTITY_ATTRIBUTES_SET:
			return identityReducers.setIdAttributesReducer(state, action);
		case identityTypes.IDENTITY_ATTRIBUTES_DELETE:
			return identityReducers.deleteIdAttributesReducer(state, action);
		case identityTypes.IDENTITY_ATTRIBUTE_DOCUMENTS_SET:
			return identityReducers.setAttributeDocumentsReducer(state, action);
		case identityTypes.IDENTITY_ATTRIBUTE_DOCUMENTS_DELETE:
			return identityReducers.deleteAttributeDocumentsReducer(state, action);
		case identityTypes.IDENTITY_ATTRIBUTE_ADD:
			return identityReducers.addIdAttributeReducer(state, action);
		case identityTypes.IDENTITY_DOCUMENT_ADD:
			return identityReducers.addDocumentReducer(state, action);
		case identityTypes.IDENTITY_ATTRIBUTE_UPDATE:
			return identityReducers.updateIdAttributeReducer(state, action);
		case identityTypes.IDENTITY_DOCUMENT_UPDATE:
			return identityReducers.updateDocumentReducer(state, action);
		case identityTypes.IDENTITY_DOCUMENT_DELETE:
			return identityReducers.deleteDocumentReducer(state, action);
		case identityTypes.IDENTITY_ATTRIBUTE_DELETE:
			return identityReducers.deleteIdAttributeReducer(state, action);
	}
	return state;
};

export default reducer;
