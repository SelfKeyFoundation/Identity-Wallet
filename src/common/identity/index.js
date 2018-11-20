import { getGlobalContext } from '../context';
import { createAliasedAction } from 'electron-redux';

export const initialState = {
	repositories: [],
	repositoriesById: {},
	idAtrributeTypes: [],
	idAtrributeTypesById: {},
	uiSchemas: [],
	uiSchemasById: {},
	documents: [],
	documentsById: {}
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
	IDENTITY_DOCUMENTS_SET: 'identity/documents/SET'
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
	await dispatch(identityActions.setDocumentsAction(documents));
};

const operations = {
	loadRepositoriesOperation,
	updateExpiredRepositoriesOperation,
	loadIdAttributeTypesOperation,
	updateExpiredIdAttributeTypesOperation,
	loadUiSchemasOperation,
	updateExpiredUiSchemasOperation,
	loadDocumentsOperation
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
		loadDocumentsOperation
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

const identityReducers = {
	setRepositoriesReducer,
	setIdAttributeTypesReducer,
	setUiSchemasReducer,
	setDocumentsReducer
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

const identitySelectors = {
	selectIdentity,
	selectRepositories,
	selectExpiredRepositories,
	selectIdAttributeTypes,
	selectExpiredIdAttributeTypes,
	selectUiSchemas,
	selectExpiredUiSchemas,
	selectDocuments
};

export const testExports = { operations };

export { identitySelectors, identityReducers, identityActions, identityOperations };
