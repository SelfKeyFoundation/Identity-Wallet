import { Repository } from './repository';
import { IdAttributeType } from './id-attribute-type';
import { Document } from './document';

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

	updateIdAttributeTypes(idAttributeTypes) {
		return Promise.all(
			idAttributeTypes.map(attrType => IdAttributeType.addRemote(attrType.url))
		);
	}

	loadDocuments(walletId) {
		return Document.findAllByWalletId(walletId);
	}
}

export default IdentityService;
