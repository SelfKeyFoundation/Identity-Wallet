import request from 'request-promise-native';
import config from 'common/config';
import jwt from 'jsonwebtoken';
import urljoin from 'url-join';
import { bufferFromDataUrl } from 'common/utils/document';
import { identityAttributes } from '../../common/identity/utils';
import { Logger } from 'common/logger';

const log = new Logger('relying-party');

const { userAgent } = config;

const DEFAULT_ORIGIN = 'IDW';

const CHALLENGE_ENDPOINT_NAME = '/auth/challenge';
const CHALLENGE_RESPONSE_ENDPOINT_NAME = '/auth/challenge-response';
const USERS_CREATE_ENDPOINT_NAME = '/users';
const USERS_TOKEN_ENDPOINT_NAME = '/users/token';
const USERS_FILE_ENDPOINT_NAME = '/users/file';
const KYC_TEMPLATES_LIST_ENDPOINT_NAME = '/templates';
const KYC_TEMPLATE_GET_ENDPOINT_NAME = '/templates/:id';
const KYC_APPLICATIONS_CREATE_ENDPOINT_NAME = '/applications';
const KYC_APPLICATIONS_UPDATE_ENDPOINT_NAME = '/applications/:id';
const KYC_APPLICATIONS_GET_ENDPOINT_NAME = '/applications/:id';
const KYC_APPLICATIONS_FILE_ENDPOINT_NAME = '/files';
const KYC_APPLICATIONS_PAYMENT_ENDPOINT_NAME = '/applications/:id/payments';
// const KYC_APPLICATIONS_LIST_ENDPOINT_NAME = '/applications';
const KYC_APPLICATIONS_CHAT_ENDPOINT_NAME = '/applications/:id/chat';
const KYC_APPLICATIONS_STATUS_ENDPOINT_NAME = '/applications/:id/change_status';
const KYC_APPLICATIONS_LIST_ENDPOINT_NAME =
	'/applications?fields=id,attributes,currentStatus,payments,questions,statusLog,statusName,template,createdAt&baseApplications=true&sort=-createdAt';
const KYC_USERS_GET_ENDPOINT_NAME = '/kyc-users/me';
const KYC_USERS_CREATE_ENDPOINT_NAME = '/kyc-users';
const KYC_CORPORATE_MEMBERS_ENDPOINT_NAME = '/applications/:applicationId/members';
const KYC_GET_ACCESS_TOKEN_ENDPOINT_NAME = '/auth/token';
const KYC_APPLICATIONS_ADD_ATTRIBUTES_ENDPOINT_NAME = '/applications/:id/attributes';

export class RelyingPartyError extends Error {
	constructor(conf) {
		super(conf.message);
		this.code = conf.code;
	}
}
export class RelyingPartyCtx {
	constructor(config, identity, token) {
		this.config = config;
		this.identity = identity;
		this.token = token;
	}
	mergeWithConfig() {}
	supportsDID() {
		return config.did !== false;
	}
	getOrigin() {
		return this.config.origin || DEFAULT_ORIGIN;
	}
	getEndpoint(name) {
		let rootEndpoint = this.getRootEndpoint();
		let endpoints = this.config.endpoints || {};
		let url = endpoints[name] || name;
		if (!url || !url.match(/^https?:/)) {
			url = urljoin(rootEndpoint, url);
		}
		return url;
	}
	getRootEndpoint() {
		let root = this.config.rootEndpoint;
		let url = (this.config.website || {}).url || '';
		if (!root.match(/^https?:/)) {
			root = urljoin(url, root);
		}
		return root;
	}
	hasEndpoint(endpoint, hasDefaultValue = false) {
		const { config } = this;
		if (!config.endpoints || !config.endpoints.hasOwnProperty(endpoint)) {
			return hasDefaultValue;
		}
		if (config.endpoints[endpoint] === false) {
			return false;
		}
		return true;
	}
	hasUserFileEndpoint() {
		return this.hasEndpoint(USERS_FILE_ENDPOINT_NAME, true);
	}
	hasKYCUserEndpoint() {
		return this.hasEndpoint(KYC_USERS_CREATE_ENDPOINT_NAME);
	}
}

export class RelyingPartyToken {
	constructor(algo, data, sig) {
		this.algo = algo;
		this.data = data;
		this.sig = sig;
	}
	static fromString(str) {
		let decoded = jwt.decode(str, { complete: true });
		return new RelyingPartyToken(decoded.header, decoded.payload, decoded.signature);
	}
	toString() {
		function base64url(buf) {
			return buf
				.toString('base64')
				.replace(/=/g, '')
				.replace(/\+/g, '-')
				.replace(/\//g, '_');
		}
		const encodedHeader = base64url(Buffer.from(JSON.stringify(this.algo), 'utf8'));
		const encodedPayload = base64url(Buffer.from(JSON.stringify(this.data), 'utf8'));

		return `${encodedHeader}.${encodedPayload}.${this.sig}`;
	}

	hasExpired() {
		const ts = Math.floor(Date.now() / 1000);
		return ts > this.data.exp;
	}
}

export class RelyingPartyRest {
	static userAgent = userAgent;
	static getAuthorizationHeader(token) {
		return `Bearer ${token}`;
	}
	static isSecure(url) {
		if (
			url.startsWith('https://credentials.keyfi.com') ||
			url.startsWith('https://korporatio.instance.kyc-chain.com')
		) {
			return false;
		}
		return true;
	}
	static async getChallenge(ctx) {
		let url = ctx.getEndpoint(CHALLENGE_ENDPOINT_NAME);
		const did = ctx.supportsDID()
			? ctx.identity.getDidWithParams()
			: await ctx.identity.publicKey;
		url = urljoin(url, did);
		return request.get({
			url,
			headers: { 'User-Agent': this.userAgent, Origin: ctx.getOrigin() },
			json: true,
			rejectUnauthorized: false
		});
	}
	static postChallengeReply(ctx, challenge, signature, keyId) {
		let url = ctx.hasEndpoint(CHALLENGE_RESPONSE_ENDPOINT_NAME)
			? ctx.getEndpoint(CHALLENGE_RESPONSE_ENDPOINT_NAME)
			: ctx.getEndpoint(CHALLENGE_ENDPOINT_NAME);
		const body = {};
		if (ctx.supportsDID()) {
			body.signature = { value: signature, keyId };
		} else {
			body.signature = signature;
		}
		return request.post({
			url,
			body,
			headers: {
				Authorization: this.getAuthorizationHeader(challenge),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true,
			rejectUnauthorized: false
		});
	}
	static getUserToken(ctx, meta) {
		if (!ctx.token) throw new RelyingPartyError({ code: 401, message: 'not authorized' });
		let token = ctx.token.toString();
		let url = ctx.getEndpoint(USERS_TOKEN_ENDPOINT_NAME);
		let qs;
		if (meta) {
			qs = { meta: JSON.stringify(meta) };
		}
		return request.get({
			url,
			headers: {
				Authorization: this.getAuthorizationHeader(token),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			qs,
			json: true,
			rejectUnauthorized: false
		});
	}
	static async uploadUserFile(ctx, doc) {
		let url = ctx.getEndpoint(USERS_FILE_ENDPOINT_NAME);
		if (!ctx.token) throw new Error('Session is not established');
		let formData = {
			document: {
				value: doc.buffer,
				options: {
					contentType: doc.mimeType,
					filename: doc.name || 'document'
				}
			}
		};
		return request.post({
			url,
			formData,
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true,
			rejectUnauthorized: false
		});
	}
	static async createUser(ctx, attributes, documents = [], meta = {}) {
		if (!ctx.token) throw new RelyingPartyError({ code: 401, message: 'not authorized' });
		let url = ctx.getEndpoint(USERS_CREATE_ENDPOINT_NAME);
		if (ctx.hasUserFileEndpoint()) {
			return request.post({
				url,
				body: { attributes, meta },
				headers: {
					Authorization: this.getAuthorizationHeader(ctx.token.toString()),
					'User-Agent': this.userAgent,
					Origin: ctx.getOrigin()
				},
				json: true,
				rejectUnauthorized: false
			});
		}
		let formData = documents.reduce((acc, curr) => {
			let key = `$document-${curr.id}`;
			acc[key] = {
				value: curr.buffer,
				options: {
					contentType: curr.mimeType,
					filename: curr.name || `document-${curr.id}`,
					knownLength: curr.size
				}
			};
			return acc;
		}, {});
		formData.attributes = {
			value: JSON.stringify(attributes),
			options: { contentType: 'application/json' }
		};
		formData.meta = {
			value: JSON.stringify(meta),
			options: { contentType: 'application/json' }
		};
		return request.post({
			url,
			formData,
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			}
		});
	}
	static listKYCTemplates(ctx) {
		let url = ctx.getEndpoint(KYC_TEMPLATES_LIST_ENDPOINT_NAME);
		return request.get({
			url,
			headers: {
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true,
			rejectUnauthorized: false
		});
	}
	static getKYCTemplate(ctx, id) {
		let url = ctx.getEndpoint(KYC_TEMPLATE_GET_ENDPOINT_NAME);
		url = url.replace(':id', id);
		log.debug(`[getKYCTemplate] GET ${url}`);
		return request.get({
			url,
			headers: {
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true,
			rejectUnauthorized: false
		});
	}

	static addAdditionalTemplateRequirements(ctx, applicationId, attributesArray) {
		let url = ctx.getEndpoint(KYC_APPLICATIONS_ADD_ATTRIBUTES_ENDPOINT_NAME);
		url = url.replace(':id', applicationId);

		const attributes = attributesArray.map(attr => {
			return {
				jsonSchema: {
					title: 'Document to notarize'
				},
				schemaId: attr
			};
		});

		if (!ctx.token) {
			throw new Error('Session is not established');
		}
		log.debug(`[addAdditionalTemplateRequirements] POST ${url}`);
		attributes.forEach(attr =>
			request.post({
				url,
				body: attr,
				headers: {
					Authorization: this.getAuthorizationHeader(ctx.token.toString()),
					'User-Agent': this.userAgent,
					Origin: ctx.getOrigin()
				},
				json: true,
				rejectUnauthorized: false
			})
		);
	}

	static createKYCApplication(ctx, templateId, attributes) {
		let url = ctx.getEndpoint(KYC_APPLICATIONS_CREATE_ENDPOINT_NAME);
		log.debug(`[createKYCApplication] POST ${url}`);
		if (!ctx.token) throw new Error('Session is not established');
		return request.post({
			url,
			body: { attributes, templateId },
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true,
			rejectUnauthorized: false
		});
	}

	static createKYCMemberApplication(
		ctx,
		applicationId,
		memberRoles,
		templateId,
		attributes,
		shares = 0
	) {
		let url = ctx.getEndpoint(KYC_CORPORATE_MEMBERS_ENDPOINT_NAME);
		if (!ctx.token) throw new Error('Session is not established');
		memberRoles = (memberRoles || []).map(r => r.replace(/-/, '_'));
		url = url.replace(':applicationId', applicationId);
		log.debug(`[createKYCMemberApplication] POST ${url}`);
		return request.post({
			url,
			body: {
				application: { attributes, templateId },
				memberRoles,
				shares
			},
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true,
			rejectUnauthorized: false
		});
	}

	static updateKYCApplication(ctx, data, applicationId = null) {
		let url = ctx.getEndpoint(KYC_APPLICATIONS_UPDATE_ENDPOINT_NAME);
		if (!ctx.token) throw new Error('Session is not established');
		applicationId = applicationId || data.id;
		url = url.replace(':id', applicationId);
		log.debug(`[updateKYCApplication] PATCH ${url}`);
		return request.patch({
			url,
			body: data,
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true,
			rejectUnauthorized: false
		});
	}
	static updateKYCApplicationPayment(ctx, applicationId, transactionHash) {
		let url = ctx.getEndpoint(KYC_APPLICATIONS_PAYMENT_ENDPOINT_NAME);
		url = url.replace(':id', applicationId);
		log.debug(`[updateKYCApplicationPayment] POST ${url} : ${transactionHash}`);
		if (!ctx.token) throw new Error('Session is not established');
		return request.post({
			url,
			body: { transactionHash },
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true,
			rejectUnauthorized: false
		});
	}

	static async getKYCApplicationChat(ctx, applicationId) {
		let url = ctx.getEndpoint(KYC_APPLICATIONS_CHAT_ENDPOINT_NAME);
		url = url.replace(':id', applicationId);
		const chatResponse = await request.get({
			url,
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true,
			rejectUnauthorized: false
		});
		return chatResponse;
	}

	static postKYCApplicationChat(ctx, applicationId, message) {
		let url = ctx.getEndpoint(KYC_APPLICATIONS_CHAT_ENDPOINT_NAME);
		url = url.replace(':id', applicationId);
		log.debug(`[postKYCApplicationChat] POST ${url} : ${message}`);
		return request.post({
			url,
			body: { message },
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true,
			rejectUnauthorized: false
		});
	}

	static updateKYCApplicationStatus(ctx, applicationId, code, note) {
		let url = ctx.getEndpoint(KYC_APPLICATIONS_STATUS_ENDPOINT_NAME);
		url = url.replace(':id', applicationId);
		log.debug(`[updateKYCApplicationStatus] POST ${url} : ${code} ${note}`);

		const body = { code };

		if (note) {
			body.note = note;
		}
		if (!ctx.token) throw new Error('Session is not established');
		return request.post({
			url,
			body,
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true,
			rejectUnauthorized: false
		});
	}

	static async listKYCApplications(ctx) {
		let url = ctx.getEndpoint(KYC_APPLICATIONS_LIST_ENDPOINT_NAME);
		log.debug(`[listKYCApplications] GET ${url}`);
		if (!ctx.token) throw new Error('Session is not established');
		try {
			let applications = await request.get({
				url,
				headers: {
					Authorization: this.getAuthorizationHeader(ctx.token.toString()),
					'User-Agent': this.userAgent,
					Origin: ctx.getOrigin()
				},
				json: true,
				rejectUnauthorized: false
			});
			return applications;
		} catch (error) {
			if (error.statusCode === 404) {
				return [];
			}
			throw error;
		}
	}

	static async getKYCUser(ctx) {
		let url = ctx.getEndpoint(KYC_USERS_GET_ENDPOINT_NAME);
		if (!ctx.token) throw new Error('Session is not established');
		try {
			const user = await request.get({
				url,
				headers: {
					Authorization: this.getAuthorizationHeader(ctx.token.toString()),
					'User-Agent': this.userAgent,
					Origin: ctx.getOrigin()
				},
				json: true,
				rejectUnauthorized: false
			});
			return user;
		} catch (error) {
			if (error.statusCode === 404) {
				return null;
			}
			throw error;
		}
	}

	static createKYCUser(ctx, user) {
		let url = ctx.getEndpoint(KYC_USERS_CREATE_ENDPOINT_NAME);
		if (!ctx.token) throw new Error('Session is not established');
		return request.post({
			url,
			body: user,
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true,
			rejectUnauthorized: false
		});
	}

	static getKYCApplication(ctx, id) {
		let url = ctx.getEndpoint(KYC_APPLICATIONS_GET_ENDPOINT_NAME);
		url = url.replace(':id', id);
		if (!ctx.token) throw new Error('Session is not established');
		return request.get({
			url,
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true,
			rejectUnauthorized: false
		});
	}

	static uploadKYCApplicationFile(ctx, doc) {
		let url = ctx.getEndpoint(KYC_APPLICATIONS_FILE_ENDPOINT_NAME);
		if (!ctx.token) throw new Error('Session is not established');
		let formData = {
			document: {
				value: doc.buffer,
				options: {
					contentType: doc.mimeType,
					filename: doc.name || 'document'
				}
			}
		};
		return request.post({
			url,
			formData,
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true,
			rejectUnauthorized: false
		});
	}
	static getAccessToken(ctx) {
		let url = ctx.getEndpoint(KYC_GET_ACCESS_TOKEN_ENDPOINT_NAME);
		if (!ctx.token) throw new Error('Session is not established');
		return request.get({
			url,
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true,
			rejectUnauthorized: false
		});
	}
}

export class RelyingPartySession {
	constructor(config, identity) {
		this.ctx = new RelyingPartyCtx(config, identity);
		this.identity = identity;
	}
	isActive() {
		if (!this.ctx.token) return false;
		return !this.ctx.token.hasExpired();
	}
	async establish() {
		if (this.isActive()) return this.ctx.token;
		try {
			let challenge = await RelyingPartyRest.getChallenge(this.ctx);
			let challengeToken = RelyingPartyToken.fromString(challenge.jwt);
			let signature = await this.identity.genSignatureForMessage(
				challengeToken.data.challenge || challengeToken.data.nonce
			);
			let challengeReply = await RelyingPartyRest.postChallengeReply(
				this.ctx,
				challenge.jwt,
				signature,
				this.identity.getKeyId()
			);
			let token = RelyingPartyToken.fromString(challengeReply.jwt);
			this.ctx.token = token;

			if (this.ctx.hasKYCUserEndpoint()) {
				this.ctx.user = await this.getKYCUser();
			}

			return token;
		} catch (error) {
			log.error('Error establishing session %s', error);
			throw error;
		}
	}
	getUserLoginPayload(meta = {}) {
		return RelyingPartyRest.getUserToken(this.ctx, meta);
	}

	async createUser(attributes = [], meta = {}) {
		if (this.ctx.hasUserFileEndpoint()) {
			attributes = await Promise.all(
				attributes.map(async attr => {
					const attrDocs = await Promise.all(
						attr.documents.map(async doc => {
							if (doc.content) {
								doc.buffer = bufferFromDataUrl(doc.content);
							}
							const res = await RelyingPartyRest.uploadUserFile(this.ctx, doc);
							let newDoc = { ...doc };
							delete newDoc.buffer;
							newDoc.content = res.id;
							return newDoc;
						})
					);
					const data = (attr.data && attr.data.value ? attr.data.value : attr.data) || {};
					const { value } = identityAttributes.denormalizeDocumentsSchema(
						attr.schema,
						data,
						attrDocs
					);
					return { ...attr, data: value, documents: undefined };
				})
			);
			return RelyingPartyRest.createUser(this.ctx, attributes, undefined, meta);
		}
		let documents = attributes.reduce((acc, curr) => {
			acc = acc.concat(curr.documents);
			return acc;
		}, []);
		attributes = attributes.map(attr => {
			attr = { ...attr, documents: (attr.documents || []).map(doc => doc.id) };
			return attr;
		});
		let attributesData = attributes.map(attr => ({
			id: attr.id,
			schemaId: attr.schemaId,
			data: attr.data,
			schema: attr.schema,
			documents: attr.documents
		}));
		return RelyingPartyRest.createUser(this.ctx, attributesData, documents, meta);
	}

	listKYCApplications() {
		return RelyingPartyRest.listKYCApplications(this.ctx);
	}

	getKYCApplication(id) {
		return RelyingPartyRest.getKYCApplication(this.ctx, id);
	}

	getKYCUser() {
		return RelyingPartyRest.getKYCUser(this.ctx);
	}

	async createKYCUser(user) {
		try {
			const newUser = await RelyingPartyRest.createKYCUser(this.ctx, user);
			this.ctx.user = newUser;
			return newUser;
		} catch (error) {
			log.error(error);
			throw error;
		}
	}

	async createKYCApplication(templateId, attributes) {
		// ignore empty non-required attributes
		let filteredAttributes = attributes.filter(
			attr => attr.data || attr.documents || attr.required
		);
		filteredAttributes = await Promise.all(
			filteredAttributes.map(async attr => {
				const attrDocs = await Promise.all(
					attr.documents.map(async doc => {
						if (doc.content) {
							doc.buffer = bufferFromDataUrl(doc.content);
						}
						const res = await RelyingPartyRest.uploadKYCApplicationFile(this.ctx, doc);
						let newDoc = { ...doc };
						delete newDoc.buffer;
						newDoc.content = res.id;
						return newDoc;
					})
				);
				const { value } = identityAttributes.denormalizeDocumentsSchema(
					attr.schema,
					(attr.data || {}).value,
					attrDocs
				);
				return { ...attr, data: value, documents: undefined };
			})
		);
		return RelyingPartyRest.createKYCApplication(this.ctx, templateId, filteredAttributes);
	}

	async createKYCMemberApplication(applicationId, memberRoles, templateId, attributes, shares) {
		// ignore empty non-required attributes
		let filteredAttributes = attributes.filter(
			attr => attr.data || attr.documents || attr.required
		);
		filteredAttributes = await Promise.all(
			filteredAttributes.map(async attr => {
				const attrDocs = await Promise.all(
					attr.documents.map(async doc => {
						if (doc.content) {
							doc.buffer = bufferFromDataUrl(doc.content);
						}
						const res = await RelyingPartyRest.uploadKYCApplicationFile(this.ctx, doc);
						let newDoc = { ...doc };
						delete newDoc.buffer;
						newDoc.content = res.id;
						return newDoc;
					})
				);
				const { value } = identityAttributes.denormalizeDocumentsSchema(
					attr.schema,
					(attr.data || {}).value,
					attrDocs
				);
				return { ...attr, data: value, documents: undefined };
			})
		);
		return RelyingPartyRest.createKYCMemberApplication(
			this.ctx,
			applicationId,
			memberRoles,
			templateId,
			filteredAttributes,
			shares
		);
	}

	updateKYCApplication(application) {
		return RelyingPartyRest.updateKYCApplication(this.ctx, application);
	}

	updateKYCApplicationPayment(applicationId, transactionHash) {
		return RelyingPartyRest.updateKYCApplicationPayment(
			this.ctx,
			applicationId,
			transactionHash
		);
	}

	getKYCApplicationChat(applicationId) {
		return RelyingPartyRest.getKYCApplicationChat(this.ctx, applicationId);
	}

	postKYCApplicationChat(applicationId, message) {
		return RelyingPartyRest.postKYCApplicationChat(this.ctx, applicationId, message);
	}

	updateKYCApplicationStatus(applicationId, code, note) {
		return RelyingPartyRest.updateKYCApplicationStatus(this.ctx, applicationId, code, note);
	}

	listKYCTemplates() {
		return RelyingPartyRest.listKYCTemplates(this.ctx);
	}

	getKYCTemplate(id) {
		return RelyingPartyRest.getKYCTemplate(this.ctx, id);
	}

	getAccessToken() {
		return RelyingPartyRest.getAccessToken(this.ctx);
	}

	addAdditionalTemplateRequirements(applicationId, attributes) {
		return RelyingPartyRest.addAdditionalTemplateRequirements(
			this.ctx,
			applicationId,
			attributes
		);
	}

	async uploadAdditionalFiles(applicationId, files) {
		// Prepare additional documents to upload
		const attributes = await Promise.all(
			files.map(async attr => {
				const attrDocs = await Promise.all(
					attr.documents.map(async doc => {
						if (doc.content) {
							doc.buffer = bufferFromDataUrl(doc.content);
						}
						const res = await RelyingPartyRest.uploadKYCApplicationFile(this.ctx, doc);
						let newDoc = { ...doc };
						delete newDoc.buffer;
						newDoc.content = res.id;
						return newDoc;
					})
				);
				attr.schema = attr.type.content;

				const { value } = identityAttributes.denormalizeDocumentsSchema(
					attr.schema,
					(attr.data || {}).value,
					attrDocs
				);

				return { ...attr, data: value, documents: undefined };
			})
		);

		// Refresh application object to get the new file requirements
		const application = await RelyingPartyRest.getKYCApplication(this.ctx, applicationId);
		const applicationAttributes = { ...application.attributes };

		// Prepare schema for upload
		const schema = attributes.map(attr => {
			const id = Object.keys(applicationAttributes).find(key => {
				const a = applicationAttributes[key];
				return a.isAdditional && a.schemaId === attr.type.content.$id;
			});
			attr.id = id;
			attr.schemaId = applicationAttributes[id].schemaId;
			// Clean up object
			delete applicationAttributes[id];
			delete attr['type'];
			delete attr['defaultRepository'];
			delete attr['defaultUiSchema'];
			return attr;
		});

		return RelyingPartyRest.updateKYCApplication(
			this.ctx,
			{ attributes: schema },
			applicationId
		);
	}
}

export default RelyingPartySession;
