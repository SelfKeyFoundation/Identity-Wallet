import { walletOperations, walletSelectors } from '../wallet';
import { getGlobalContext } from '../context';
import { createAliasedAction } from 'electron-redux';
import { push } from 'connected-react-router';
import identitySelectors from './selectors';
import identityActions from './actions';
import identityTypes from './types';

const loadCountriesOperation = () => async (dispatch, getState) => {
	const countryService = getGlobalContext().countryService;
	const countries = await countryService.getCountries();
	await dispatch(identityActions.setCountriesAction(countries));
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
	await dispatch(operations.loadRepositoriesOperation());
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
	await dispatch(operations.loadIdAttributeTypesOperation());
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
	await dispatch(operations.loadUiSchemasOperation());
};

const loadDocumentsOperation = identityId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let documents = await identityService.loadDocuments(identityId);
	documents = documents.map(doc => ({ ...doc, identityId }));
	await dispatch(identityActions.setDocumentsAction(identityId, documents));
};

const loadIdAttributesOperation = identityId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let attributes = await identityService.loadIdAttributes(identityId);
	await dispatch(identityActions.setIdAttributesAction(identityId, attributes));
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
	const identity = identitySelectors.selectCurrentIdentity(getState());
	const identityId = attribute.identityId || identity.id;
	attribute = { ...attribute, identityId };
	attribute = await identityService.createIdAttribute(attribute);
	await dispatch(operations.loadDocumentsForAttributeOperation(attribute.id));
	await dispatch(identityActions.addIdAttributeAction(attribute));
};

const removeIdAttributeOperation = attributeId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	await identityService.removeIdAttribute(attributeId);
	await dispatch(identityActions.deleteDocumentsForAttributeAction(attributeId));
	await dispatch(identityActions.deleteIdAttributeAction(attributeId));
};

const editIdAttributeOperation = attribute => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	await identityService.editIdAttribute(attribute);
	await dispatch(operations.loadDocumentsForAttributeOperation(attribute.id));
	await dispatch(identityActions.updateIdAttributeAction(attribute));
};

const updateProfilePictureOperation = (picture, identityId) => (dispatch, getState) => {
	// TODO max: move avatar handling to identity module
	return dispatch(walletOperations.updateWalletAvatar(picture, identityId));
};

const lockIdentityOperation = identityId => async (dispatch, getState) => {
	await dispatch(identityOperations.setCurrentIdentityAction(null));
	await dispatch(identityActions.deleteIdAttributesAction(identityId));
	await dispatch(identityActions.deleteDocumentsAction(identityId));
};
const unlockIdentityOperation = identityId => async (dispatch, getState) => {
	if (!identityId) {
		const identities = identitySelectors.selectAllIdentities(getState());
		const defaultIdentity =
			identities.find(ident => ident.default || ident.type === 'individual') || identities[0];

		if (defaultIdentity) {
			identityId = defaultIdentity.id;
		}
	}

	if (!identityId) {
		throw new Error('could not unlock identity');
	}
	await dispatch(identityOperations.loadDocumentsOperation(identityId));
	await dispatch(identityOperations.loadIdAttributesOperation(identityId));
	await dispatch(identityOperations.setCurrentIdentityAction(identityId));
};

const createIdentityOperation = (walletId, type) => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	const identity = await identityService.createIdentity(walletId, type);
	await dispatch(identityOperations.loadIdentitiesOperation(walletId));
	return identity;
};

const createCorporateProfileOperation = () => async (dispatch, getState) => {
	const wallet = walletSelectors.getWallet(getState());
	const identity = await dispatch(
		identityOperations.createIdentityOperation(wallet.id, 'corporate')
	);
	await dispatch(identityOperations.updateIdentitySetupOperation(true, identity.id));
	await dispatch(identityOperations.unlockIdentityOperation(identity.id));
	await dispatch(push('/main/dashboard'));
};

const createSelfkeyIdOperation = (identityId, data) => async (dispatch, getState) => {
	const idAttributeTypes = identitySelectors.selectIdAttributeTypes(getState(), 'individual');
	const identity = identitySelectors.selectIdentityById(getState(), identityId);
	const getTypeId = url => {
		return idAttributeTypes.find(idAttributeType => idAttributeType.url === url).id;
	};
	// TODO: XXX update to entity operations
	await dispatch(walletOperations.updateWalletName(data.nickName, identity.walletId));

	await dispatch(
		identityOperations.createIdAttributeOperation({
			typeId: getTypeId('http://platform.selfkey.org/schema/attribute/first-name.json'),
			name: 'First Name',
			data: { value: data.firstName }
		})
	);

	await dispatch(
		identityOperations.createIdAttributeOperation({
			typeId: getTypeId('http://platform.selfkey.org/schema/attribute/last-name.json'),
			name: 'Last Name',
			data: { value: data.lastName }
		})
	);

	await dispatch(
		identityOperations.createIdAttributeOperation({
			typeId: getTypeId('http://platform.selfkey.org/schema/attribute/email.json'),
			name: 'Email',
			data: { value: data.email }
		})
	);

	await dispatch(identityOperations.updateIdentitySetupOperation(true, identityId));

	await dispatch(push('/selfkeyIdCreateAbout'));
};

const updateIdentitySetupOperation = (isSetupFinished, id) => async (dispatch, getState) => {
	const identityService = getGlobalContext().identityService;
	const identity = await identityService.updateIdentitySetup(isSetupFinished, id);
	await dispatch(identityActions.updateIdentity(identity));
};

const loadIdentitiesOperation = walletId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let identities = await identityService.loadIdentities(walletId);
	await dispatch(identityActions.setIdentitiesAction(identities));
};

const updateDIDOperation = (did, id) => async (dispatch, getState) => {
	const identityService = getGlobalContext().identityService;
	const identity = await identityService.updateIdentityDID(did, id);
	await dispatch(identityActions.updateIdentity(identity));
};

const switchProfileOperation = identity => async (dispatch, getState) => {
	await dispatch(identityOperations.unlockIdentityOperation(identity.id));
};

export const operations = {
	loadCountriesOperation,
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
	lockIdentityOperation,
	updateProfilePictureOperation,
	createSelfkeyIdOperation,
	loadIdentitiesOperation,
	updateIdentitySetupOperation,
	updateDIDOperation,
	createIdentityOperation,
	createCorporateProfileOperation,
	switchProfileOperation
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
	editIdAttributeOperation: createAliasedAction(
		identityTypes.IDENTITY_ATTRIBUTE_EDIT,
		operations.editIdAttributeOperation
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
	),
	updateProfilePictureOperation: createAliasedAction(
		identityTypes.PROFILE_PICTURE_UPDATE,
		operations.updateProfilePictureOperation
	),
	loadCountriesOperation: createAliasedAction(
		identityTypes.IDENTITY_COUNTRIES_LOAD,
		operations.loadCountriesOperation
	),
	createSelfkeyIdOperation: createAliasedAction(
		identityTypes.IDENTITY_SELFKEY_ID_CREATE,
		operations.createSelfkeyIdOperation
	),
	loadIdentitiesOperation: createAliasedAction(
		identityTypes.IDENTITIES_LOAD,
		operations.loadIdentitiesOperation
	),
	updateIdentitySetupOperation: createAliasedAction(
		identityTypes.IDENTITIES_UPDATE_SETUP_OPERATION,
		operations.updateIdentitySetupOperation
	),
	updateDIDOperation: createAliasedAction(
		identityTypes.IDENTITIES_UPDATE_DID_OPERATION,
		operations.updateDIDOperation
	),
	createIdentityOperation: createAliasedAction(
		identityTypes.IDENTITIES_CREATE_OPERATION,
		operations.createIdentityOperation
	),
	createCorporateProfileOperation: createAliasedAction(
		identityTypes.IDENTITIES_CREATE_CORPORATE_PROFILE_OPERATION,
		operations.createCorporateProfileOperation
	),
	switchProfileOperation: createAliasedAction(
		identityTypes.IDENTITIES_SWITCH_PROFILE_OPERATION,
		operations.switchProfileOperation
	)
};

export default identityOperations;
