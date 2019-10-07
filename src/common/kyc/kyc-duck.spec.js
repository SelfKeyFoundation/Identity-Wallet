import sinon from 'sinon';
import { setGlobalContext } from '../context';
import { identitySelectors } from '../identity';
import { kycActions, kycTypes, reducers, initialState, kycSelectors, testExports } from './index';

describe('KYC Duck', () => {
	let kycApplicationService = {
		load() {}
	};
	let state = {};
	let store = {
		dispatch() {},
		getState() {
			return state;
		}
	};
	beforeEach(() => {
		sinon.restore();
		state = { kyc: { ...initialState } };
		setGlobalContext({ kycApplicationService: kycApplicationService });
	});
	describe('Applications', () => {
		let testApplications = [
			{ id: 1, type: 'Incorporation', country: 'Singapore', status: 'Documents Required' },
			{ id: 2, type: 'Incorporation', country: 'France', status: 'Documents Submitted' },
			{ id: 3, type: 'Incorporation', country: 'Malta', status: 'Approved' },
			{ id: 4, type: 'Incorporation', country: 'Brazil', status: 'Denied' }
		];
		describe('Operations', () => {
			it('loadApplicationsOperation', async () => {
				sinon.stub(kycApplicationService, 'load').resolves(testApplications);
				sinon.stub(identitySelectors, 'selectCurrentIdentity').returns({ id: 1 });
				sinon.stub(store, 'dispatch');

				await testExports.operations.loadApplicationsOperation()(
					store.dispatch,
					store.getState.bind(store)
				);

				expect(kycApplicationService.load.calledOnce).toBeTruthy();
			});
		});
		describe('Actions', () => {
			it('setApplicationsAction', () => {
				expect(kycActions.setApplicationsAction(testApplications)).toEqual({
					type: kycTypes.KYC_APPLICATIONS_SET,
					payload: testApplications
				});
			});
		});
		describe('Reducers', () => {
			it('setApplicationsReducer', () => {
				let state = {
					applications: [],
					applicationsById: {}
				};
				let newState = reducers.setApplicationsReducer(
					state,
					kycActions.setApplicationsAction([testApplications[0]])
				);

				expect(newState).toEqual({
					applications: [testApplications[0].id],
					applicationsById: {
						[testApplications[0].id]: testApplications[0]
					}
				});
			});
		});
		describe('Selectors', () => {
			beforeEach(() => {
				state.kyc.applications = testApplications.map(app => app.id);
				state.kyc.applicationsById = testApplications.reduce((acc, curr) => {
					acc[curr.id] = curr;
					return acc;
				}, {});
			});
			it('selectApplications', () => {
				expect(kycSelectors.selectApplications(state)).toEqual(testApplications);
			});
		});
	});
});
