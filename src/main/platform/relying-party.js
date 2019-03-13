import request from 'request-promise-native';
import config from 'common/config';
import jwt from 'jsonwebtoken';
import urljoin from 'url-join';
import { bufferFromDataUrl } from 'common/utils/document';
import { identityAttributes } from '../../common/identity/utils';
import { Logger } from 'common/logger';

const log = new Logger('relying-party');

const { userAgent } = config;
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
	getOrigin() {
		return this.config.origin || 'IDW';
	}
	getEndpoint(name) {
		let rootEndpoint = this.getRootEndpoint();
		let endpoints = this.config.endpoints || {};
		let url = endpoints[name];
		if (!url) {
			url = urljoin(rootEndpoint, name);
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
	static async getChallenge(ctx) {
		let url = ctx.getEndpoint('auth/challenge');
		const publicKey = await ctx.identity.publicKey;
		url = urljoin(url, `0x${publicKey.replace('0x', '')}`);
		return request.get({
			url,
			headers: { 'User-Agent': this.userAgent, Origin: ctx.getOrigin() },
			json: true
		});
	}
	static postChallengeReply(ctx, challenge, signature) {
		let url = ctx.getEndpoint('auth/challenge');
		return request.post({
			url,
			body: { signature },
			headers: {
				Authorization: this.getAuthorizationHeader(challenge),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true
		});
	}
	static getUserToken(ctx) {
		if (!ctx.token) throw new RelyingPartyError({ code: 401, message: 'not authorized' });
		let token = ctx.token.toString();
		let url = ctx.getEndpoint('auth/token');
		return request.get({
			url,
			headers: {
				Authorization: this.getAuthorizationHeader(token),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true
		});
	}
	static createUser(ctx, attributes, documents = []) {
		if (!ctx.token) throw new RelyingPartyError({ code: 401, message: 'not authorized' });
		let url = ctx.getEndpoint('users');
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
		let url = ctx.getEndpoint('/templates');
		return request.get({
			url,
			headers: {
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true
		});
	}
	static getKYCTemplate(ctx, id) {
		let url = ctx.getEndpoint('/templates/:id');
		url = url.replace(':id', id);
		return request.get({
			url,
			headers: {
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true
		});
	}
	static createKYCApplication(ctx, templateId, attributes) {
		let url = ctx.getEndpoint('/applications');
		log.info(
			`[createKYCApplication] POST ${url} : auth:${ctx.token.toString()} : ${attributes}`
		);
		return request.post({
			url,
			body: { attributes, templateId },
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true
		});
	}
	static updateKYCApplication(ctx, application) {
		let url = ctx.getEndpoint('/applications/:id');
		url = url.replace(':id', application.id);
		return request.put({
			url,
			body: application,
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true
		});
	}
	static updateKYCApplicationPayment(ctx, applicationId, transactionHash) {
		let url = ctx.getEndpoint('/applications/:id/payments');
		url = url.replace(':id', applicationId);
		log.info(
			`[updateKYCApplicationPayment] POST ${url} : auth:${ctx.token.toString()} : ${transactionHash}`
		);
		return request.post({
			url,
			body: { transactionHash },
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true
		});
	}
	static listKYCApplications(ctx) {
		let url = ctx.getEndpoint('/applications');
		return request.get({
			url,
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true
		});
	}
	static getKYCApplication(ctx, id) {
		let url = ctx.getEndpoint('/applications/:id');
		url = url.replace(':id', id);
		return request.get({
			url,
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true
		});
	}
	static uploadKYCApplicationFile(ctx, doc) {
		let url = ctx.getEndpoint('/files');
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
			json: true
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
				signature
			);
			let token = RelyingPartyToken.fromString(challengeReply.jwt);
			this.ctx.token = token;

			return token;
		} catch (error) {
			log.error('Error establishing session %s', error);
			throw error;
		}
	}
	getUserLoginPayload() {
		return RelyingPartyRest.getUserToken(this.ctx);
	}

	createUser(attributes = []) {
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
			data: attr.data,
			schema: attr.schema,
			documents: attr.documents
		}));
		return RelyingPartyRest.createUser(this.ctx, attributesData, documents);
	}

	listKYCApplications() {
		return RelyingPartyRest.listKYCApplications(this.ctx);
	}

	getKYCApplication(id) {
		return RelyingPartyRest.getKYCApplication(this.ctx, id);
	}

	async createKYCApplication(templateId, attributes) {
		attributes = await Promise.all(
			attributes.map(async attr => {
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
		return RelyingPartyRest.createKYCApplication(this.ctx, templateId, attributes);
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

	listKYCTemplates() {
		return RelyingPartyRest.listKYCTemplates(this.ctx);
	}

	getKYCTemplate(id) {
		return RelyingPartyRest.getKYCTemplate(this.ctx, id);
	}
}

export default RelyingPartySession;
