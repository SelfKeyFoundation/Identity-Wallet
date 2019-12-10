export default () => [
	{
		sku: 'FT-BNK-AD1b',
		vendorId: 'flagtheory_banking',
		entityType: 'individual',
		priceCurrency: 'USD',
		status: 'inactive',
		name: 'Andorra AD1b',
		price: '1000',
		category: 'banking',
		data: {
			type: 'private',
			region: 'Andorra',
			goodFor: ['Corporate Wealth', 'Investment Funds'],
			testPrice: '1000',
			minDeposit: 'USD 5,000',
			templateId: '5d09d11c26f7be563f7e0650',
			accountCode: 'AD1b',
			countryCode: 'AD',
			eligibility: [
				'International Individuals',
				'Foundations',
				'Trusts',
				'Offshore Companies'
			],
			walletAddress: '0x6ce3bdd91d3b9f55ec206970e75701043fba751d',
			testDidAddress: '0xee10a3335f48e10b444e299cf017d57879109c1e32cec3e31103ceca7718d0ec',
			testTemplateId: '5d09d11c26f7be563f7e0650',
			activeTestPrice: true,
			testWalletAddress: '0x23d233933c86f93b74705cf0d236b39f474249f8',
			accounts: {
				AD1b1: {
					templateId: '5d09d11c26f7be563f7e0650',
					accountCode: 'AD1b',
					countryCode: 'AD',
					bankCode: 'AD1b1',
					countryName: 'Andorra',
					accountTitle: 'Private Banking Account',
					testTemplateId: '5d09d11c26f7be563f7e0650'
				}
			},
			jurisdiction: {
				remote: ['Remote'],
				goodFor: ['Private Banking'],
				payments: ['Prepaid / Credit Cards'],
				minDeposit: ['High'],
				countryCode: 'AD',
				countryName: 'Andorra',
				businessAccounts: ['Resident Company'],
				personalAccounts: ['Resident'],
				wealthManagement: ['International']
			}
		}
	}
];
