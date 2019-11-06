import { CorporateStructureSchema } from './corporate-structure-schema';
import {
	resolvedCorporateSchema,
	companyTypes,
	companyPositions,
	companyEquity,
	positionEquity
} from './__fixtures__/corporate-structure-schema';

describe('CorporateStructureSchema', () => {
	let csSchema = null;
	beforeEach(() => {
		csSchema = new CorporateStructureSchema(resolvedCorporateSchema.dereferenced);
	});

	it('should have schema', () => {
		expect(csSchema.schema).toEqual(resolvedCorporateSchema.dereferenced);
	});
	it('getCompanyTypes', () => {
		expect(csSchema.getCompanyTypes()).toEqual(companyTypes);
	});
	describe('getPositionsForCompanyType', () => {
		it('should throw on unknown error', () => {
			expect.assertions(1);

			try {
				csSchema.getPositionsForCompanyType('unknown');
			} catch (error) {
				expect(error.message).toBe('Unknown company type');
			}
		});

		const t = companyType =>
			it(`should return positions for '${companyType}'`, () => {
				expect(csSchema.getPositionsForCompanyType(companyType)).toEqual(
					companyPositions[companyType]
				);
			});

		companyTypes.forEach(t);
	});
	describe('getEquityForCompanyType', () => {
		it('should throw on unknown error', () => {
			expect.assertions(1);

			try {
				csSchema.getEquityForCompanyType('unknown');
			} catch (error) {
				expect(error.message).toBe('Unknown company type');
			}
		});

		const t = companyType =>
			it(`should return equity for '${companyType}'`, () => {
				expect(csSchema.getEquityForCompanyType(companyType)).toEqual(
					companyEquity[companyType]
				);
			});

		companyTypes.forEach(t);
	});

	describe('getEquityForPosition', () => {
		it('should throw on unknown error', () => {
			expect.assertions(1);

			try {
				csSchema.getEquityForPosition('unknown');
			} catch (error) {
				expect(error.message).toBe('Unknown position type');
			}
		});

		const t = position =>
			it(`should return equity for '${position}'`, () => {
				expect(csSchema.getEquityForPosition(position)).toEqual(positionEquity[position]);
			});

		Object.keys(positionEquity).forEach(t);
	});
});
