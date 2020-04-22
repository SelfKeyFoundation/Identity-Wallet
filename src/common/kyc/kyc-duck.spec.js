import sinon from 'sinon';
import _ from 'lodash';
import { setGlobalContext } from '../context';
import { identitySelectors, initialState as identityInitialState } from '../identity';
import { kycActions, kycTypes, reducers, initialState, kycSelectors, testExports } from './index';
import templates from './__fixtures__/templates';

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
						{ id: 2, type: 'individual', parentId: 1, positions: ['director-ltd'] },
						{
							id: 3,
							type: 'corporate',
							parentId: 1,
							positions: ['shareholder', 'ubo']
						},
						{ id: 4, type: 'individual', parentId: 3, positions: ['ubo'] }
					];
					template = templates[0];
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
					const requirements = childrenIdentities.map(c => {
						const memberTemplate =
							c.type === 'corporate'
								? template.memberTemplates[1]
								: template.memberTemplates[0];
						const userData = c.type === 'corporate' ? { entityType: 'ltd' } : {};
						return {
							...c,
							userData,
							memberTemplate,
							requirements: [
								{
									description: 'Email',
									duplicateType: false,
									id: '5df10a2811ee271569c88db7',
									options: [],
									required: true,
									schemaId:
										'http://platform.selfkey.org/schema/attribute/email.json',
									tType: undefined,
									title: 'Email',
									type: undefined,
									uiId: '5df10a2811ee271569c88db7'
								},
								{
									description: 'Company Name',
									duplicateType: false,
									id: '5dfb6a6742279f5a50c864ec',
									options: [],
									required: true,
									schemaId:
										'http://platform.selfkey.org/schema/attribute/company-name.json',
									tType: undefined,
									title: 'Company Name',
									type: undefined,
									uiId: '5dfb6a6742279f5a50c864ec'
								},
								{
									description: 'Legal Entity Type',
									duplicateType: false,
									id: '5dfb6a7c42279f59a5c864ee',
									options: [],
									required: true,
									schemaId:
										'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
									tType: undefined,
									title: 'Legal Entity Type',
									type: undefined,
									uiId: '5dfb6a7c42279f59a5c864ee'
								}
							]
						};
					});
					sinon.stub(identitySelectors, 'selectIdentity').returns(identity);
					sinon.stub(identitySelectors, 'selectBasicAttributeInfo').returns('ltd');
					sinon.stub(kycSelectors, 'oneTemplateSelector').returns(template);
					sinon
						.stub(kycSelectors, 'selectKYCUserData')
						.callsFake((state, id) => (id === 3 ? { entityType: 'ltd' } : {}));
					sinon
						.stub(identitySelectors, 'selectChildrenIdentities')
						.returns(childrenIdentities);
					expect(
						kycSelectors.selectMemberRequirementsForTemplate(
							state,
							'rest',
							'test',
							null,
							2
						)
					).toEqual(requirements);
				});
			});
		});
	});
});
