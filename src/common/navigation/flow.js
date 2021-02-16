import _ from 'lodash';
import { nanoid } from 'nanoid';
import { createAliasedSlice } from '../utils/duck';
import { createSelector } from 'reselect';
import { validate, ParameterValidationError } from 'parameter-validator';
import { push } from 'connected-react-router';
import { Logger } from 'common/logger';

const log = new Logger('NavigationFlowDuck');

export const SLICE_NAME = 'navigationFlow';

const initialState = {
	currentFlow: null,
	flows: []
};

const selectSelf = state => state[SLICE_NAME];

const getCurrentFlow = createSelector(
	selectSelf,
	({ currentFlow }) => currentFlow
);

const getPathFactory = name =>
	createSelector(
		getCurrentFlow,
		flow => (flow ? flow[name] : null)
	);

const selectors = {
	getCurrentFlow,
	getPathFactory
};

const navigateNextOperation = ops => opt => async (dispatch, getState) => {
	const flow = getCurrentFlow(getState());
	if (!flow) {
		if (opt.path) {
			await dispatch(push(opt.path));
		}
		return;
	}

	let { next } = flow;

	if (!next) {
		next = flow.complete;
		await dispatch(ops.completeFlow());
	}

	await dispatch(push(next));
};

const navigatePrevOperation = ops => opt => async (dispatch, getState) => {
	const flow = getCurrentFlow(getState());
	if (!flow) {
		if (opt.path) {
			await dispatch(push(opt.path));
		}
		return;
	}

	let { prev } = flow;

	if (!prev) {
		prev = flow.cancel;
		await dispatch(ops.completeFlow());
	}

	await dispatch(push(prev));
};

const navigateCancelOperation = ops => opt => async (dispatch, getState) => {
	const flow = getCurrentFlow(getState());
	if (!flow) {
		if (opt.path) {
			await dispatch(push(opt.path));
		}
		return;
	}

	let { cancel } = flow;
	await dispatch(ops.completeFlow());
	await dispatch(push(cancel));
};

const navigateCompleteOperation = ops => opt => async (dispatch, getState) => {
	const flow = getCurrentFlow(getState());
	if (!flow) {
		if (opt.path) {
			await dispatch(push(opt.path));
		}
		return;
	}

	let { complete } = flow;
	await dispatch(ops.completeFlow());
	await dispatch(push(complete));
};

const startFlowOperation = ops => (opt = {}) => async (dispatch, getState) => {
	try {
		await dispatch(ops.startFlow(opt));
		if (opt.current) {
			await dispatch(push(opt.current));
		}
	} catch (error) {
		log.error(error);
	}
};

const navigateToStepOperation = ops => (opt = {}) => async (dispatch, getState) => {
	try {
		await dispatch(ops.setStep(opt));
		if (opt.current) {
			await dispatch(push(opt.current));
		}
	} catch (error) {
		log.error(error);
	}
};

const navigateContinueOperation = ops => (opt = {}) => async (dispatch, getState) => {
	try {
		await dispatch(ops.setStep(opt));
		if (opt.current) {
			await dispatch(push(opt.current));
		}
	} catch (error) {
		log.error(error);
	}
};

export const createSlice = (state = initialState) => {
	return createAliasedSlice({
		name: SLICE_NAME,
		initialState: state,
		reducers: {
			completeFlow(state) {
				state.currentFlow = state.flows.pop() || null;
			},
			startFlow: {
				reducer: (state, action) => {
					validate(action.payload, ['complete', 'cancel']);
					if (state.currentFlow) {
						state.flows.push(state.currentFlow);
					}
					state.currentFlow = {
						name: null,
						next: null,
						prev: null,
						current: null,
						...action.payload
					};
				},
				prepare: payload => {
					const id = nanoid();
					return { payload: { id, ...payload } };
				}
			},
			setPath(state, { payload }) {
				const { name, path } = validate(payload, ['name', 'path']);
				if (!['complete', 'cancel', 'next', 'prev', 'current'].includes(name)) {
					throw new ParameterValidationError('unsupported path name');
				}
				if (!state.currentFlow) return;
				state.currentFlow[name] = path;
			},
			setStep(state, { payload }) {
				if (!state.currentFlow) return;
				payload = _.pick(payload, ['next', 'prev', 'current']);
				state.currentFlow = { ...state.currentFlow, ...payload };
			}
		},
		aliasedOperations: {
			navigateNextOperation,
			navigatePrevOperation,
			navigateCancelOperation,
			navigateCompleteOperation,
			startFlowOperation,
			navigateToStepOperation,
			navigateContinueOperation
		}
	});
};

const { reducer, operations } = createSlice();

export { operations as navigationFlowOperations, selectors as navigationFlowSelectors };

export default reducer;
