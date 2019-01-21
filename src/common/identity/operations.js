import { getGlobalContext } from '../context';
import { createAliasedAction } from 'electron-redux';
import identitySelectors from './selectors';
import identityActions from './actions';
import identityTypes from './types';

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
const unlockIdentityOperation = walletId => async (dispatch, getState) => {
	await operations.loadDocumentsOperation(walletId)(dispatch, getState);
	await operations.loadIdAttributesOperation(walletId)(dispatch, getState);
};

export const operations = {
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

export const identityOperations = {
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

export default identityOperations;
