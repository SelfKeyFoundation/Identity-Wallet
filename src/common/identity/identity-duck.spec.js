import sinon from 'sinon';
import { setGlobalContext } from '../context';
import {
	identityActions,
	identityTypes,
	identityReducers,
	initialState,
	identitySelectors,
	testExports
} from './index';

describe('Identity Duck', () => {
	// Operations:
	// + LOAD Repositories
	// + LOAD IdAttribute Types
	// - LOAD UiSchemas
	// - LOAD document binary -- with binary
	// - EDIT id attribute
	// - REMOVE id-attribute
	// - CREATE id-attribute
	// - LOCK IDENTITY
	//   - DELETE id attributres
	//   - DELETE documents
	// - UNLOCK IDENTITY
	//   - LOAD idAttributes
	//   - LOAD documents  - without binary
	// Actions:
	// + SET Repositories
	// + Set id attribute types
	// - set ui schema is loading
	// - set documents are loading
	// - set document is loadin
	// - set id-attribute update
	// - set id-attribute-types
	// - set id-attributes
	// - update id-attribute
	// - add id-attribute
	// - delete id-attribute
	// - set documents
	// - delete document
	// - update document
	let identityService = {
		loadRepositories() {},
		updateRepositories() {},
		loadIdAttributeTypes() {}
	};
	let state = {};
	let store = {
		dispatch() {},
		getState() {
			return state;
		}
	};
	const testAction = { test: 'test' };
	beforeEach(() => {
		sinon.restore();
		state = { identity: { ...initialState } };
		setGlobalContext({ identityService: identityService });
	});
	describe('Repositories', () => {
		let now = Date.now();
		let testRepos = [
			{ id: 1, url: 'test', expires: now - 50000 },
			{ id: 2, url: 'test1', expires: now + 50000 },
			{ id: 3, url: 'test2', expires: now - 50000 }
		];
		let expiredRepos = testRepos.filter(repo => repo.expires <= now);
		describe('Operations', () => {
			it('loadRepositoriesOperation', async () => {
				sinon.stub(identityService, 'loadRepositories').resolves(testRepos);
				sinon.stub(store, 'dispatch');
				sinon.stub(identityActions, 'setRepositoriesAction').returns(testAction);

				await testExports.operations.loadRepositoriesOperation()(
					store.dispatch,
					store.getState.bind(store)
				);

				expect(identityService.loadRepositories.calledOnce).toBeTruthy();
				expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
			});
			it('updateExpiredRepositoriesOperation', async () => {
				sinon.stub(identitySelectors, 'selectExpiredRepositories').returns(expiredRepos);
				sinon.stub(identityService, 'updateRepositories').resolves('ok');
				sinon.stub(testExports.operations, 'loadRepositoriesOperation');

				await testExports.operations.updateExpiredRepositoriesOperation()(
					store.dispatch,
					store.getState.bind(store)
				);

				expect(identitySelectors.selectExpiredRepositories.calledOnce).toBeTruthy();
				expect(
					identityService.updateRepositories.calledOnceWith(expiredRepos)
				).toBeTruthy();
				expect(testExports.operations.loadRepositoriesOperation.calledOnce).toBeTruthy();
			});
		});
		describe('Actions', () => {
			it('setRepositoriesAction', () => {
				expect(identityActions.setRepositoriesAction(testRepos)).toEqual({
					type: identityTypes.IDENTITY_REPOSITORIES_SET,
					payload: testRepos
				});
			});
		});
		describe('Reducers', () => {
			it('setRepositoriesReducer', () => {
				let state = {
					repositories: [],
					repositoriesById: {}
				};
				let newState = identityReducers.setRepositoriesReducer(
					state,
					identityActions.setRepositoriesAction([testRepos[0]])
				);

				expect(newState).toEqual({
					repositories: [testRepos[0].id],
					repositoriesById: {
						[testRepos[0].id]: testRepos[0]
					}
				});
			});
		});
		describe('Selectors', () => {
			beforeEach(() => {
				state.identity.repositories = testRepos.map(repo => repo.id);
				state.identity.repositoriesById = testRepos.reduce((acc, curr) => {
					acc[curr.id] = curr;
					return acc;
				}, {});
			});
			it('selectRepositories', () => {
				expect(identitySelectors.selectRepositories(state)).toEqual(testRepos);
			});
			it('selectExpiredRepositories', () => {
				expect(identitySelectors.selectExpiredRepositories(state)).toEqual(expiredRepos);
			});
		});
	});
	describe('IdAttributeTypes', () => {
		const testIdAttributeTypes = [{}];
		describe('Operations', () => {
			it('loadIdAttributeTypesOperation', async () => {
				sinon.stub(identityService, 'loadIdAttributeTypes').resolves(testIdAttributeTypes);
				sinon.stub(store, 'dispatch');
				sinon.stub(identityActions, 'setIdAttributeTypesAction').returns(testAction);

				await testExports.operations.loadIdAttributeTypesOperation()(
					store.dispatch,
					store.getState.bind(store)
				);

				expect(identityService.loadIdAttributeTypes.calledOnce).toBeTruthy();
				expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
			});
		});
		describe('Actions', () => {
			it('setIdAttributeTypesAction', () => {
				expect(identityActions.setIdAttributeTypesAction(testIdAttributeTypes)).toEqual({
					type: identityTypes.IDENTITY_ID_ATTRIBUTE_TYPES_SET,
					payload: testIdAttributeTypes
				});
			});
		});
		describe('Reducers', () => {
			let state = {
				idAtrributeTypes: [],
				idAtrributeTypesById: {}
			};
			let newState = identityReducers.setIdAttributeTypesReducer(
				state,
				identityActions.setIdAttributeTypesAction([testIdAttributeTypes[0]])
			);

			expect(newState).toEqual({
				idAtrributeTypes: [testIdAttributeTypes[0].id],
				idAtrributeTypesById: {
					[testIdAttributeTypes[0].id]: testIdAttributeTypes[0]
				}
			});
		});
		describe('Selectors', () => {
			beforeEach(() => {
				state.identity.idAtrributeTypes = testIdAttributeTypes.map(repo => repo.id);
				state.identity.idAtrributeTypesById = testIdAttributeTypes.reduce((acc, curr) => {
					acc[curr.id] = curr;
					return acc;
				}, {});
			});
			it('selectRepositories', () => {
				expect(identitySelectors.selectIdAttributeTypes(state)).toEqual(
					testIdAttributeTypes
				);
			});
		});
	});
});
