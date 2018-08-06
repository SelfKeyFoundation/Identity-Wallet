import { getInitialStateRenderer } from 'electron-redux';
import configureStore from 'common/store/configure-store';

const initialState = getInitialStateRenderer();
const store = configureStore(initialState, 'renderer');

export default store;
