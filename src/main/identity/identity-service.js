import { Repository } from './repository';
import { IdAttributeType } from './id-attribute-type';
import { Document } from './document';
import { IdAttribute } from './id-attribute';
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

	updateIdAttributeTypes(idAttributeTypes) {
		return Promise.all(
			idAttributeTypes.map(attrType => IdAttributeType.addRemote(attrType.url))
		);
	}

	loadDocuments(walletId) {
		return Document.findAllByWalletId(walletId);
	}

	loadIdAttributes(walletId) {
		return IdAttribute.findAllByWalletId(walletId);
	}

	loadDocumentsForAttribute(attributeId) {
		return Document.findAllByAttributeId(attributeId);
	}

	removeDocument(documentId) {
		return Document.delete(documentId);
	}

	createIdAttribute(attribute) {
		return IdAttribute.create(attribute);
	}

	removeIdAttribute(attributeId) {
		return IdAttribute.delete(attributeId);
	}

	editIdAttribute(attribute) {
		return IdAttribute.update(attribute);
	}
}

export default IdentityService;
