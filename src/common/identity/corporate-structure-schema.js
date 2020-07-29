import { Logger } from '../logger/logger';
import { jsonSchema } from './utils';

const log = new Logger('corporate-schema');
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
	getCompanyTypeNames() {
		try {
			if (!this.schema.properties.companyType.enumNames) {
				return this.getCompanyTypes();
			}
			return this.schema.properties.companyType.enumNames;
		} catch (error) {
			log.error(error);
			throw new Error('Invalid Schema');
		}
	}
	getCompanyTypeNameByCode(code) {
		const types = this.getCompanyTypes();
		const index = types.findIndex(c => c === code);
		if (index === -1) {
			return null;
		}
		return this.getCompanyTypeNames()[index];
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
					positionObj.title = p.properties.position.title || positionObj.position;
					positionObj.description =
						p.properties.position.description || positionObj.position;
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
				return curr.equity ? curr.equity : false;
			}, false);
		} catch (error) {
			log.error(error);
			throw new Error('Invalid Schema');
		}
	}
	getEquityPositionsForCompanyType(companyType) {
		if (!this.getCompanyTypes().includes(companyType)) {
			throw new Error('Unknown company type');
		}
		try {
			const positions = this.getPositionsForCompanyType(companyType);
			return positions.filter(p => p.equity).map(p => p.position);
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
	buildValue(profile) {
		const { identity, entityType, members = [] } = profile;
		if (identity.type === 'individual') {
			throw new Error('Cannot build corporate structure for individuals');
		}
		const buildPositions = m => {
			const { identity } = m;
			const { positions = [], equity = 0 } = identity;

			return positions.map(p => {
				const newPos = {
					position: p
				};
				if (this.getEquityForPosition(p)) {
					newPos.equity = equity;
				}
				return newPos;
			});
		};
		const buildCorporateEntity = m => {
			return {
				type: 'corporate',
				companyType: m.entityType,
				companyName: m.entityName,
				email: m.email
			};
		};
		const buildIndividualEntity = m => {
			return {
				type: 'individual',
				firstName: m.firstName,
				lastName: m.lastName,
				email: m.email
			};
		};
		const buildMember = m => {
			const { identity } = m;
			const entity =
				identity.type === 'individual' ? buildIndividualEntity(m) : buildCorporateEntity(m);
			return {
				entity,
				positions: buildPositions(m)
			};
		};

		return {
			companyType: entityType,
			members: members.map(buildMember)
		};
	}

	validate(value) {
		return jsonSchema.validate(this.schema, value);
	}
}

export default CorporateStructureSchema;
