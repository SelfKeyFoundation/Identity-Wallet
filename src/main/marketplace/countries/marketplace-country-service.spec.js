import sinon from 'sinon';
import {
	MarketplaceCountryService,
	FLAGTHEORY_COUNTRY_ENDPOINT,
	COUNTRY_API_ENDPOINT
} from './marketplace-country-service';
import { MarketplaceCountry } from './marketplace-country';
import request from 'request-promise-native';
import countriesResponseFixture from './__fixtures__/countries-airtable-response';
import countriesFetched from './__fixtures__/countries-airtable-fetched';
import countriesDb from './__fixtures__/countries-db';
import flagtheoryCountries from './__fixtures__/flagtheory-countries-response';
import flagtheoryCountriesFetched from './__fixtures__/flagtheory-countries-fetched';
import finalCountries from './__fixtures__/final-countries-fetched';
import flagtheoryOneCountry from './__fixtures__/flagtheory-one-country-response';
import flagtheoryOneCountryFetched from './__fixtures__/flagtheory-one-country-fetched';

describe('InventoryService', () => {
	let marketplaceCountriesService;
	let taxTreatiesService = {
		fetchTaxTreaties: () => {}
	};
	beforeEach(() => {
		marketplaceCountriesService = new MarketplaceCountryService({ taxTreatiesService });
	});
	afterEach(() => {
		sinon.restore();
	});
	xit('should fetch countries', async () => {
		sinon
			.stub(marketplaceCountriesService, 'fetchMarketplaceCountriesSelfkey')
			.resolves(countriesFetched());
		sinon
			.stub(marketplaceCountriesService, 'fetchMarketplaceCountriesFlagtheory')
			.resolves(flagtheoryCountriesFetched());
		const resp = await marketplaceCountriesService.fetchMarketplaceCountries();
		expect(marketplaceCountriesService.fetchMarketplaceCountriesSelfkey.calledOnce).toBe(true);
		expect(marketplaceCountriesService.fetchMarketplaceCountriesFlagtheory.calledOnce).toBe(
			true
		);
		expect(resp).toEqual(finalCountries);
	});
	it('should fetch countries from airtable', async () => {
		sinon.stub(request, 'get').resolves(countriesResponseFixture);
		const resp = await marketplaceCountriesService.fetchMarketplaceCountriesSelfkey();
		expect(request.get.getCall(0).args).toEqual([{ url: COUNTRY_API_ENDPOINT, json: true }]);
		expect(resp).toEqual(countriesFetched());
	});
	it('should fetch one flagtheory country', async () => {
		sinon.stub(request, 'get').resolves(flagtheoryOneCountry());

		const resp = await marketplaceCountriesService.fetchOneFlagtheoryCountry('AT');
		expect(request.get.getCall(0).args).toEqual([
			{ url: `${FLAGTHEORY_COUNTRY_ENDPOINT}/AT`, json: true }
		]);
		expect(resp).toEqual(flagtheoryOneCountryFetched());
	});
	it('should fetch countries from flagtheory', async () => {
		sinon.stub(taxTreatiesService, 'fetchTaxTreaties').resolves(flagtheoryCountries);
		sinon.stub(marketplaceCountriesService, 'populateCountryListFlagtheory').resolves(['ok']);
		const resp = await marketplaceCountriesService.fetchMarketplaceCountriesFlagtheory(['AT']);
		expect(marketplaceCountriesService.populateCountryListFlagtheory.getCall(0).args).toEqual([
			flagtheoryCountriesFetched(['AT'])
		]);
		expect(resp).toEqual(['ok']);
	});
	it('should load countries from db', async () => {
		sinon.stub(MarketplaceCountry, 'findAll').resolves(countriesDb);
		const loaded = await marketplaceCountriesService.loadInventory();
		expect(MarketplaceCountry.findAll.calledOnce).toBe(true);
		expect(loaded).toEqual(countriesDb);
	});
	it('should upsert countries to db', async () => {
		sinon.stub(MarketplaceCountry, 'bulkUpsert').resolves('ok');
		const taxTreaties = [1, 2, 3];
		const loaded = await marketplaceCountriesService.upsert(taxTreaties);
		expect(MarketplaceCountry.bulkUpsert.getCall(0).args).toEqual([taxTreaties]);
		expect(loaded).toEqual('ok');
	});
	it('should delete many countries from db', async () => {
		sinon.stub(MarketplaceCountry, 'deleteMany').resolves('ok');
		const taxTreaties = [1, 2, 3];
		const loaded = await marketplaceCountriesService.deleteMany(taxTreaties);
		expect(MarketplaceCountry.deleteMany.getCall(0).args).toEqual([taxTreaties]);
		expect(loaded).toEqual('ok');
	});
});
