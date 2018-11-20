import sinon from 'sinon';
import { Repository } from './repository';
import { IdentityService } from './identity-service';
import { IdAttributeType } from './id-attribute-type';

describe('IdentityService', () => {
	let service = null;

	beforeEach(() => {
		service = new IdentityService();
		sinon.restore();
	});
	describe('Repositories', () => {
		let repositories = [
			{ id: 1, url: 'test', expires: Date.now() - 3000 },
			{ id: 2, url: 'test2', expires: Date.now() + 50000 },
			{ id: 3, url: 'test3', expires: Date.now() - 3000 }
		];

		let idAttributeTypes = [
			{ id: 1, url: 'test', expires: Date.now() - 3000 },
			{ id: 2, url: 'test2', expires: Date.now() + 50000 },
			{ id: 3, url: 'test3', expires: Date.now() - 3000 }
		];

		it('loadRepositories', async () => {
			sinon.stub(Repository, 'findAll').resolves(repositories);
			let loadedRepos = await service.loadRepositories();
			expect(loadedRepos).toEqual(repositories);
		});

		it('updateRepositories', async () => {
			sinon.stub(Repository, 'addRemoteRepo').resolves('ok');
			let testRepos = ['test', 'test3'];
			await service.updateRepositories([repositories[0], repositories[1]]);
			expect(Repository.addRemoteRepo.calledOnceWith(testRepos[0]));
			expect(Repository.addRemoteRepo.calledOnceWith(testRepos[1]));
		});

		it('loadIdAttributeTypes', async () => {
			sinon.stub(IdAttributeType, 'findAll').resolves(idAttributeTypes);
			let loadedTypes = await service.loadIdAttributeTypes();
			expect(loadedTypes).toEqual(idAttributeTypes);
		});

		it('updateIdAttributeTypes', async () => {
			sinon.stub(IdAttributeType, 'addRemote').resolves('ok');
			let testIdAttributeTypes = ['test', 'test3'];
			await service.updateIdAttributeTypes(testIdAttributeTypes);
			expect(IdAttributeType.addRemote.calledOnceWith(testIdAttributeTypes[0]));
			expect(IdAttributeType.addRemote.calledOnceWith(testIdAttributeTypes[1]));
		});
	});
});
