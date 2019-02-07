import * as documentUtils from './document';

describe('utils.document', () => {
	describe('formatDataUrl', () => {
		it('generates dataurl', () => {
			let url = documentUtils.formatDataUrl('test', Buffer.from('test', 'utf8'));
			expect(url).toBe('data:test;base64,dGVzdA==');
		});
	});
	describe('bufferFromDataUrl', () => {
		it('generates buffer', () => {
			let buffer = documentUtils.bufferFromDataUrl('data:test;base64,dGVzdA==');
			expect(buffer.toString('utf8')).toEqual('test');
		});
		it('if empty string returns null', () => {
			let buffer = documentUtils.bufferFromDataUrl('');
			expect(buffer).toBe(null);
		});
		it("if base 64 string return it's value in buffer", () => {
			let buffer = documentUtils.bufferFromDataUrl('dGVzdA=');
			expect(buffer.toString('utf8')).toEqual('test');
		});
	});
});
