import platform from '../../main/assets/data/selfkey-platform.json';
import { identityAttributes } from './utils';
const findAttributeType = id => {
	let attrs = platform.attributes.filter(attr => attr['$id'] === id);

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
					'http://platform.selfkey.org/schema/attribute/fingerprint.json'
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
					'http://platform.selfkey.org/schema/attribute/fingerprint.json'
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
					'http://platform.selfkey.org/schema/attribute/fingerprint.json'
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
					additional: ['$document-#ref{document0.id}', '$document-#ref{document1.id}']
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
						additional: [
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
					'http://platform.selfkey.org/schema/attribute/fingerprint.json'
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
					'http://platform.selfkey.org/schema/attribute/fingerprint.json'
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
					'http://platform.selfkey.org/schema/attribute/fingerprint.json'
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
					'http://platform.selfkey.org/schema/attribute/fingerprint.json'
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
					additional: [
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
						additional: ['$document-#ref{document2.id}', '$document-#ref{document3.id}']
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
	});
});
