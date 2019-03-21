import { Country } from './country';

export class CountryService {
	async getCountries() {
		return Country.findAll();
	}
}

export default CountryService;
