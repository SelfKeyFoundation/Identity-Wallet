import { Country } from './country';

export class CountryService {
	getCountries() {
		return Country.findAll();
	}
}

export default CountryService;
