import request from 'request-promise-native';
import config from 'common/config';
import jwt from 'jsonwebtoken';
import urljoin from 'url-join';
import { identityAttributes } from '../../common/identity/utils';

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
	static getChallenge(ctx) {
		let url = ctx.getEndpoint('auth/challenge');
		url = urljoin(url, ctx.identity.publicKey);
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
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
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
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true
		});
	}
	static createKYCApplication(ctx, templateId, attributes) {
		let url = ctx.getEndpoint('/applications');
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
		let challenge = await RelyingPartyRest.getChallenge(this.ctx);
		let challengeToken = RelyingPartyToken.fromString(challenge.jwt);
		let signature = await this.identity.genSignatureForMessage(challengeToken.data.challenge);
		let challengeReply = await RelyingPartyRest.postChallengeReply(
			this.ctx,
			challenge.jwt,
			signature
		);
		let token = RelyingPartyToken.fromString(challengeReply.jwt);
		this.ctx.token = token;
		return token;
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
		let documents = attributes.reduce((acc, curr) => {
			acc = acc.concat(curr.documents);
			return acc;
		}, []);
		documents = await Promise.all(
			documents.map(async doc => {
				const res = await RelyingPartyRest.uploadKYCApplicationFile(this.ctx, doc);
				let newDoc = { ...doc };
				delete newDoc.buffer;
				newDoc.content = res.id;
				return newDoc;
			})
		);
		attributes = attributes.map(attr => {
			if (!attr.data) {
				return attr;
			}
			let attrDocs = documents.filter(
				doc => !!attr.documents.filter(d => d.id === doc.id).length
			);
			const { value } = identityAttributes.denormalizeDocumentsSchema(
				attr.schema,
				attr.data.value,
				attrDocs
			);
			attr = { ...attr, data: { value }, documents: [] };
			return attr;
		});
		return RelyingPartyRest.createKYCApplication(this.ctx, templateId, attributes);
	}

	updateKYCApplication(application) {
		return RelyingPartyRest.updateKYCApplication(this.ctx, application);
	}

	listKYCTemplates() {
		return RelyingPartyRest.listKYCTemplates(this.ctx);
	}

	getKYCTemplate(id) {
		return RelyingPartyRest.getKYCTemplate(this.ctx, id);
	}
}

export default RelyingPartySession;
