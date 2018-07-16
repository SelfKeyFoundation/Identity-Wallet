import { init as confInit } from './config';
import Logger from './logger';

confInit();

export const createLog = prefix => new Logger(prefix);

export { Logger };

export default createLog;
