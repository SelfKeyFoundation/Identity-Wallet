import * as documentUtils from './document';

describe('utils.document', () => {
	describe('formatDataUrl', () => {
		it('generates dataurl', () => {
			let url = documentUtils.formatDataUrl('test', Buffer.from('test', 'utf8'));
			expect(url).toBe('data:test;base64,dGVzdA==');
		});
	});
});
