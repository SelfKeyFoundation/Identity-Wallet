import identityTypes from './types';
import _ from 'lodash';

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
	attributesById: {},
	countries: [],
	identities: [],
	identitiesById: {},
	currentIdentity: null
};

const setCountries = (state, action) => {
	return { ...state, countries: action.payload };
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
		.filter(doc => doc.identityId !== action.identityId);
	let documents = [...oldDocuments, ...(action.payload.documents || [])];
	let documentsById = documents.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	documents = _.uniq(documents.map(attr => attr.id));
	return { ...state, documents, documentsById };
};

const setAttributeDocumentsReducer = (state, action) => {
	let oldDocuments = state.documents
		.map(docId => state.documentsById[docId])
		.filter(doc => doc.attributeId !== action.payload.attributeId);
	let documents = [...oldDocuments, ...(action.payload.documents || [])];
	let documentsById = documents.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	documents = _.uniq(documents.map(attr => attr.id));
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
	documents = _.uniq(documents.map(attr => attr.id));
	return { ...state, documents, documentsById };
};

const deleteDocumentsReducer = (state, action) => {
	let documents = state.documents
		.map(docId => state.documentsById[docId])
		.filter(doc => doc.identityId !== action.payload);
	let documentsById = documents.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	documents = _.uniq(documents.map(attr => attr.id));
	return { ...state, documents, documentsById };
};

const setIdAttributesReducer = (state, action) => {
	let oldIdAttributes = state.attributes
		.map(attrId => state.attributesById[attrId])
		.filter(attr => attr.identityId !== action.payload.identityId);
	let attributes = [...oldIdAttributes, ...(action.payload.attributes || [])];
	let attributesById = attributes.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	attributes = _.uniq(attributes.map(attr => attr.id));
	return { ...state, attributes, attributesById };
};

const deleteIdAttributesReducer = (state, action) => {
	let attributes = state.attributes
		.map(attrId => state.attributesById[attrId])
		.filter(attr => attr.identityId !== action.payload);
	let attributesById = attributes.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	attributes = _.uniq(attributes.map(attr => attr.id));
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

const setIdentitiesReducer = (state, action) => {
	const identities = (action.payload || []).map(idnt => idnt.id);
	const identitiesById = (action.payload || []).reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});

	return { ...state, identities, identitiesById };
};

const addIdentityReducer = (state, action) => {
	const { identities, identitiesById } = state;

	if (identities.includes(action.payload.id)) {
		return state;
	}

	identities.push(action.payload.id);
	identitiesById[action.payload.id] = action.payload;

	return { ...state, identities, identitiesById };
};

const updateIdentityReducer = (state, action) => {
	const { identities, identitiesById } = state;

	if (!identities.includes(action.payload.id)) {
		return state;
	}
	identitiesById[action.payload.id] = { ...identitiesById[action.payload.id], ...action.payload };

	return { ...state, identities, identitiesById };
};

const setCurrentIdentityReducer = (state, action) => {
	return { ...state, currentIdentity: action.payload };
};

export const identityReducers = {
	setCountries,
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
	deleteIdAttributeReducer,
	setIdentitiesReducer,
	addIdentityReducer,
	updateIdentityReducer,
	setCurrentIdentityReducer
};

const reducer = (state = initialState, action) => {
	const { appTypes } = require('common/app');
	switch (action.type) {
		case identityTypes.IDENTITY_COUNTRIES_SET:
			return identityReducers.setCountries(state, action);
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
		case identityTypes.IDENTITIES_SET:
			return identityReducers.setIdentitiesReducer(state, action);
		case identityTypes.IDENTITY_ADD:
			return identityReducers.addIdentityReducer(state, action);
		case identityTypes.IDENTITY_UPDATE:
			return identityReducers.updateIdentityReducer(state, action);
		case identityTypes.IDENTITY_CURRENT_SET:
			return identityReducers.setCurrentIdentityReducer(state, action);
		case appTypes.APP_RESET:
			return {
				...initialState,
				..._.pick(state, [
					'repositories',
					'repositoriesById',
					'idAtrributeTypes',
					'idAtrributeTypesById',
					'uiSchemas',
					'uiSchemasById',
					'countries'
				])
			};
	}
	return state;
};

export default reducer;
