import sinon from 'sinon';
import {
	TaxTreatiesService,
	FLAGTHEORY_TAX_TREATIES_ENDPOINT,
	TAX_TREATIES_API_ENDPOINT
} from './tax-treaties-service';
import { TaxTreaties } from './tax-treaties';
import request from 'request-promise-native';
import taxTreatiesResponseFixture from './__fixtures__/tax-treaties-airtable-response';
import taxTreatiesFetched from './__fixtures__/tax-treaties-airtable-fetched';
import taxTreatiesDb from './__fixtures__/tax-treaties-db';
import flagtheoryTaxTreaties from './__fixtures__/flagtheory-tax-treaties-response';
import flagtheoryTaxTreatiesFetched from './__fixtures__/flagtheory-tax-treaties-fetched';
import finalTaxTreaties from './__fixtures__/final-tax-treaties-fetched';

describe('TaxTrieatiesService', () => {
	let schedulerService = {};
	let taxTreatiesService;
	beforeEach(() => {
		taxTreatiesService = new TaxTreatiesService({ schedulerService });
	});
	afterEach(() => {
		sinon.restore();
	});
	it('should fetch tax-treaties', async () => {
		sinon.stub(taxTreatiesService, 'fetchTaxTreatiesSelfkey').resolves(taxTreatiesFetched());
		sinon
			.stub(taxTreatiesService, 'fetchTaxTreatiesFlagtheory')
			.resolves(flagtheoryTaxTreatiesFetched());
		const resp = await taxTreatiesService.fetchTaxTreaties();
		expect(taxTreatiesService.fetchTaxTreatiesSelfkey.calledOnce).toBe(true);
		expect(taxTreatiesService.fetchTaxTreatiesFlagtheory.calledOnce).toBe(true);
		expect(resp).toEqual(finalTaxTreaties);
	});
	it('should fetch tax-treaties from airtable', async () => {
		sinon.stub(request, 'get').resolves(taxTreatiesResponseFixture);
		const resp = await taxTreatiesService.fetchTaxTreatiesSelfkey();
		expect(request.get.getCall(0).args).toEqual([
			{ url: TAX_TREATIES_API_ENDPOINT, json: true }
		]);
		expect(resp).toEqual(taxTreatiesFetched());
	});
	it('should fetch tax treaties from flagtheory', async () => {
		sinon.stub(request, 'get').resolves(flagtheoryTaxTreaties);
		const resp = await taxTreatiesService.fetchTaxTreatiesFlagtheory();
		expect(request.get.getCall(0).args).toEqual([
			{ url: FLAGTHEORY_TAX_TREATIES_ENDPOINT, json: true }
		]);
		expect(resp).toEqual(flagtheoryTaxTreatiesFetched());
	});
	it('should load taxTreaties from db', async () => {
		sinon.stub(TaxTreaties, 'findAll').resolves(taxTreatiesDb);
		const loaded = await taxTreatiesService.loadTaxTreaties();
		expect(TaxTreaties.findAll.calledOnce).toBe(true);
		expect(loaded).toEqual(taxTreatiesDb);
	});
	it('should upsert taxTreaties to db', async () => {
		sinon.stub(TaxTreaties, 'bulkUpsert').resolves('ok');
		const taxTreaties = [1, 2, 3];
		await taxTreatiesService.upsert(taxTreaties);
		expect(TaxTreaties.bulkUpsert.getCall(0).args).toEqual([taxTreaties]);
	});
	it('should delete many taxTreaties from db', async () => {
		sinon.stub(TaxTreaties, 'deleteMany').resolves('ok');
		const taxTreaties = [1, 2, 3];
		await taxTreatiesService.deleteMany(taxTreaties);
		expect(TaxTreaties.deleteMany.getCall(0).args).toEqual([taxTreaties]);
	});
});
