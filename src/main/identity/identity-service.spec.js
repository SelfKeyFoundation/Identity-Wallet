import sinon from 'sinon';
import { Repository } from './repository';
import { IdentityService } from './identity-service';

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

		it('loadRepositories', async () => {
			sinon.stub(Repository, 'findAll').resolves(repositories);
			let loadedRepos = await service.loadRepositories();
			expect(loadedRepos).toEqual(repositories);
		});

		it('updateRepositories', async () => {
			sinon.stub(Repository, 'addRemoteRepo').resolves('ok');
			let testRepos = ['http://test1', 'http://test2'];
			await service.updateRepositories(testRepos);
			expect(Repository.addRemoteRepo.calledOnceWith(testRepos[0]));
			expect(Repository.addRemoteRepo.calledOnceWith(testRepos[1]));
		});
	});
});
