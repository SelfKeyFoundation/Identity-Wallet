import config from 'common/config';
import { Logger } from 'common/logger';
import _ from 'lodash';
import { getGlobalContext } from 'common/context';
import { getWallet } from '../wallet/selectors';
import { identitySelectors } from 'common/identity';
import { Identity } from '../../main/platform/identity';
import { createSelector } from 'reselect';
import { createAliasedSlice } from '../utils/duck';
import { hardwareWalletOperations } from '../hardware-wallet';
import { navigationFlowOperations } from '../navigation/flow';
import { validate } from 'parameter-validator';
import { sleep } from '../utils/async';
import {
	selectAttributesByUrl,
	selectAttributesByUrlMapFactory,
	selectAttributeTypesByUrlsFactory,
	selectIdentity
} from '../identity/selectors';
import {
	COUNTRY_ATTRIBUTE,
	FIRST_NAME_ATTRIBUTE,
	LAST_NAME_ATTRIBUTE,
	PHONE_ATTRIBUTE,
	ADDRESS_ATTRIBUTE,
	RESIDENCY_ATTRIBUTE,
	NATIONALITY_ATTRIBUTE
} from 'common/identity/constants';
import { push } from 'connected-react-router';
import { featureIsEnabled } from 'common/feature-flags';

const log = new Logger('MoonpayAuthDuck');

const SLICE_NAME = 'moonPayAuth';

const initialState = {
	agreedToTerms: false,
	loginEmail: null,
	authInfo: null,
	emailVerificationRequired: false,
	authError: null,
	authenticatedPreviously: false,
	isServiceAllowed: false,
	ipCheck: null,
	allowedCountries: [],
	customerCountries: [],
	settingsLoaded: false,
	authInProgress: false,
	limits: null,
	selectedAttributes: {},
	kycSubmitting: false,
	kycError: null,
	KYCSubmitted: null,
	customer: null,
	files: []
};

const selectSelf = state => state[SLICE_NAME];

const selectAuthInfo = createSelector(
	selectSelf,
	state => state.authInfo
);

const isAuthenticated = createSelector(
	selectAuthInfo,
	auth => !!auth
);

const isServiceAllowed = createSelector(
	selectSelf,
	({ isServiceAllowed }) => isServiceAllowed
);

const selectServiceCheck = createSelector(
	selectSelf,
	state => _.pick(state, ['isServiceAllowed', 'allowedCountries', 'customerCountries', 'ipCheck'])
);

const hasAgreedToTerms = createSelector(
	selectSelf,
	({ agreedToTerms }) => agreedToTerms
);

const getLoginEmail = createSelector(
	selectSelf,
	({ loginEmail }) => loginEmail
);

const haveSettingsLoaded = createSelector(
	selectSelf,
	({ settingsLoaded }) => settingsLoaded
);

const hasAuthenticatedPreviously = createSelector(
	selectSelf,
	({ authenticatedPreviously }) => authenticatedPreviously
);

const isAuthInProgress = createSelector(
	selectSelf,
	({ authInProgress }) => authInProgress
);

const getAuthError = createSelector(
	selectSelf,
	({ authError }) => authError
);

const getLimits = createSelector(
	selectSelf,
	({ limits }) => limits
);

const isKycSubmitting = createSelector(
	selectSelf,
	({ kycSubmitting }) => kycSubmitting
);

/*
const isKycSubmitted = createSelector(
	selectSelf,
	({ KYCSubmitted }) => !!KYCSubmitted
);
*/

const getKYCChecks = createSelector(
	getLimits,
	limits => {
		const { verificationLevels } = limits;
		const a = verificationLevels.reduce((acc, curr) => {
			return curr.requirements.reduce((acc, curr) => {
				acc[curr.identifier] = curr.completed;
				return acc;
			}, acc);
		}, {});
		return a;
	}
);

const getCustomer = createSelector(
	selectSelf,
	({ customer }) => customer
);

/*
const getFiles = createSelector(
	selectSelf,
	({ files }) => files
);
*/

const isPhoneVerificationRequired = createSelector(
	getCustomer,
	customer => !!customer.phoneNumber && !customer.isPhoneNumberVerified
);

const isKycRequired = createSelector(
	getKYCChecks,
	checks =>
		(checks.hasOwnProperty('identity_verification') && !checks['identity_verification']) ||
		(checks.hasOwnProperty('document_verification') && !checks['document_verification']) ||
		(checks.hasOwnProperty('address_verification') && !checks['address_verification']) ||
		(checks.hasOwnProperty('face_match_verification') && !checks['face_match_verification'])
);

const getSelectedAttributes = createSelector(
	selectSelf,
	({ selectedAttributes }) => selectedAttributes
);

const getSelectedCountry = createSelector(
	// getSelectedAttributes,
	selectServiceCheck,
	// (selected, serviceCheck) => {
	serviceCheck => {
		return serviceCheck.customerCountries[0];
		/*
		let country = Object.keys(selected).find(uiId => {
			return selected[uiId].type.url === COUNTRY_ATTRIBUTE;
		});

		if (country) {
			country = serviceCheck.customerCountries.find(
				c => c.alpha2 === selected[country].data.value.country
			);
		}
		return country;
		*/
	}
);

const selectAttributesByUrlMap = selectAttributesByUrlMapFactory();
const selectIdAttributeTypes = selectAttributeTypesByUrlsFactory();

const getKYCRequirements = createSelector(
	getKYCChecks,
	getSelectedCountry,
	state =>
		selectIdAttributeTypes(state, {
			attributeTypeUrls: [
				FIRST_NAME_ATTRIBUTE,
				LAST_NAME_ATTRIBUTE,
				PHONE_ATTRIBUTE,
				ADDRESS_ATTRIBUTE,
				COUNTRY_ATTRIBUTE,
				'http://platform.selfkey.org/schema/attribute/date-of-birth.json',
				'http://platform.selfkey.org/schema/attribute/passport.json',
				'http://platform.selfkey.org/schema/attribute/national-id.json',
				'http://platform.selfkey.org/schema/attribute/drivers-license.json',
				'http://platform.selfkey.org/schema/attribute/utility-bill.json',
				'http://platform.selfkey.org/schema/attribute/bank-statement.json'
			]
		}),
	state =>
		selectAttributesByUrlMap(state, {
			attributeTypeUrls: [
				FIRST_NAME_ATTRIBUTE,
				LAST_NAME_ATTRIBUTE,
				PHONE_ATTRIBUTE,
				ADDRESS_ATTRIBUTE,
				COUNTRY_ATTRIBUTE,
				'http://platform.selfkey.org/schema/attribute/date-of-birth.json',
				'http://platform.selfkey.org/schema/attribute/passport.json',
				'http://platform.selfkey.org/schema/attribute/national-id.json',
				'http://platform.selfkey.org/schema/attribute/drivers-license.json',
				'http://platform.selfkey.org/schema/attribute/utility-bill.json',
				'http://platform.selfkey.org/schema/attribute/bank-statement.json'
			]
		}),
	(checks, country, idTypes, attributesByUrl) => {
		const getType = url => idTypes.find(t => t.url === url);

		const createRequirement = (types = [], title, name, required = true) => {
			let options = !Array.isArray(types)
				? attributesByUrl[types]
				: types.flatMap(t => attributesByUrl[t]).filter(t => !!t);
			const attributeTypes = !Array.isArray(types) ? getType(types) : types.map(getType);

			if (!name) {
				name = Array.isArray(types) ? types[0] : types;
			}

			return {
				uiId: name,
				required,
				schemaId: types,
				options,
				title:
					title ||
					(Array.isArray(attributeTypes)
						? attributeTypes[0]
							? attributeTypes[0].content.title
							: null
						: attributeTypes
						? attributeTypes.content.title
						: null),
				tType: 'individual',
				type: attributeTypes,
				duplicateType: false
			};
		};

		let requirements = [createRequirement(COUNTRY_ATTRIBUTE)];
		if (checks.hasOwnProperty('phone_number_verification')) {
			requirements.push(createRequirement(PHONE_ATTRIBUTE));
		}
		if (checks.hasOwnProperty('identity_verification')) {
			requirements = requirements.concat(
				[
					FIRST_NAME_ATTRIBUTE,
					LAST_NAME_ATTRIBUTE,
					ADDRESS_ATTRIBUTE,
					'http://platform.selfkey.org/schema/attribute/date-of-birth.json'
				].map(t => createRequirement(t))
			);
		}

		if (
			country &&
			(checks.hasOwnProperty('document_verification') ||
				checks.hasOwnProperty('face_match_verification'))
		) {
			const types = [];

			if (country.supportedDocuments.includes('passport')) {
				types.push('http://platform.selfkey.org/schema/attribute/passport.json');
			}

			if (country.supportedDocuments.includes('national_identity_card')) {
				types.push('http://platform.selfkey.org/schema/attribute/national-id.json');
			}

			if (country.supportedDocuments.includes('driving_licence')) {
				types.push('http://platform.selfkey.org/schema/attribute/drivers-license.json');
			}
			if (types.length) {
				requirements.push(
					createRequirement(types, 'Identity Document', 'document_verification')
				);
			}
		}

		if (checks.hasOwnProperty('address_verification')) {
			const types = [];

			types.push('http://platform.selfkey.org/schema/attribute/utility-bill.json');
			types.push('http://platform.selfkey.org/schema/attribute/bank-statement.json');

			requirements.push(createRequirement(types, 'Proof of Address', 'proof_of_address'));
		}

		return requirements;
	}
);

const selectFilledKycRequirements = createSelector(
	getKYCRequirements,
	getSelectedAttributes,
	(requirements, selected) => {
		return requirements.map(r => {
			const attributeName = `_${r.uiId}`;
			const sel =
				!r.options || !r.options.length ? null : selected[attributeName] || r.options[0];
			return {
				id: r.id,
				attribute: sel || undefined,
				attributeId: sel ? sel.id : undefined,
				schemaId: r.schemaId,
				schema: r.schema || (r.type ? r.type.content : undefined),
				required: r.required,
				type: r.tType || 'individual'
			};
		});
	}
);

const areKycRequirementsValid = createSelector(
	selectFilledKycRequirements,
	requirements => {
		return requirements.reduce((acc, curr) => {
			if (!acc) return acc;
			const attribute = curr.attribute;
			// Ignore optional empty attributes
			if (!attribute && !curr.required) {
				return true;
			}
			if (!attribute || !attribute.isValid) return false;

			return true;
		}, true);
	}
);

const isAddressValid = createSelector(
	selectFilledKycRequirements,
	requirements => {
		let isValid = false;
		requirements.forEach(req => {
			if (
				req.schemaId ===
				'http://platform.selfkey.org/schema/attribute/physical-address.json'
			) {
				if (
					req.attribute.data.value.city &&
					req.attribute.data.value.postalcode &&
					req.attribute.data.value.province
				) {
					isValid = true;
				}
			}
		});
		return isValid;
	}
);

const getKycError = createSelector(
	selectSelf,
	({ kycError }) => kycError
);

const isEmailVerificationRequired = createSelector(
	selectSelf,
	({ emailVerificationRequired }) => emailVerificationRequired
);

const selectors = {
	hasAgreedToTerms,
	getLoginEmail,
	isAuthenticated,
	selectAuthInfo,
	isServiceAllowed,
	haveSettingsLoaded,
	hasAuthenticatedPreviously,
	isAuthInProgress,
	getAuthError,
	selectServiceCheck,
	getKYCChecks,
	getSelectedAttributes,
	getSelectedCountry,
	getKYCRequirements,
	isKycRequired,
	isKycSubmitting,
	areKycRequirementsValid,
	isAddressValid,
	getKycError,
	isEmailVerificationRequired,
	isPhoneVerificationRequired,
	getCustomer
};

const authErrorOperation = ops => () => async (dispatch, getState) => {
	await dispatch(ops.setAuthInfo(null));
};

const authOperation = ops => ({ email, securityCode, cancelUrl, completeUrl }) => async (
	dispatch,
	getState
) => {
	try {
		const { moonPayService } = getGlobalContext();
		const state = getState();
		const wallet = getWallet(state);
		const identityInfo = identitySelectors.selectIdentity(state);
		const identity = new Identity(wallet, identityInfo);
		if (isAuthInProgress(getState())) {
			return;
		}
		let authInfo = null;
		await dispatch(ops.setAuthInProgress(true));
		if (featureIsEnabled('moonpayWalletLogin')) {
			authInfo = await dispatch(
				hardwareWalletOperations.useHardwareWalletOperation(
					() => moonPayService.auth(identity, email),
					{
						cancelUrl,
						completeUrl
					}
				)
			);
		} else {
			authInfo = await moonPayService.loginWithEmail({ email, securityCode });
			if (authInfo.preAuthenticated) {
				await dispatch(ops.setEmailVerificationRequired(true));
				return;
			}
		}
		await dispatch(ops.setAuthInfo(authInfo));
		await moonPayService.updateSettings(wallet.id, { authenticatedPreviously: true });
		await dispatch(ops.setPreviousAuthentication(true));
	} catch (error) {
		log.error(error);
		console.error(error);
		await dispatch(ops.setAuthError(error.message));
	} finally {
		await dispatch(ops.setAuthInProgress(false));
	}
};

const checkServiceAllowedOperation = ops => opt => async (dispatch, getState) => {
	const countries = selectAttributesByUrl(getState(), {
		attributeTypeUrls: [COUNTRY_ATTRIBUTE]
	});
	const { moonPayService } = getGlobalContext();
	try {
		const checks = _.pick(await moonPayService.checkServiceAvailability(countries), [
			'isServiceAllowed',
			'allowedCountries',
			'customerCountries',
			'ipCheck'
		]);
		await dispatch(ops.setServiceChecks(checks));

		return checks;
	} catch (error) {
		log.error(error);
	}
};

const agreeToTermsOperation = ops => () => async (dispatch, getState) => {
	const wallet = getWallet(getState());
	if (!wallet) throw new Error('no wallet unlocked');
	const { moonPayService } = getGlobalContext();
	await moonPayService.updateSettings(wallet.id, {
		agreedToTerms: true
	});
	await dispatch(ops.setAgreedToTerms(true));
};

const loginEmailChosenOperation = ops => opts => async (dispatch, getState) => {
	const { loginEmail } = validate(opts, ['loginEmail']);
	const wallet = getWallet(getState());
	if (!wallet) throw new Error('no wallet unlocked');
	const { moonPayService } = getGlobalContext();
	await moonPayService.updateSettings(wallet.id, {
		loginEmail
	});
	await dispatch(ops.setLoginEmail(loginEmail));
	await dispatch(ops.setAuthInfo(null));
};

const loadSettingsOperation = ops => opts => async (dispatch, getState) => {
	const wallet = getWallet(getState());
	if (!wallet) throw new Error('no wallet unlocked');
	const { moonPayService } = getGlobalContext();
	const settings = await moonPayService.getSettings(wallet.id);
	await dispatch(ops.setAgreedToTerms(!!settings.agreedToTerms));
	await dispatch(ops.setLoginEmail(settings.loginEmail || null));
	await dispatch(ops.setPreviousAuthentication(settings.authenticatedPreviously));
	await dispatch(ops.setSettingsLoaded(true));
};

const loadLimitsOperation = ops => () => async (dispatch, getState) => {
	const authInfo = selectAuthInfo(getState());
	const { moonPayService } = getGlobalContext();
	const limits = await moonPayService.getLimits(authInfo);
	await dispatch(ops.setLimits(limits));
};

const loadFilesOperation = ops => () => async (dispatch, getState) => {
	const authInfo = selectAuthInfo(getState());
	const { moonPayService } = getGlobalContext();
	const files = await moonPayService.listFiles(authInfo);
	await dispatch(ops.setFiles(files));
};

const submitKycDocumentsOperation = ops => () => async (dispatch, getState) => {
	try {
		await dispatch(ops.setKycError(null));
		if (!isAddressValid(getState())) {
			throw new Error('Your Address appears to be incomplete, please re-check');
		}
		if (!areKycRequirementsValid(getState())) {
			throw new Error('Please fill all required attributes');
		}
		await dispatch(ops.setKycSubmitting(false));
		const authInfo = selectAuthInfo(getState());
		const filledKycRequirements = selectFilledKycRequirements(getState());
		const { moonPayService } = getGlobalContext();
		await moonPayService.submitKycRequirements(filledKycRequirements, authInfo);
		await dispatch(ops.loadLimitsOperation());
		await dispatch(ops.loadCustomerOperation());
		await dispatch(ops.setKYCSubmitted(true));
	} catch (error) {
		log.error(error);
		let errorMessage = error.message;
		if (
			error.body &&
			error.body.message === `Invalid body, check 'errors' property for more info.`
		) {
			errorMessage += `: `;
			for (let key in error.body.errors[0].constraints) {
				errorMessage += error.body.errors[0].constraints[key] + ' ';
			}
		}
		await dispatch(ops.setKycError(errorMessage));
	} finally {
		await dispatch(ops.setKycSubmitting(false));
	}
};

const connectFlowOperation = ops => ({ cancel, complete }) => async (dispatch, getState) => {
	const identity = selectIdentity(getState());

	if (!identity) {
		return;
	}

	if (!identity.isSetupFinished) {
		await dispatch(push('/main/selfkeyId'));
		return;
	}

	const residencyAndNationalityAttributes = identitySelectors.selectAttributesByUrl(getState(), {
		identityId: identity.id,
		attributeTypeUrls: [NATIONALITY_ATTRIBUTE, RESIDENCY_ATTRIBUTE]
	});

	const missingProfileAttributes = residencyAndNationalityAttributes.length !== 2;
	if (missingProfileAttributes) {
		await dispatch(push('/main/moonpay/country-not-allowed'));
		return;
	}

	// TODO: blocked jurisdictions should be a config setting
	const isBlockedJurisdiction = residencyAndNationalityAttributes.some(
		attr => attr.data.value.country === 'US'
	);
	if (isBlockedJurisdiction) {
		await dispatch(push('/main/moonpay/country-not-allowed'));
		return;
	}

	await dispatch(ops.setAuthError(null));

	await dispatch(
		navigationFlowOperations.startFlowOperation({
			name: 'moonpay-connect',
			current: '/main/moonpay/loading',
			cancel,
			complete
		})
	);
};

const connectFlowNextStepOperation = ops => opt => async (dispatch, getState) => {
	if (!haveSettingsLoaded(getState())) {
		await dispatch(ops.loadSettingsOperation());
	}

	const agreedToTerms = hasAgreedToTerms(getState());
	if (!agreedToTerms) {
		await dispatch(
			navigationFlowOperations.navigateToStepOperation({
				current: '/main/moonpay/auth/terms',
				next: '/main/moonpay/loading'
			})
		);
		return;
	}

	if (!config.moonPayWidgetMode) {
		const serviceCheck = selectServiceCheck(getState());

		if (!serviceCheck.ipCheck) {
			await dispatch(ops.checkServiceAllowedOperation());
		}

		if (!isServiceAllowed(getState())) {
			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/auth/not-allowed',
					next: null
				})
			);
			return;
		}

		const authenticated = isAuthenticated(getState());

		if (!authenticated) {
			const loginEmail = getLoginEmail(getState());
			const authInProgress = isAuthInProgress(getState());

			if (!loginEmail) {
				await dispatch(
					navigationFlowOperations.navigateToStepOperation({
						current: '/main/moonpay/auth/choose-email',
						next: '/main/moonpay/loading'
					})
				);
				return;
			}
			if (authInProgress) {
				while (isAuthInProgress(getState())) {
					await sleep(500);
				}

				if (isEmailVerificationRequired(getState())) {
					await dispatch(
						navigationFlowOperations.navigateToStepOperation({
							current: '/main/moonpay/auth/verify-email',
							next: '/main/moonpay/loading'
						})
					);
					return;
				}

				if (!isAuthenticated(getState())) {
					await dispatch(
						navigationFlowOperations.navigateToStepOperation({
							current: '/main/moonpay/auth/error',
							next: '/main/moonpay/auth'
						})
					);
					return;
				}
				await dispatch(navigationFlowOperations.navigateCompleteOperation());
				return;
			}
			if (getAuthError(getState())) {
				await dispatch(
					navigationFlowOperations.navigateToStepOperation({
						current: '/main/moonpay/auth/error',
						next: '/main/moonpay/auth'
					})
				);
				return;
			}

			if (isEmailVerificationRequired(getState())) {
				await dispatch(
					navigationFlowOperations.navigateToStepOperation({
						current: '/main/moonpay/auth/verify-email',
						next: '/main/moonpay/loading'
					})
				);
				return;
			}

			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/auth',
					next: '/main/moonpay/loading'
				})
			);

			return;
		}
		await dispatch(ops.loadLimitsOperation());
		await dispatch(ops.loadCustomerOperation());
		await dispatch(ops.loadFilesOperation());

		const kycChecks = getKYCChecks(getState());
		const kycRequired = isKycRequired(getState());
		// const kycSubmitted = isKycSubmitted(getState());
		// const customer = getCustomer(getState());
		// const files = getFiles(getState());
		// const phoneVerificationRequired = isPhoneVerificationRequired(getState());
		// const b = getSelectedCountry(getState());
		// const a = getKYCRequirements(getState());

		const kycSent = Object.keys(kycChecks).reduce((acc, el) => {
			acc = acc && kycChecks[el];
			return acc;
		}, true);

		// if (kycRequired && !kycSubmitted && !customer.dateOfBirth) {
		if (kycRequired && !kycSent) {
			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/auth/kyc',
					next: '/main/moonpay/loading'
				})
			);
			return;
		}

		if (isPhoneVerificationRequired(getState())) {
			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/auth/verify-phone',
					next: '/main/moonpay/loading'
				})
			);
			return;
		}
	} else {
		const loginEmail = getLoginEmail(getState());

		if (!loginEmail) {
			await dispatch(
				navigationFlowOperations.navigateToStepOperation({
					current: '/main/moonpay/auth/choose-email',
					next: '/main/moonpay/loading'
				})
			);
			return;
		}
	}

	await dispatch(navigationFlowOperations.navigateCompleteOperation());
};

const loadCustomerOperation = ops => () => async (dispatch, getState) => {
	const authInfo = selectAuthInfo(getState());
	const { moonPayService } = getGlobalContext();
	const customer = await moonPayService.loadCustomer(authInfo);
	await dispatch(ops.setCustomer(customer));
};

const verifyPhoneOperation = ops => opt => async (dispatch, getState) => {
	const { moonPayService } = getGlobalContext();
	const authInfo = selectAuthInfo(getState());
	await moonPayService.verifyPhone(opt.securityCode, authInfo);
	await dispatch(ops.getLimits());
	await dispatch(ops.loadCustomerOperation());
};

const resendSMSOperation = ops => opt => async (dispatch, getState) => {
	const authInfo = selectAuthInfo(getState());
	const { moonPayService } = getGlobalContext();
	await moonPayService.resendSMS(opt.phone, authInfo);
};

const moonPayAuthSlice = createAliasedSlice({
	name: SLICE_NAME,
	initialState,
	reducers: {
		setAuthInfo(state, action) {
			state.authInfo = action.payload;
		},
		clearAuthInfo(state) {
			state.authInfo = null;
		},
		setLimits(state, action) {
			state.limits = action.payload;
		},
		setAgreedToTerms(state, action) {
			state.agreedToTerms = action.payload;
		},
		setLoginEmail(state, action) {
			state.loginEmail = action.payload;
		},
		setSettingsLoaded(state, action) {
			state.settingsLoaded = action.payload;
		},
		setPreviousAuthentication(state, action) {
			state.authenticatedPreviously = action.payload;
		},
		setAuthInProgress(state, action) {
			state.authInProgress = action.payload;
		},
		setAuthError(state, action) {
			state.authError = action.payload;
		},
		setKYCSubmitted(state, action) {
			state.KYCSubmitted = action.payload;
		},
		setServiceChecks(state, action) {
			if (action.payload === null) {
				state.isServiceAllowed = false;
				state.allowedCountries = [];
				state.customerCountries = [];
				state.ipCheck = null;
				return;
			}
			const serviceChecks = _.pick(action.payload, [
				'isServiceAllowed',
				'allowedCountries',
				'customerCountries',
				'ipCheck'
			]);

			_.merge(state, serviceChecks);
		},
		setSelectedAttributes(state, action) {
			state.selectedAttributes = action.payload;
		},
		setKycSubmitting(state, action) {
			state.kycSubmitting = action.payload;
		},
		setKycError(state, action) {
			state.kycError = action.payload;
		},
		setEmailVerificationRequired(state, action) {
			state.emailVerificationRequired = action.payload;
		},
		setCustomer(state, action) {
			state.customer = action.payload;
		},
		setFiles(state, action) {
			state.files = action.payload;
		}
	},
	aliasedOperations: {
		authOperation,
		agreeToTermsOperation,
		loginEmailChosenOperation,
		loadLimitsOperation,
		loadFilesOperation,
		connectFlowOperation,
		connectFlowNextStepOperation,
		loadSettingsOperation,
		checkServiceAllowedOperation,
		submitKycDocumentsOperation,
		authErrorOperation,
		loadCustomerOperation,
		verifyPhoneOperation,
		resendSMSOperation
	}
});

const { reducer, operations } = moonPayAuthSlice;

export { operations, selectors };

export default reducer;
