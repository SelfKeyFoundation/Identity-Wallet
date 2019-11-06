import { Logger } from '../logger/logger';

const log = new Logger('corporate-schema');

log.error = (...args) => console.error('XXX', ...args);

export class CorporateStructureSchema {
	constructor(schema) {
		this.schema = schema;
	}
	getCompanyTypes() {
		try {
			return this.schema.properties.companyType.enum;
		} catch (error) {
			log.error(error);
			throw new Error('Invalid Schema');
		}
	}
	getPositionsForCompanyType(companyType) {
		if (!this.getCompanyTypes().includes(companyType)) {
			throw new Error('Unknown company type');
		}
		try {
			const membersSchema = this.schema.dependencies.companyType.oneOf.find(s => {
				return s.properties.companyType.enum[0] === companyType;
			});
			const positions = membersSchema.properties.members.items.properties.positions.items.oneOf.map(
				p => {
					const positionObj = {};
					positionObj.position = p.properties.position.const;
					if (p.properties.equity) {
						positionObj.equity = p.properties.equity.title || 'Percentage';
					}
					return positionObj;
				}
			);
			return positions;
		} catch (error) {
			log.error(error);
			throw new Error('Invalid Schema');
		}
	}
	getEquityForCompanyType(companyType) {
		if (!this.getCompanyTypes().includes(companyType)) {
			throw new Error('Unknown company type');
		}
		try {
			const positions = this.getPositionsForCompanyType(companyType);
			return positions.reduce((acc, curr) => {
				if (acc) return acc;
				return curr.equity || false;
			}, false);
		} catch (error) {
			log.error(error);
			throw new Error('Invalid Schema');
		}
	}

	getAllPositions() {
		const companyTypes = this.getCompanyTypes();
		const positions = companyTypes
			.map(companyType =>
				this.getPositionsForCompanyType(companyType).map(p => ({
					...p,
					companyType
				}))
			)
			.reduce((acc, curr) => {
				acc = acc.concat(curr);
				return acc;
			}, [])
			.reduce((acc, curr, indx) => {
				const ind = acc.findIndex(p => p.position === curr.position);
				let position = {
					position: curr.position,
					equity: curr.equity || false,
					companyTypes: [curr.companyTypes]
				};
				if (ind === -1) {
					acc.push(position);
				} else {
					position.companyTypes = acc[ind].companyTypes.concat(position.companyTypes);
					acc[ind] = position;
				}
				return acc;
			}, []);
		return positions;
	}

	getEquityForPosition(position) {
		const positions = this.getAllPositions();
		const existingPosition = positions.find(p => p.position === position);
		if (!existingPosition) {
			throw new Error('Unknown position type');
		}
		return existingPosition.equity;
	}
	buildPayload(company, members, attributes) {}
}

export default CorporateStructureSchema;
