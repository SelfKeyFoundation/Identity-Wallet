import platform from '../../main/assets/data/selfkey-platform.json';
import { identityAttributes, jsonSchema } from './utils';
const findAttributeType = id => {
	let attrs = platform.jsonSchemas.filter(attr => attr['$id'] === id);

	if (!attrs.length) return null;
	return attrs[0];
};

describe('Identity uitls', () => {
	describe('Identity Attributes', () => {
		describe('denormilizeDocumentsSchema', () => {
			it('should do nothing if attribute has no documnents', () => {
				let value = {
					image: null
				};
				let documents = [];
				let attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/tax-certificate.json'
				);

				expect(
					identityAttributes.denormalizeDocumentsSchema(attrTypeSchema, value, documents)
				).toEqual({ value, documents });
			});
			it('should do nothing if documents are denormalized', () => {
				let value = {
					image: {
						content: 'abc'
					}
				};
				let documents = [];

				let attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/tax-certificate.json'
				);

				expect(
					identityAttributes.denormalizeDocumentsSchema(attrTypeSchema, value, documents)
				).toEqual({
					value,
					documents
				});

				value = {
					image: {
						id: 15,
						content: 'abc'
					}
				};

				documents = [];

				expect(
					identityAttributes.denormalizeDocumentsSchema(attrTypeSchema, value, documents)
				).toEqual({ value, documents });
			});
			it('should denormalize attr if there are documents', () => {
				let value = {
					image: '$document-1'
				};
				let documents = [
					{
						id: 1,
						content: 'abc'
					}
				];
				let attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/tax-certificate.json'
				);

				expect(
					identityAttributes.denormalizeDocumentsSchema(attrTypeSchema, value, documents)
				).toEqual({
					value: {
						image: {
							id: 1,
							content: 'abc'
						}
					},
					documents: []
				});
				value = {
					image: '$document-#ref{document1.id}'
				};
				documents = [
					{
						'#id': 'document1',
						content: 'abc'
					}
				];

				expect(
					identityAttributes.denormalizeDocumentsSchema(attrTypeSchema, value, documents)
				).toEqual({
					value: {
						image: {
							content: 'abc'
						}
					},
					documents: []
				});
			});
			it('should normalize arrays of documents', () => {
				let attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/national-id.json'
				);
				let value = {
					front: '$document-15',
					back: '$document-17',
					extra: ['$document-#ref{document0.id}', '$document-#ref{document1.id}']
				};
				let documents = [
					{
						id: 15,
						content: 'abc'
					},
					{
						id: 17,
						content: 'abc2'
					},
					{
						'#id': 'document0',
						content: 'abc3'
					},
					{
						'#id': 'document1',
						content: 'abc4'
					}
				];

				expect(
					identityAttributes.denormalizeDocumentsSchema(attrTypeSchema, value, documents)
				).toEqual({
					value: {
						front: {
							id: 15,
							content: 'abc'
						},
						back: {
							id: 17,
							content: 'abc2'
						},
						extra: [
							{
								content: 'abc3'
							},
							{
								content: 'abc4'
							}
						]
					},
					documents: []
				});
			});
		});

		describe('normalizeDocumentsSchema', () => {
			it('should do nothing if attribute has no documnents', () => {
				let value = {
					image: null
				};
				let documents = [];
				let attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/tax-certificate.json'
				);

				expect(
					identityAttributes.normalizeDocumentsSchema(attrTypeSchema, value, documents)
				).toEqual({ value, documents });
			});
			it('should do nothing if documents are normalized', () => {
				let value = {
					image: '$document-#ref{document1.id}'
				};
				let documents = [
					{
						'#id': 'document1',
						content: 'abc'
					}
				];

				let attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/tax-certificate.json'
				);

				expect(
					identityAttributes.normalizeDocumentsSchema(attrTypeSchema, value, documents)
				).toEqual({
					value,
					documents
				});

				value = {
					image: '$document-15'
				};

				documents = [
					{
						id: 15,
						content: 'abc'
					}
				];

				expect(
					identityAttributes.normalizeDocumentsSchema(attrTypeSchema, value, documents)
				).toEqual({ value, documents });
			});
			it('should do nothing if documents are normalized', () => {
				let value = {
					image: '$document-#ref{document1.id}'
				};
				let documents = [
					{
						'#id': 'document1',
						content: 'abc'
					}
				];
				let attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/tax-certificate.json'
				);

				expect(
					identityAttributes.normalizeDocumentsSchema(attrTypeSchema, value, documents)
				).toEqual({ value, documents });

				value = {
					image: '$document-15'
				};

				documents = [
					{
						id: 15,
						content: 'abc'
					}
				];

				expect(
					identityAttributes.normalizeDocumentsSchema(attrTypeSchema, value, documents)
				).toEqual({ value, documents });
			});
			it('should normalize attr if there are documents', () => {
				let value = {
					image: {
						content: 'abc'
					}
				};
				let documents = [];
				let attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/tax-certificate.json'
				);

				expect(
					identityAttributes.normalizeDocumentsSchema(attrTypeSchema, value, documents)
				).toEqual({
					value: {
						image: '$document-#ref{document0.id}'
					},
					documents: [
						{
							'#id': 'document0',
							content: 'abc'
						}
					]
				});
				value = {
					image: {
						id: 15,
						content: 'abc'
					}
				};
				documents = [];

				expect(
					identityAttributes.normalizeDocumentsSchema(attrTypeSchema, value, documents)
				).toEqual({
					value: {
						image: '$document-15'
					},
					documents: [
						{
							id: 15,
							content: 'abc'
						}
					]
				});
			});
			it('should normalize arrays of documents', () => {
				let attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/national-id.json'
				);
				let value = {
					front: {
						id: 15,
						content: 'abc'
					},
					back: {
						id: 17,
						content: 'abc2'
					},
					extra: [
						{
							content: 'abc3'
						},
						{
							content: 'abc4'
						}
					]
				};
				let documents = [];

				expect(
					identityAttributes.normalizeDocumentsSchema(attrTypeSchema, value, documents)
				).toEqual({
					value: {
						front: '$document-15',
						back: '$document-17',
						extra: ['$document-#ref{document2.id}', '$document-#ref{document3.id}']
					},
					documents: [
						{
							id: 15,
							content: 'abc'
						},
						{
							id: 17,
							content: 'abc2'
						},
						{
							'#id': 'document2',
							content: 'abc3'
						},
						{
							'#id': 'document3',
							content: 'abc4'
						}
					]
				});
			});
		});
		describe('validate id attributes', () => {
			it('should succeed when schema and data are valid', () => {
				const attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/email.json'
				);
				const email = 'support@selfkey.org';
				expect(identityAttributes.validate(attrTypeSchema, email)).toBe(true);
			});
			it('should validate file attributes', () => {
				const attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/tax-certificate.json'
				);
				const cert = {
					image: {
						size: 16,
						mimeType: 'image/jpeg',
						content: 'test content'
					},
					issued: '2017-01-02'
				};
				expect(identityAttributes.validate(attrTypeSchema, cert)).toBe(true);
			});
			it('should validate normalized attributes', () => {
				const attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/tax-certificate.json'
				);
				const cert = {
					image: '$document-1',
					issued: '2017-01-02'
				};
				const documents = [
					{
						id: 1,
						size: 16,
						mimeType: 'image/jpeg',
						content: 'test content'
					}
				];
				expect(identityAttributes.validate(attrTypeSchema, cert, documents)).toBe(true);
			});
			it('should fail if schema is incorrect', () => {
				const attrTypeSchema = { format: 'unknown' };
				const email = 'support@selfkey.org';
				expect(identityAttributes.validate(attrTypeSchema, email)).toBe(false);
			});
			it('should fail if data is not valid', () => {
				const attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/email.json'
				);
				const email = 'supportAselfkey.org';
				expect(identityAttributes.validate(attrTypeSchema, email)).toBe(false);
			});
		});
	});
	describe('Json Schema', () => {
		describe('containsFile', () => {
			it('false if simple schema', () => {
				let attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/email.json'
				);
				expect(jsonSchema.containsFile(attrTypeSchema)).toBe(false);
			});
			it('false if complext non file schema', () => {
				let attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/physical-address.json'
				);
				expect(jsonSchema.containsFile(attrTypeSchema)).toBe(false);
			});
			it('true if simple file schema', () => {
				let attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/tax-certificate.json'
				);
				expect(jsonSchema.containsFile(attrTypeSchema)).toBe(true);
			});
			it('true if complex file schema', () => {
				let attrTypeSchema = findAttributeType(
					'http://platform.selfkey.org/schema/attribute/national-id.json'
				);
				expect(jsonSchema.containsFile(attrTypeSchema)).toBe(true);
			});
		});
	});
});
