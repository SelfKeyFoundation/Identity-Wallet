import platform from '../../main/assets/data/selfkey-platform.json';
import { identityAttributes } from './utils';
const findAttributeType = id => {
	let attrs = platform.attributes.filter(attr => attr['$id'] === id);

	if (!attrs.length) return null;
	return attrs[0];
};

describe('Identity uitls', () => {
	describe('Identity Attributes', () => {
		describe('denormilize documents', () => {});
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
	});
});
