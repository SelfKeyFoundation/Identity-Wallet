import Ajv from 'ajv';
import RefParser from 'json-schema-ref-parser';
import { Logger } from 'common/logger';
import { sleep } from '../utils/async';
import fetch from 'node-fetch';

const log = new Logger('identity-utils');

export const identityAttributes = {};

identityAttributes.denormalizeDocumentsSchema = (
	typeSchema,
	value,
	documents = [],
	maxDepth = 10
) => {
	if (maxDepth < 0) {
		return { value, documents };
	}

	documents = [...documents];
	if (typeSchema.format === 'file') {
		if (!value || typeof value !== 'string') return { value, documents };
		const refIdRegexp = /#ref{(document[0-9]+).id}$/;
		const idRegexp = /\$document-([0-9]+)$/;

		let id = value.match(refIdRegexp);
		if (!id) id = value.match(idRegexp);
		if (id && id.length) {
			id = id[1];
		}
		if (!id) return { value: null, documents };
		let found = documents.filter(doc => doc.id === +id || doc['#id'] === id);
		let filtered = documents.filter(doc => doc.id !== +id && doc['#id'] !== id);

		value = null;

		if (found.length) {
			value = found[0];
			delete value['#id'];
		}

		return { value, documents: filtered };
	}

	if (typeSchema.type === 'object' && typeof value === 'object') {
		if (!typeSchema.properties) return { value, documents };
		return Object.keys(typeSchema.properties).reduce(
			(acc, key) => {
				if (!value.hasOwnProperty(key)) {
					return acc;
				}
				let denormalized = identityAttributes.denormalizeDocumentsSchema(
					typeSchema.properties[key],
					value[key],
					acc.documents,
					maxDepth - 1
				);
				acc.value[key] = denormalized.value;
				acc.documents = denormalized.documents;
				return acc;
			},
			{ value: {}, documents }
		);
	}

	if (typeSchema.type === 'array' && Array.isArray(value)) {
		return value.reduce(
			(acc, itm) => {
				let normalized = identityAttributes.denormalizeDocumentsSchema(
					typeSchema.items,
					itm,
					acc.documents,
					maxDepth - 1
				);
				acc.value.push(normalized.value);
				acc.documents = normalized.documents;
				return acc;
			},
			{ value: [], documents }
		);
	}
	return { value, documents };
};

identityAttributes.normalizeDocumentsSchema = (
	typeSchema,
	value,
	documents = [],
	maxDepth = 10
) => {
	if (maxDepth < 0) {
		return { value, documents };
	}
	documents = [...documents];
	if (typeSchema.format === 'file') {
		if (!value || typeof value !== 'object' || Object.keys(value).length === 0)
			return { value, documents };
		let id = value.id;

		if (id) {
			documents = documents.filter(doc => doc.id !== id);
			documents.push(value);
			value = `$document-${id}`;
		} else {
			id = documents.length;
			documents.push({ ...value, '#id': `document${id}` });
			value = `$document-#ref{document${id}.id}`;
		}

		return { value, documents };
	}

	if (typeSchema.type === 'object' && typeof value === 'object') {
		if (!typeSchema.properties) return { value, documents };
		return Object.keys(typeSchema.properties).reduce(
			(acc, key) => {
				if (!value.hasOwnProperty(key)) {
					return acc;
				}
				let normalized = identityAttributes.normalizeDocumentsSchema(
					typeSchema.properties[key],
					value[key],
					acc.documents,
					maxDepth - 1
				);
				acc.value[key] = normalized.value;
				acc.documents = normalized.documents;
				return acc;
			},
			{ value: {}, documents }
		);
	}

	if (typeSchema.type === 'array' && Array.isArray(value)) {
		return value.reduce(
			(acc, itm) => {
				let normalized = identityAttributes.normalizeDocumentsSchema(
					typeSchema.items,
					itm,
					acc.documents,
					maxDepth - 1
				);
				acc.value.push(normalized.value);
				acc.documents = normalized.documents;
				return acc;
			},
			{ value: [], documents }
		);
	}

	return { value, documents };
};

identityAttributes.validate = (schema, attribute, documents) => {
	try {
		const denormalized = identityAttributes.denormalizeDocumentsSchema(
			schema,
			attribute,
			documents
		);
		return jsonSchema.validate(schema, denormalized.value);
	} catch (error) {
		log.error(error);
		return false;
	}
};

identityAttributes.getDocumentsErrors = documents => {
	if (!documents) {
		return;
	}

	const invalidDoc = documents.find(d => d.size === 0);

	if (invalidDoc) {
		return `The file ${invalidDoc.name} is empty, please provide a valid one.`;
	}
};

export const jsonSchema = {};

jsonSchema.containsFile = (schema, maxDepth = 10) => {
	if (maxDepth < 0) {
		return false;
	}
	if (schema.format === 'file') return true;

	if (schema.type === 'object') {
		if (!schema.properties) return false;
		for (let key in schema.properties) {
			if (!schema.properties.hasOwnProperty(key)) continue;
			if (jsonSchema.containsFile(schema.properties[key], maxDepth - 1)) return true;
		}
		return false;
	}
	if (schema.type === 'array') {
		return jsonSchema.containsFile(schema.items, maxDepth - 1);
	}
	return false;
};

jsonSchema.removeMeta = (schema, maxDepth = 10) => {
	if (maxDepth < 0) {
		return schema;
	}
	schema = { ...schema };
	delete schema['$id'];
	delete schema['$schema'];

	if (schema.type === 'object' && schema.properties) {
		schema.properties = { ...schema.properties };
		for (let key in schema.properties) {
			if (!schema.properties.hasOwnProperty(key)) continue;
			schema.properties[key] = jsonSchema.removeMeta(schema.properties[key], maxDepth - 1);
		}
	}
	if (schema.type === 'array') {
		schema.items = jsonSchema.removeMeta(schema.items, maxDepth - 1);
	}
	return schema;
};

jsonSchema.loadRemoteSchema = async (url, options, attempt = 1) => {
	if (options.env === 'development') {
		url = url.replace('/schema/', '/dev-schema/');
	}
	try {
		let res = await fetch(url);
		if (res.status >= 400) {
			throw new Error('Failed to fetch schema from remote');
		}
		return await res.json();
	} catch (error) {
		log.error('Load schema %s attempt %d error, %s', url, attempt, error);
		if (attempt <= 3) {
			await sleep(attempt * 200);
			return jsonSchema.loadRemoteSchema(url, options, attempt + 1);
		}
		throw error;
	}
};

jsonSchema.dereference = (schema, options) => {
	const resolver = {
		order: 1,
		canRead: /platform\.selfkey\.org/i,
		async read(file) {
			return jsonSchema.loadRemoteSchema(file, options);
		}
	};
	return RefParser.dereference(schema, { resolve: { selfkey: resolver } });
};

jsonSchema.getDefaultRepo = (schema, options) => {
	if (!schema.identityAttributeRepository) {
		return null;
	}
	return options.env === 'development'
		? schema.identityAttributeRepository.replace('/repository.json', '/dev-repository.json')
		: schema.identityAttributeRepository;
};

jsonSchema.loadRemoteRepository = async (url, options, attempt = 1) => {
	if (options.env === 'development') {
		url = url.replace('/repository.json', '/dev-repository.json');
	}
	try {
		let res = await fetch(url);
		if (res.status >= 400) {
			throw new Error('Failed to fetch repository from remote');
		}
		return await res.json();
	} catch (error) {
		log.error('Load repository %s attempt %d error, %s', url, attempt, error);
		if (attempt <= 3) {
			await sleep(attempt * 200);
			return jsonSchema.loadRemoteRepository(url, options, attempt + 1);
		}
		throw error;
	}
};

jsonSchema.validate = (schema, value) => {
	const ajv = new Ajv({ validateSchema: true, allErrors: true });
	ajv.addFormat('file', () => {});
	schema = jsonSchema.removeMeta(schema);
	if (!ajv.validateSchema(schema)) return false;
	const ret = ajv.validate(schema, value);
	if (!ret) {
		log.error('validation error %2j', ajv.errors);
	}
	return ret;
};

export default { identityAttributes, jsonSchema };
