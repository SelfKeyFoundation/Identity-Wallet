import { testSliceReducer } from '../utils/slice-test';
import { createSlice } from './flow';
import { ParameterValidationError } from 'parameter-validator';

const t = testSliceReducer(createSlice);

describe('flow navigation duck', () => {
	describe('completeFlow', () => {
		[
			// actionName,
			// payload,
			// expectedState,
			// initialSliceState,
			// [message = null],
			// [initialStoreState = {}]
			[
				'completeFlow',
				null,
				{ currentFlow: null, flows: [] },
				{
					currentFlow: { test: 'test' },
					flows: []
				},
				'finish top level flow'
			],
			[
				'completeFlow',
				null,
				{
					currentFlow: {
						cancel: '/flow/cancel',
						complete: '/flow/complete',
						next: null,
						prev: null,
						current: null
					},
					flows: []
				},
				{
					currentFlow: {
						cancel: '/flow/cancel2',
						complete: '/flow/complete2',
						next: null,
						prev: null,
						current: null
					},
					flows: [
						{
							cancel: '/flow/cancel',
							complete: '/flow/complete',
							next: null,
							prev: null,
							current: null
						}
					]
				},
				'finish nested flow'
			]
		].map(params => t(...params));
	});

	describe('startFlow', () => {
		[
			[
				'startFlow',
				{ complete: '/flow/complete' },
				ParameterValidationError,
				{ currentFlow: null, flows: [] },
				'no cancel parameter'
			],
			[
				'startFlow',
				{ cancel: '/flow/cancel' },
				ParameterValidationError,
				{ currentFlow: null, flows: [] },
				'no complete parameter'
			],
			[
				'startFlow',
				{ cancel: '/flow/cancel', complete: '/flow/complete' },
				{
					currentFlow: {
						cancel: '/flow/cancel',
						complete: '/flow/complete',
						next: null,
						prev: null,
						current: null,
						name: null,
						id: expect.any(String)
					},
					flows: []
				},
				{ currentFlow: null, flows: [] },
				'start first flow'
			],
			[
				'startFlow',
				{ cancel: '/flow/cancel2', complete: '/flow/complete2', name: 'testFlow' },
				{
					currentFlow: {
						cancel: '/flow/cancel2',
						complete: '/flow/complete2',
						next: null,
						prev: null,
						current: null,
						name: 'testFlow',
						id: expect.any(String)
					},
					flows: [
						{
							cancel: '/flow/cancel',
							complete: '/flow/complete',
							next: null,
							prev: null,
							current: null
						}
					]
				},
				{
					currentFlow: {
						cancel: '/flow/cancel',
						complete: '/flow/complete',
						next: null,
						prev: null,
						current: null
					},
					flows: []
				},
				'start second flow'
			]
		].map(params => t(...params));
	});

	describe('setPath', () => {
		[
			[
				'setPath',
				{ name: 'complete', path: '/complete' },
				{
					currentFlow: {
						complete: '/complete',
						cancel: '/cancel'
					}
				},
				{
					currentFlow: {
						complete: '/cancel',
						cancel: '/cancel'
					}
				},
				'updates path'
			],
			[
				'setPath',
				{ path: '/complete' },
				ParameterValidationError,
				{
					currentFlow: {
						complete: '/cancel',
						cancel: '/cancel'
					}
				},
				'no name'
			],
			[
				'setPath',
				{ name: 'complete' },
				ParameterValidationError,
				{
					currentFlow: {
						complete: '/cancel',
						cancel: '/cancel'
					}
				},
				'no path'
			],
			[
				'setPath',
				{ name: 'test', path: '/complete' },
				ParameterValidationError,
				{
					currentFlow: {
						complete: '/cancel',
						cancel: '/cancel'
					}
				},
				'unsupported path name'
			]
		].map(params => t(...params));
	});

	describe('setStep', () => {
		[
			[
				'setStep',
				{
					current: '/path/current',
					next: '/path/next',
					prev: '/path/prev',
					extra: '/path/extra'
				},
				{
					currentFlow: {
						complete: '/complete',
						cancel: '/cancel',
						current: '/path/current',
						next: '/path/next',
						prev: '/path/prev'
					}
				},
				{
					currentFlow: {
						complete: '/complete',
						cancel: '/cancel'
					}
				},
				'init step urls'
			]
		].map(params => t(...params));
	});

	// TODO: implement operations tests
});
