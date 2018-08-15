'use strict';
import fetch from 'node-fetch';
import { Logger } from 'common/logger';
import RefParser from 'json-schema-ref-parser';
import IdAttributeType from './id-attribute-type';
import { IdAttributeSchema } from './id-attribute-schema';

const log = new Logger('id-attribute-type-service');
const airtableBaseUrl = 'https://alpha.selfkey.org/marketplace/i/api/';
export const JSON_SCHEMA_EXPIRTION_TIME = 1000 * 60 * 60 * 5; // 5h
export const JSON_SCHEMA_URL = 'http://platform.selfkey.org/schema/attribute';
export class IdAttributeTypeService {
	async loadIdAttributeTypes() {
		const result = await fetch(`${airtableBaseUrl}id-attributes`);
		const response = await result.json();

		const idAttributeData = response.ID_Attributes.filter(attr => attr.data).map(
			attr => attr.data.fields
		);

		await IdAttributeType.import(idAttributeData);
	}
	async resolveSchemas() {
		let types = await IdAttributeType.findAll().eager('schema');
		await Promise.all(
			types.filter(t => !t.schema || !t.schema.hasExpired()).map(t => this.resolveSchema(t))
		);
	}
	async resolveSchema(type) {
		try {
			let jsonSchemaUrl = this.getSchemaUrl(type.key, type.schema);
			let jsonRes = await fetch(jsonSchemaUrl);
			if (jsonRes.status !== 200) {
				return;
			}
			let jsonSchema = await jsonRes.json();
			log.info('%2j', jsonSchema);
			jsonSchema = await RefParser.dereference(jsonSchema);
			let schema = {
				expires: Date.now() + JSON_SCHEMA_EXPIRTION_TIME,
				jsonSchema,
				type: type.key
			};
			if (type.schema) {
				return type.schema.$query().patch(schema);
			}
			return IdAttributeSchema.query().insertAndFetch(schema);
		} catch (error) {
			log.error(error);
		}
	}

	getSchemaUrl(type, schema) {
		if (schema && schema.jsonSchemaUrl) return schema.jsonSchemaUrl;
		return `${JSON_SCHEMA_URL}/${type.replace(/_/g, '-')}.json`;
	}
}

export default IdAttributeTypeService;
