import _ from 'lodash';
import { createAliasedAction } from 'electron-redux';
import { push } from 'connected-react-router';
import { Logger } from 'common/logger';
import { walletOperations, walletSelectors } from '../wallet';
import { getGlobalContext } from '../context';
import { identitySelectors } from './index';
import identityActions from './actions';
import identityTypes from './types';
import {
	ENTITY_NAME_ATTRIBUTE,
	ENTITY_TYPE_ATTRIBUTE,
	JURISDICTION_ATTRIBUTE,
	CREATION_DATE_ATTRIBUTE,
	EMAIL_ATTRIBUTE,
	TAX_ID_ATTRIBUTE,
	FIRST_NAME_ATTRIBUTE,
	LAST_NAME_ATTRIBUTE,
	individualMemberAttributes,
	corporateMemberAttributes
} from './constants';

const log = new Logger('identity-operations');

// Countries

const loadCountriesOperation = () => async (dispatch, getState) => {
	const countryService = getGlobalContext().countryService;
	const countries = await countryService.getCountries();
	await dispatch(identityActions.setCountriesAction(countries));
};

// Repositories

const loadRepositoriesOperation = () => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let repos = await identityService.loadRepositories();
	await dispatch(identityActions.setRepositoriesAction(repos));
	log.debug('Repositories loaded %2j', repos.map(r => r.url));
};

const updateExpiredRepositoriesOperation = () => async (dispatch, getState) => {
	let expired = identitySelectors.selectExpiredRepositories(getState());
	log.debug('Detected expired repositories %2j', expired.map(e => e.url));
	const identityService = getGlobalContext().identityService;
	await identityService.updateRepositories(expired);
	await dispatch(operations.loadRepositoriesOperation());
};

// Attribute Types

const loadIdAttributeTypesOperation = () => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let attributeTypes = await identityService.loadIdAttributeTypes();
	await dispatch(identityActions.setIdAttributeTypesAction(attributeTypes));
	log.debug('Identity attribute types loaded %2j', attributeTypes.map(t => t.url));
};

const updateExpiredIdAttributeTypesOperation = () => async (dispatch, getState) => {
	let expired = identitySelectors.selectExpiredIdAttributeTypes(getState());
	log.debug('Detected expired identity attribute types %2j', expired.map(e => e.url));
	const identityService = getGlobalContext().identityService;
	await identityService.updateIdAttributeTypes(expired);
	await dispatch(operations.loadIdAttributeTypesOperation());
};

// UI Schema

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

// Documents

const loadDocumentsOperation = identityId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let documents = await identityService.loadDocuments(identityId);
	documents = documents.map(doc => ({ ...doc, identityId }));
	await dispatch(identityActions.setDocumentsAction(identityId, documents));
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

// Id attributes

const loadIdAttributesOperation = identityId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let attributes = await identityService.loadIdAttributes(identityId);
	await dispatch(identityActions.setIdAttributesAction(identityId, attributes));
};

const createIdAttributeOperation = (attribute, identityId) => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let identity = null;

	if (identityId) {
		identity = identitySelectors.selectIdentity(getState(), { identityId });
		if (!identity) {
			throw new Error('identity not loaded');
		}
	} else {
		identity = identitySelectors.selectIdentity(getState());
		identityId = identity.id;
	}

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

// Identity

const updateProfilePictureOperation = (picture, identityId) => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let identity = await identityService.updateIdentityProfilePicture(picture, identityId);
	await dispatch(identityActions.updateIdentity(identity));
};

const lockIdentityOperation = identityId => async (dispatch, getState) => {
	let identity = null;
	if (identityId) {
		identity = identitySelectors.selectIdentity(getState(), { identityId });
	} else {
		identity = identitySelectors.selectCurrentIdentity(getState());
	}
	if (!identity) {
		return;
	}
	if (identity.rootIdentity) {
		await dispatch(identityOperations.setCurrentIdentityAction(null));
	}
	identityId = identity.id;
	await dispatch(identityActions.deleteIdAttributesAction(identityId));
	await dispatch(identityActions.deleteDocumentsAction(identityId));
	if (!identity.rootIdentity) {
		return;
	}
	const members = identitySelectors.selectMemberIdentities(getState(), {
		identityId: identity.id
	});
	await Promise.all(members.map(m => dispatch(identityOperations.lockIdentityOperation(m.id))));
};
const unlockIdentityOperation = identityId => async (dispatch, getState) => {
	const state = getState();
	if (!identityId) {
		const currentIdentity = identitySelectors.selectIdentity(state);
		if (currentIdentity) {
			identityId = currentIdentity.id;
		}
	}

	if (!identityId) {
		const identities = identitySelectors.selectIdentities(state);
		const defaultIdentity =
			identities.find(ident => ident.default || ident.type === 'individual') || identities[0];

		if (defaultIdentity) {
			identityId = defaultIdentity.id;
		}
	}

	if (!identityId) {
		throw new Error('could not unlock identity');
	}
	const identity = identitySelectors.selectIdentity(state, { identityId });
	if (!identity) {
		return;
	}
	await dispatch(identityOperations.loadDocumentsOperation(identityId));
	await dispatch(identityOperations.loadIdAttributesOperation(identityId));
	if (!identity.rootIdentity) {
		return;
	}
	const members = identitySelectors.selectMemberIdentities(state, {
		identityId
	});
	await Promise.all(members.map(m => dispatch(identityOperations.unlockIdentityOperation(m.id))));
	await dispatch(identityOperations.setCurrentIdentityAction(identityId));
};

const createIdentityOperation = identity => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	const newIdentity = await identityService.createIdentity(identity);
	await dispatch(identityOperations.loadIdentitiesOperation(newIdentity.walletId));
	return newIdentity;
};

const updateIdentityOperation = identity => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	const updatedIdentity = await identityService.updateIdentity(identity);
	await dispatch(identityOperations.loadIdentitiesOperation(updatedIdentity.walletId));
	return updatedIdentity;
};

const deleteIdentityOperation = identityId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	const updatedIdentity = await identityService.deleteIdentity(identityId);
	await dispatch(identityOperations.loadIdentitiesOperation(updatedIdentity.walletId));
	await dispatch(identityOperations.unlockIdentityOperation());
	return updatedIdentity;
};

const updateIdentitySetupOperation = (isSetupFinished, id) => async (dispatch, getState) => {
	const identityService = getGlobalContext().identityService;
	const identity = await identityService.updateIdentitySetup(isSetupFinished, id);
	await dispatch(identityActions.updateIdentity(identity));
};

const updateIdentityNameOperation = (name, id) => async (dispatch, getState) => {
	const identityService = getGlobalContext().identityService;
	const identity = await identityService.updateIdentityName(name, id);
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

// Profile

const createCorporateProfileOperation = data => async (dispatch, getState) => {
	const wallet = walletSelectors.getWallet(getState());
	let identity = null;
	if (data.identityId) {
		identity = identitySelectors.selectIdentity(getState(), {
			identityId: data.identityId
		});
	}
	const idAttributeTypes = identitySelectors.selectAttributeTypesFiltered(getState(), {
		entityType: 'corporate'
	});
	if (!identity) {
		identity = await dispatch(
			identityOperations.createIdentityOperation({ walletId: wallet.id, type: 'corporate' })
		);
		await dispatch(identityOperations.setCurrentIdentityAction(identity.id));
	}
	const getTypeId = url => {
		return idAttributeTypes.find(idAttributeType => idAttributeType.url === url).id;
	};
	await dispatch(identityOperations.updateIdentityNameOperation(data.entityName, identity.id));
	try {
		await dispatch(
			identityOperations.createIdAttributeOperation({
				typeId: getTypeId(ENTITY_NAME_ATTRIBUTE),
				name: 'Legal Entity Name',
				data: { value: data.entityName }
			})
		);

		await dispatch(
			identityOperations.createIdAttributeOperation({
				typeId: getTypeId(ENTITY_TYPE_ATTRIBUTE),
				name: 'Legal Entity Type',
				data: { value: data.entityType }
			})
		);

		await dispatch(
			identityOperations.createIdAttributeOperation({
				typeId: getTypeId(JURISDICTION_ATTRIBUTE),
				name: 'Legal Jurisdiction',
				data: { value: data.jurisdiction }
			})
		);

		await dispatch(
			identityOperations.createIdAttributeOperation({
				typeId: getTypeId(CREATION_DATE_ATTRIBUTE),
				name: 'Incorporation Date',
				data: { value: data.creationDate }
			})
		);

		if (data.email) {
			await dispatch(
				identityOperations.createIdAttributeOperation({
					typeId: getTypeId(EMAIL_ATTRIBUTE),
					name: 'Email',
					data: { value: data.email }
				})
			);
		}

		if (data.taxId) {
			await dispatch(
				identityOperations.createIdAttributeOperation({
					typeId: getTypeId(TAX_ID_ATTRIBUTE),
					name: 'Tax Id',
					data: { value: data.taxId }
				})
			);
		}

		await dispatch(identityOperations.updateIdentitySetupOperation(true, identity.id));
		await dispatch(identityOperations.unlockIdentityOperation(identity.id));
		await dispatch(push('/main/corporate'));
	} catch (error) {
		log.error('failed to create corporate identity %s', error);
	}
};

const createMemberProfileOperation = data => async (dispatch, getState) => {
	const identity = _.pick(data, [
		'name',
		'type',
		'walletId',
		'profilePicture',
		'did',
		'positions',
		'equity',
		'parentId'
	]);
	if (!identity.walletId) {
		const wallet = walletSelectors.getWallet(getState());
		identity.walletId = wallet.id;
	}

	if (!identity.parentId) {
		const currentIdentity = identitySelectors.selectIdentity(getState());
		identity.parentId = currentIdentity.id;
	}

	identity.rootIdentity = false;

	const member = await dispatch(identityOperations.createIdentityOperation(identity));
	const idAttributeTypes = identitySelectors.selectAttributeTypesFiltered(getState(), {
		entityType: member.type
	});
	const getTypeId = url => {
		return idAttributeTypes.find(idAttributeType => idAttributeType.url === url).id;
	};
	const attributes =
		member.type === 'individual' ? individualMemberAttributes : corporateMemberAttributes;

	for (const attr of attributes) {
		const value = data[attr.key];

		if (!value && attr.required) {
			throw new Error(`Attribute ${attr.name} is required`);
		}

		if (!value && !attr.required) {
			continue;
		}

		try {
			await dispatch(
				identityOperations.createIdAttributeOperation(
					{
						typeId: getTypeId(attr.type),
						name: attr.name,
						data: { value }
					},
					member.id
				)
			);
		} catch (error) {
			log.error('failed to create attribute %s', attr.type);
			if (attr.required) {
				throw new Error(`failed to create attribute ${attr.type}`);
			}
		}
	}
	await dispatch(identityOperations.updateIdentitySetupOperation(true, member.id));
};

const updateMemberProfileOperation = (data, identityId) => async (dispatch, getState) => {
	const update = _.pick(data, [
		'name',
		'profilePicture',
		'did',
		'positions',
		'equity',
		'parentId'
	]);

	update.id = identityId;

	const identity = await dispatch(identityOperations.updateIdentityOperation(update));

	const attributeList =
		identity.type === 'individual' ? individualMemberAttributes : corporateMemberAttributes;

	const attributes = identitySelectors.selectIdAttributes(getState(), { identityId });
	/* const attributes = identitySelectors.selectAttributeTypesFiltered(getState(), {
		entityType: identity.type
	}); */
	const updatedAttributes = attributeList.map(attr => {
		const attribute = attributes.find(a => a.type === attr.type) || {};
		attr = { ...attr };
		attr.id = attribute.id;
		attr.value = data[attr.key];
		return attr;
	});
	const idAttributeTypes = identitySelectors.selectAttributeTypesFiltered(getState(), {
		entityType: identity.type
	});
	const getTypeId = url => {
		return idAttributeTypes.find(idAttributeType => idAttributeType.url === url).id;
	};

	for (const attr of updatedAttributes) {
		const value = attr.value || '';
		try {
			if (!attr.id) {
				await dispatch(
					identityOperations.createIdAttributeOperation(
						{
							typeId: getTypeId(attr.type),
							name: attr.name,
							data: { value }
						},
						identityId
					)
				);
			} else {
				await dispatch(
					identityOperations.editIdAttributeOperation({
						id: attr.id,
						data: { value }
					})
				);
			}
		} catch (error) {
			log.error('failed to update attribute %s - %s', attr.type, error);
		}
	}
	await dispatch(identityOperations.updateIdentitySetupOperation(true, identityId));
};

const createIndividualProfile = (identityId, data) => async (dispatch, getState) => {
	const idAttributeTypes = identitySelectors.selectAttributeTypesFiltered(getState(), {
		entityType: 'individual'
	});
	const identity = identitySelectors.selectIdentity(getState(), { identityId });
	const getTypeId = url => {
		return idAttributeTypes.find(idAttributeType => idAttributeType.url === url).id;
	};
	// TODO: XXX update to entity operations
	await dispatch(walletOperations.updateWalletName(data.nickName, identity.walletId));

	await dispatch(
		identityOperations.createIdAttributeOperation({
			typeId: getTypeId(FIRST_NAME_ATTRIBUTE),
			name: 'First Name',
			data: { value: data.firstName }
		})
	);

	await dispatch(
		identityOperations.createIdAttributeOperation({
			typeId: getTypeId(LAST_NAME_ATTRIBUTE),
			name: 'Last Name',
			data: { value: data.lastName }
		})
	);

	await dispatch(
		identityOperations.createIdAttributeOperation({
			typeId: getTypeId(EMAIL_ATTRIBUTE),
			name: 'Email',
			data: { value: data.email }
		})
	);

	await dispatch(identityOperations.updateIdentitySetupOperation(true, identityId));

	await dispatch(push('/selfkeyIdCreateAbout'));
};

const switchProfileOperation = identity => async (dispatch, getState) => {
	await dispatch(identityOperations.unlockIdentityOperation(identity.id));
};

const navigateToProfileOperation = () => async (dispatch, getState) => {
	const identity = identitySelectors.selectIdentity(getState());

	if (identity.type === 'individual' && !identity.isSetupFinished) {
		return dispatch(push('/selfkeyIdCreate'));
	}

	if (identity.type === 'individual') {
		return dispatch(push('/main/selfkeyId'));
	}

	if (identity.isSetupFinished) {
		return dispatch(push('/main/corporate'));
	}
	return dispatch(push(`/main/corporate/setup-corporate-profile/${identity.id}`));
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
	createIndividualProfile,
	loadIdentitiesOperation,
	updateIdentitySetupOperation,
	updateDIDOperation,
	createIdentityOperation,
	createCorporateProfileOperation,
	switchProfileOperation,
	navigateToProfileOperation,
	updateIdentityNameOperation,
	createMemberProfileOperation,
	updateMemberProfileOperation,
	updateIdentityOperation,
	deleteIdentityOperation
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
	createIndividualProfile: createAliasedAction(
		identityTypes.IDENTITY_SELFKEY_ID_CREATE,
		operations.createIndividualProfile
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
	),
	navigateToProfileOperation: createAliasedAction(
		identityTypes.IDENTITIES_NAVIGATE_TO_PROFILE_OPERATION,
		operations.navigateToProfileOperation
	),
	updateIdentityNameOperation: createAliasedAction(
		identityTypes.IDENTITIES_UPDATE_NAME_OPERATION,
		operations.updateIdentityNameOperation
	),
	createMemberProfileOperation: createAliasedAction(
		identityTypes.IDENTITIES_CREATE_MEMBER_PROFILE_OPERATION,
		operations.createMemberProfileOperation
	),
	updateMemberProfileOperation: createAliasedAction(
		identityTypes.IDENTITIES_UPDATE_MEMBER_PROFILE_OPERATION,
		operations.updateMemberProfileOperation
	),
	updateIdentityOperation: createAliasedAction(
		identityTypes.IDENTITIES_UPDATE_OPERATION,
		operations.updateIdentityOperation
	),
	deleteIdentityOperation: createAliasedAction(
		identityTypes.IDENTITIES_DELETE_OPERATION,
		operations.deleteIdentityOperation
	)
};

export default identityOperations;
