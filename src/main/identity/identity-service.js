import { Repository } from './repository';
import { IdAttributeType } from './id-attribute-type';
import { Document } from './document';
import { IdAttribute } from './id-attribute';
import { formatDataUrl, bufferFromDataUrl } from 'common/utils/document';
import { UiSchema } from './ui-schema';
import { Identity } from './identity';

import { Logger } from 'common/logger';

const log = new Logger('identity-service');

export class IdentityService {
	loadIdentities(walletId) {
		return Identity.findAllByWalletId(walletId);
	}
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
			schemas.map(async schema => {
				try {
					let res = await UiSchema.addRemote(
						schema.url,
						schema.repositoryId,
						schema.attributeTypeId
					);
					return res;
				} catch (error) {
					log.error('%s, %s', schema.url, error);
				}
				return null;
			})
		);
	}

	updateIdAttributeTypes(idAttributeTypes) {
		return Promise.all(
			idAttributeTypes.map(async attrType => {
				try {
					let res = await IdAttributeType.addRemote(attrType.url);
					return res;
				} catch (error) {
					log.error('%s, %s', attrType.url, error);
				}
				return null;
			})
		);
	}

	async loadDocuments(identityId) {
		let docs = await Document.findAllByIdentityId(identityId);
		return docs.map(doc => {
			doc = doc.toJSON();
			if (doc.buffer) {
				doc.content = formatDataUrl(doc.mimeType, doc.buffer.toString('base64'));
				delete doc.buffer;
			}
			return doc;
		});
	}

	loadIdAttributes(identityId) {
		return IdAttribute.findAllByIdentityId(identityId);
	}

	async loadDocumentsForAttribute(attributeId) {
		let docs = await Document.findAllByAttributeId(attributeId);
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
			if (doc.content) {
				doc.buffer = bufferFromDataUrl(doc.content);
				delete doc.content;
			}
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
	updateIdentitySetup(isSetupFinished, id) {
		return Identity.updateSetup({ id, isSetupFinished });
	}

	updateIdentityName(name, id) {
		return Identity.updateName({ id, name });
	}

	updateIdentityProfilePicture(profilePicture, id) {
		return Identity.updateProfilePicture({ id, profilePicture });
	}

	updateIdentityDID(did, id) {
		did = did.replace('did:selfkey:', '');
		return Identity.updateDID({ did, id });
	}

	createIdentity(identity) {
		return Identity.create(identity);
	}

	deleteIdentity(identityId) {
		return Identity.delete(identityId);
	}

	updateIdentity(identity) {
		return Identity.update(identity);
	}
}

export default IdentityService;
