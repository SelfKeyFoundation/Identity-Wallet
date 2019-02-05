import { Repository } from './repository';
import { IdAttributeType } from './id-attribute-type';
import { Document } from './document';
import { IdAttribute } from './id-attribute';
import { formatDataUrl, bufferFromDataUrl } from 'common/utils/document';
import { UiSchema } from './ui-schema';

export class IdentityService {
	loadRepositories() {
		return Repository.findAll();
	}

	updateRepositories(repos) {
		return Promise.all(repos.map(repo => Repository.addRemoteRepo(repo.url)));
	}

	loadIdAttributeTypes() {
		return IdAttributeType.findAll();
	}

	loadUiSchemas() {
		return UiSchema.findAll();
	}

	updateUiSchemas(schemas) {
		return Promise.all(
			schemas.map(schema =>
				UiSchema.addRemote(schema.url, schema.repositoryId, schema.attributeTypeId)
			)
		);
	}

	updateIdAttributeTypes(idAttributeTypes) {
		return Promise.all(
			idAttributeTypes.map(attrType => IdAttributeType.addRemote(attrType.url))
		);
	}

	async loadDocuments(walletId) {
		let docs = await Document.findAllByWalletId(walletId);
		return docs.map(doc => {
			doc = doc.toJSON();
			if (doc.buffer) {
				doc.content = formatDataUrl(doc.mimeType, doc.buffer.toString('base64'));
				delete doc.buffer;
			}
			return doc;
		});
	}

	loadIdAttributes(walletId) {
		return IdAttribute.findAllByWalletId(walletId);
	}

	async loadDocumentsForAttribute(attributeId) {
		let docs = await Document.findAllByAttributeId(attributeId);
		console.log('XXX docs for attr', attributeId, docs);
		return docs.map(doc => {
			doc = doc.toJSON();
			if (doc.buffer) {
				doc.content = formatDataUrl(doc.mimeType, doc.buffer.toString('base64'));
				delete doc.buffer;
			}
			return doc;
		});
	}

	removeDocument(documentId) {
		return Document.delete(documentId);
	}

	createIdAttribute(attribute) {
		let documents = (attribute.documents || []).map(doc => {
			doc = { ...doc };
			doc.buffer = bufferFromDataUrl(doc.content);
			return doc;
		});
		attribute = { ...attribute, documents };

		return IdAttribute.create(attribute);
	}

	removeIdAttribute(attributeId) {
		return IdAttribute.delete(attributeId);
	}

	editIdAttribute(attribute) {
		let documents = (attribute.documents || []).map(doc => {
			doc = { ...doc };
			if (doc.content) {
				doc.buffer = bufferFromDataUrl(doc.content);
				delete doc.content;
			}
			return doc;
		});
		attribute = { ...attribute, documents };
		return IdAttribute.update(attribute);
	}
}

export default IdentityService;
