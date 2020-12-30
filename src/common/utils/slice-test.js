import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

export const createSliceTestStore = (slice, initialState = {}) => {
	const middleware = [thunk, promise];
	const enhanced = [applyMiddleware(...middleware)];
	const enhancer = compose(...enhanced);
	return createStore(
		combineReducers({
			[slice.name]: slice.reducer
		}),
		initialState,
		enhancer
	);
};

export const testSliceReducer = createSlice => (
	action,
	payload,
	expected,
	sliceState,
	message = null,
	storeInitialState
) => {
	const slice = createSlice(sliceState);

	const store = createSliceTestStore(slice, storeInitialState);

	let isError = expected.prototype && expected.prototype instanceof Error;

	message = message ? ' ' + message + ' ' : '';

	message = `reducer ${slice.name}:${action}${isError ? ' error' : ' success'}${message}`;

	it(message, async () => {
		try {
			await store.dispatch(slice.actions[action](payload));
			if (isError) {
				fail('no error thrown');
			}
			expect(store.getState()[slice.name]).toEqual(expect.objectContaining(expected));
			expect(store.getState()[slice.name]).not.toBe(expected);
		} catch (error) {
			if (!isError) {
				fail(error);
			}
			expect(error).toBeInstanceOf(expected);
		}
	});
};
