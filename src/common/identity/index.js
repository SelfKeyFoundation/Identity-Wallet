import { getGlobalContext } from '../context';
import { createAliasedAction } from 'electron-redux';

export const initialState = {
	repositories: [],
	repositoriesById: {}
};

export const identityTypes = {
	IDENTITY_REPOSITORIES_LOAD: 'identity/repositories/load',
	IDENTITY_REPOSITORIES_SET: 'identity/repositories/set'
};

const identityActions = {
	setRepositoriesAction: repos => ({
		type: identityTypes.IDENTITY_REPOSITORIES_SET,
		payload: repos
	})
};

export const loadRepositoriesOperation = () => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let repos = await identityService.loadRepositories();
	await dispatch(identityActions.setRepositoriesAction(repos));
};

export const updateExpiredRepositoriesOperation = () => async (dispatch, getState) => {
	let expired = identitySelectors.selectExpiredRepositories(getState());
	const identityService = getGlobalContext().identityService;
	await identityService.updateRepositories(expired);
	await operations.loadRepositoriesOperation(dispatch, getState);
};

const operations = { loadRepositoriesOperation, updateExpiredRepositoriesOperation };

const identityOperations = {
	...identityActions,
	loadRepositoriesOperation: createAliasedAction(
		identityTypes.IDENTITY_REPOSITORIES_LOAD,
		loadRepositoriesOperation
	)
};

const setRepositoriesReducer = (state, action) => {
	let repositories = action.payload || [];
	let repositoriesById = repositories.reduce((acc, curr) => {
		acc[curr.id] = curr;
		return acc;
	}, {});
	repositories = repositories.map(repo => repo.id);
	return { ...state, repositories, repositoriesById };
};

const identityReducers = {
	setRepositoriesReducer
};

const selectIdentity = state => state.identity;

const selectRepositories = state =>
	identitySelectors
		.selectIdentity(state)
		.repositories.map(id => identitySelectors.selectIdentity(state).repositoriesById[id]);

const selectExpiredRepositories = state => {
	let now = Date.now();
	return identitySelectors.selectRepositories(state).filter(repo => repo.expires <= now);
};

const identitySelectors = {
	selectIdentity,
	selectRepositories,
	selectExpiredRepositories
};

export const testExports = { operations };

export { identitySelectors, identityReducers, identityActions, identityOperations };
