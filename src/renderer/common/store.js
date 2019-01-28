import { getGlobalContext, configureContext, setGlobalContext } from 'common/context';

const ctx = getGlobalContext() || configureContext('renderer').cradle;
setGlobalContext(ctx);

const store = ctx.store;
export default store;
