import { schema } from 'normalizr';

const exchangeSchema = new schema.Entity('exchanges', {}, { idAttribute: 'name' });
const exchangeListSchema = [exchangeSchema];

export { exchangeListSchema };
