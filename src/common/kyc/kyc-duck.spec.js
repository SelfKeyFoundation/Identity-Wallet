import sinon from 'sinon';
import _ from 'lodash';
import { setGlobalContext } from '../context';
import { identitySelectors, initialState as identityInitialState } from '../identity';
import { kycActions, kycTypes, reducers, initialState, kycSelectors, testExports } from './index';
import templates from './__fixtures__/templates';
import expectedMemberRequirements from './__fixtures__/expected-member-requirements';

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
		state = { kyc: _.cloneDeep(initialState), identity: _.cloneDeep(identityInitialState) };
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
				sinon.stub(identitySelectors, 'selectIdentity').returns({ id: 1 });
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
			describe('selectMemberRequirementsForTemplate', () => {
				let identity = null;
				let template = {};
				let childrenIdentities = null;
				beforeEach(() => {
					identity = { id: 1, type: 'corporate', positions: [] };
					childrenIdentities = [
						{ id: 2, type: 'individual', parentId: 1, positions: ['member-llc'] },
						{
							id: 3,
							type: 'corporate',
							parentId: 1,
							positions: ['member-llc']
						},
						{ id: 4, type: 'individual', parentId: 3, positions: ['ubo'] }
					];
					template = templates[1];
				});
				it('should be null for non corporate identities', () => {
					sinon
						.stub(identitySelectors, 'selectIdentity')
						.returns({ ...identity, type: 'individual' });
					expect(
						kycSelectors.selectMemberRequirementsForTemplate(state, 'rest', 'test')
					).toBe(null);
				});
				it('should receive member requirements', () => {
					sinon.stub(identitySelectors, 'selectIdentity').returns(identity);
					sinon.stub(identitySelectors, 'selectBasicAttributeInfo').returns('llc');
					sinon.stub(kycSelectors, 'oneTemplateSelector').returns(template);
					sinon
						.stub(kycSelectors, 'selectKYCUserData')
						.callsFake((state, id) =>
							id === 1 || id === 3 ? { entityType: 'llc' } : {}
						);
					sinon
						.stub(identitySelectors, 'selectChildrenIdentities')
						.returns(childrenIdentities);
					expect(
						kycSelectors.selectMemberRequirementsForTemplate(state, 'rest', 'test')
					).toEqual(expectedMemberRequirements);
				});
			});
		});
	});
});
