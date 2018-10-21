import { getAddresses, getLabelError, getAddressError, getLabel } from './selectors';

describe('address book selectors', () => {
	const addressBook = {
		entries: [
			{
				id: 1,
				walletId: 1,
				label: 'test',
				address: '0x'
			},
			{
				id: 2,
				walletId: 2,
				label: 'test2',
				address: '0x2'
			}
		],
		labelError: 'Label Error',
		addressError: 'Address Error'
	};

	it('should return addresses', () => {
		const expectedAddress = [
			{
				id: 1,
				walletId: 1,
				label: 'test',
				address: '0x'
			},
			{
				id: 2,
				walletId: 2,
				label: 'test2',
				address: '0x2'
			}
		];
		expect(getAddresses({ addressBook })).toEqual(expectedAddress);
	});

	it('should return label error', () => {
		const expectedLabelError = 'Label Error';
		expect(getLabelError({ addressBook })).toEqual(expectedLabelError);
	});

	it('should return address error', () => {
		const expectedAddressError = 'Address Error';
		expect(getAddressError({ addressBook })).toEqual(expectedAddressError);
	});

	it('should return label', () => {
		const expectedLabel = 'test';
		expect(getLabel({ addressBook }, 1)).toEqual(expectedLabel);
	});
});
