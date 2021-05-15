import crypto from 'crypto';
import electron from 'electron';
import _ from 'lodash';
import { validate } from 'parameter-validator';
import { MoonPayApi } from './moonpay-api';
import isoCountries from 'i18n-iso-countries';
import moment from 'moment';
import { bufferFromDataUrl } from 'common/utils/document';
import {
	COUNTRY_ATTRIBUTE,
	FIRST_NAME_ATTRIBUTE,
	LAST_NAME_ATTRIBUTE,
	PHONE_ATTRIBUTE,
	ADDRESS_ATTRIBUTE
} from 'common/identity/constants';

export class MoonPayService {
	constructor({ config, walletService, store }) {
		this.config = config;
		this.walletService = walletService;
		this.endpoint = config.moonPayApiEndpoint;
		this.widgetUrl = config.moonPayWidgetUrl;
		this.apiKey = config.moonPayApiKey;
		this.store = store;
	}

	handleAuthError(error) {
		const { moonPayOperations } = require('common/moonpay/auth');
		this.store.dispatch(moonPayOperations.authErrorOperation(error));
		throw error;
	}

	async getSettings(walletId) {
		const settings = await this.walletService.getWalletSettings(walletId);
		return {
			agreedToTerms: settings.moonPayTermsAccepted,
			loginEmail: settings.moonPayLogin,
			authenticatedPreviously: settings.moonPayPreviousAuth
		};
	}

	async updateSettings(walletId, opts) {
		opts = _.pick(opts, ['loginEmail', 'agreedToTerms', 'authenticatedPreviously']);
		const settings = {};
		if (opts.loginEmail) {
			settings.moonPayLogin = opts.loginEmail;
		}
		if (opts.agreedToTerms) {
			settings.moonPayTermsAccepted = opts.agreedToTerms;
		}
		if (opts.authenticatedPreviously) {
			settings.moonPayPreviousAuth = opts.authenticatedPreviously;
		}
		if (!_.isEmpty(settings)) {
			await this.walletService.updateWalletSettings(walletId, settings);
		}
		return this.getSettings(walletId);
	}

	getApi(loginInfo = null) {
		return new MoonPayApi({
			endpoint: this.endpoint,
			apiKey: this.apiKey,
			loginInfo,
			authServiceCb: this.handleAuthError.bind(this)
		});
	}

	getWidgetApi() {
		return new MoonPayApi({
			endpoint: this.config.moonPayWidgetApiEndpoint,
			apiKey: this.apiKey,
			authServiceCb: this.handleAuthError.bind(this)
		});
	}

	async checkServiceAvailability(countries = []) {
		countries = countries
			.map(c => c.data.value.country)
			.map(c => isoCountries.alpha2ToAlpha3(c));

		const api = this.getApi();

		const ipCheck = await api.getIpAddress();
		ipCheck.name = isoCountries.getName(ipCheck.alpha3, 'en', { select: 'official' });

		const remoteCountries = await api.listCountries();
		const customerCountries = countries.map(c => {
			const country = remoteCountries.find(rc => rc.alpha3 === c);

			if (country) {
				return country;
			}

			return {
				alpha2: isoCountries.alpha3ToAlpha2(c),
				alpha3: c,
				isBuyAllowed: false,
				isSellAllowed: false,
				isLightKycAllowed: false,
				name: isoCountries.getName(c, 'en', { select: 'official' }),
				supportedDocuments: [],
				isAllowed: false
			};
		});
		const allowedCountries = customerCountries.filter(c => c.isAllowed);

		const isServiceAllowed = allowedCountries.length > 0 || ipCheck.isAllowed;

		return {
			ipCheck,
			allowedCountries,
			customerCountries,
			isServiceAllowed
		};
	}

	async loginWithEmail(opt) {
		const auth = validate(opt, ['email']);
		if (opt.securityCode) {
			auth.securityCode = opt.securityCode;
		}

		return this.getApi().loginWithEmail(auth);
	}

	async auth(identity, email) {
		validate({ identity, email }, ['identity', 'email']);
		const signer = async msg => {
			const signature = await identity.genSignatureForMessage(msg);
			return signature;
		};
		const authData = { email, walletAddress: identity.address };
		return this.getApi().establishSession(authData, signer);
	}

	static ATTRIBUTE_TYPE_TO_CUSTOMER_FIELD_MAP = {
		[FIRST_NAME_ATTRIBUTE]: {
			field: 'firstName',
			isDocument: false
		},
		[LAST_NAME_ATTRIBUTE]: {
			field: 'lastName',
			isDocument: false
		},
		[PHONE_ATTRIBUTE]: {
			field: 'phoneNumber',
			isDocument: false
		},
		[ADDRESS_ATTRIBUTE]: {
			field: 'address',
			isDocument: false
		},
		[COUNTRY_ATTRIBUTE]: {
			field: 'country',
			isDocument: false
		},
		'http://platform.selfkey.org/schema/attribute/date-of-birth.json': {
			field: 'dateOfBirth',
			isDocument: false
		},
		'http://platform.selfkey.org/schema/attribute/passport.json': {
			field: 'passport',
			isDocument: true
		},
		'http://platform.selfkey.org/schema/attribute/national-id.json': {
			field: 'national_identity_card',
			isDocument: true
		},
		'http://platform.selfkey.org/schema/attribute/drivers-license.json': {
			field: 'driving_licence',
			isDocument: true
		},
		'http://platform.selfkey.org/schema/attribute/utility-bill.json': {
			field: 'proof_of_address',
			isDocument: true
		},
		'http://platform.selfkey.org/schema/attribute/bank-statement.json': {
			field: 'proof_of_address',
			isDocument: true
		}
	};

	async submitKycRequirements(kyc, loginInfo) {
		const { customerInfo, documents } = kyc.reduce(
			(acc, curr) => {
				const { attribute } = curr;

				if (!attribute.type) {
					return acc;
				}
				const fieldType = this.constructor.ATTRIBUTE_TYPE_TO_CUSTOMER_FIELD_MAP[
					attribute.type.url
				];

				if (!fieldType) return acc;

				let { value } = attribute.data;

				if (!fieldType.isDocument) {
					if (fieldType.field === 'address') {
						acc.customerInfo.address = acc.customerInfo.address || {};
						acc.customerInfo.address = {
							...acc.customerInfo.address,
							street: value.address_line_1 || null,
							subStreet: value.address_line_2 || null,
							town: value.city || null,
							postCode: value.postalcode || null,
							state: value.province || null
						};
						return acc;
					}
					if (fieldType.field === 'country') {
						acc.customerInfo.address = acc.customerInfo.address || {};
						acc.customerInfo.address.country = isoCountries.alpha2ToAlpha3(
							value.country
						);
						return acc;
					}
					if (fieldType.field === 'dateOfBirth') {
						acc.customerInfo.dateOfBirth = moment.utc(value).toISOString();
						return acc;
					}
					acc.customerInfo[fieldType.field] = value;
					return acc;
				}
				const getImage = (image, documents, type, side) => {
					const id = +image.replace('$document-', '');
					const doc = documents.find(d => d.id === id);
					if (!doc) {
						return null;
					}
					return {
						file: bufferFromDataUrl(doc.content),
						fileType: doc.mimeType,
						type,
						side
					};
				};
				if (['driving_licence', 'national_identity_card'].includes(fieldType.field)) {
					acc.documents.push(
						getImage(value.front, attribute.documents, fieldType.field, 'front')
					);
					acc.documents.push(
						getImage(value.back, attribute.documents, fieldType.field, 'back')
					);
					if (value.selfie) {
						acc.documents.push(
							getImage(value.selfie.image, attribute.documents, fieldType.field)
						);
					}
					return acc;
				}
				if (fieldType.field === 'passport') {
					acc.documents.push(getImage(value.image, attribute.documents, fieldType.field));
					if (value.selfie) {
						acc.documents.push(
							getImage(value.selfie.image, attribute.documents, 'selfie')
						);
					}
					return acc;
				}
				if (fieldType.field === 'passport') {
					acc.documents.push(getImage(value.image, attribute.documents, fieldType.field));
					if (value.selfie) {
						acc.documents.push(
							getImage(value.selfie.image, attribute.documents, 'selfie')
						);
					}
					return acc;
				}
				if (fieldType.field === 'proof_of_address') {
					acc.documents.push(
						getImage(value.images[0], attribute.documents, fieldType.field)
					);
					return acc;
				}
			},
			{
				customerInfo: {},
				documents: []
			}
		);
		const api = this.getApi(loginInfo);
		const customer = await api.updateCustomer(customerInfo);
		for (let doc of documents) {
			await api.uploadFile({ ...doc, country: customerInfo.address.country });
		}
		return customer;
	}

	async getLimits(auth) {
		return this.getApi(auth).getLimits();
	}

	async listFiles(auth) {
		return this.getApi(auth).listFiles();
	}

	loadCustomer(auth) {
		return this.getApi(auth).getCustomer();
	}

	async verifyPhone(verificationCode, auth) {
		await this.getApi(auth).verifyPhone({ verificationCode });
	}

	async resendSMS(phoneNumber, auth) {
		await this.getApi(auth).updateCustomer({ phoneNumber: null });
		await this.getApi(auth).updateCustomer({ phoneNumber });
	}

	async getQuote({ auth, baseCurrencyCode, baseAmount, currencyCode = 'KEY' }) {
		const quote = await this.getApi(auth).getQuote({
			baseCurrencyCode,
			baseCurrencyAmount: baseAmount,
			currencyCode,
			areFeesIncluded: true
		});
		if (quote.error) {
			this.handleQuoteError(quote.message);
			return false;
		}
		return quote;
	}

	handleQuoteError(error) {
		const { moonPayOperations } = require('common/moonpay');
		this.store.dispatch(moonPayOperations.quoteErrorOperation(error));
	}

	async getCreditCards({ auth }) {
		const cards = await this.getApi(auth).listCards();
		return cards;
	}

	async addPaymentMethod({ number, expiryDate, cvc, billingAddress, auth }) {
		const token = await this.getApi(auth).createToken({
			number,
			expiryDate,
			cvc,
			billingAddress
		});
		if (token.error) {
			this.handleQuoteError(token.message);
			return false;
		}
		const card = await this.getApi(auth).createCard({ tokenId: token.id });
		if (card.error) {
			this.handleQuoteError(card.message);
			return false;
		}
		return card;
	}

	async createCardTransaction(opt) {
		const { auth } = opt;
		const transaction = await this.getApi(auth).createCardTransaction(opt);
		if (transaction.error) {
			this.handleQuoteError(transaction.message);
			return false;
		}
		return transaction;
	}

	async getTransaction(opt) {
		const transaction = await this.getWidgetApi().getTransaction(opt);
		if (transaction.error) {
			this.handleQuoteError(transaction.message);
			return false;
		}
		return transaction;
	}

	async listTransactions(opt) {
		const { auth } = opt;
		const transactions = await this.getApi(auth).listTransactions(opt);
		if (transactions.error) {
			this.handleQuoteError(transactions.message);
			return false;
		}
		return transactions;
	}

	async listCurrencies(opt) {
		const { auth } = opt;
		const currencies = await this.getApi(auth).listCurrencies(opt);
		if (currencies.error) {
			this.handleQuoteError(currencies.message);
			return false;
		}
		return currencies;
	}

	redirectTo3dSecure(transaction) {
		if (
			!transaction ||
			!transaction.redirectUrl ||
			transaction.status !== 'waitingAuthorization'
		) {
			return;
		}

		var authWindow = new electron.BrowserWindow({
			width: 800,
			height: 600,
			show: false,
			'node-integration': false,
			'web-security': false
		});

		authWindow.loadURL(transaction.redirectUrl);
		authWindow.show();
		/*
		// 'will-navigate' is an event emitted when the window.location changes
		// newUrl should contain the tokens you need
		authWindow.webContents.on('will-navigate', (event, newUrl) => {
			const { moonPayOperations } = require('common/moonpay');
			this.store.dispatch(moonPayOperations.setIsAuthenticating3dSecure(false));
		});
		*/

		authWindow.on('closed', () => {
			authWindow = null;
			const { moonPayOperations } = require('common/moonpay');
			this.store.dispatch(moonPayOperations.completed3dSecureOperation());
		});
	}

	openWidget({ address, email, key, secret }) {
		const { moonPayOperations } = require('common/moonpay');
		var widgetWindow = new electron.BrowserWindow({
			width: 800,
			height: 700,
			show: false,
			'node-integration': false,
			'web-security': true
		});

		const url = `${this.widgetUrl}?apiKey=${key}&currencyCode=key&email=${encodeURIComponent(
			email
		)}&walletAddress=${address}&showWalletAddressForm=true&redirectURL=${encodeURIComponent(
			`https://localhost`
		)}`;

		const signature = crypto
			.createHmac('sha256', secret)
			.update(new URL(url).search)
			.digest('base64');

		const urlWithSignature = `${url}&signature=${encodeURIComponent(signature)}`;

		widgetWindow.loadURL(urlWithSignature);
		widgetWindow.show();

		const loadTransactionFromUrl = url => {
			const urlObject = new URL(url);
			const searchParams = new URLSearchParams(urlObject.search);
			if (searchParams.has('transactionId')) {
				const transactionId = searchParams.get('transactionId');
				this.store.dispatch(moonPayOperations.loadTransaction(transactionId));
			}
		};

		widgetWindow.webContents.on('will-navigate', (event, url) => {
			if (url.startsWith('https://localhost')) {
				loadTransactionFromUrl(url);
			}
			event.preventDefault();
			widgetWindow.close();
		});

		widgetWindow.webContents.on(
			'new-window',
			(
				event,
				url,
				frameName,
				disposition,
				options,
				additionalFeatures,
				referrer,
				postBody
			) => {
				if (url.startsWith('https://localhost')) {
					loadTransactionFromUrl(url);
					widgetWindow.close();
				} else {
					require('electron').shell.openExternal(url);
				}
				event.preventDefault();
			}
		);

		widgetWindow.webContents.on('will-redirect', (event, url) => {
			if (url.startsWith('https://localhost')) {
				loadTransactionFromUrl(url);
				widgetWindow.close();
			} else {
				require('electron').shell.openExternal(url);
			}
			event.preventDefault();
			widgetWindow.close();
		});

		widgetWindow.on('closed', e => {
			widgetWindow = null;
		});
	}
}

export default MoonPayService;
