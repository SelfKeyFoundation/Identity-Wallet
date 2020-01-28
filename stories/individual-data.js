export const dummyProfile = {
	firstName: 'John',
	middleName: 'C.',
	lastName: 'Doe',
	email: 'johndoe@internet.com',
	profilePicture: null,
	wallet: {},
	did: 'did:selfkey:0x9cb701490ad6112d2880225c1d712f1af8c7dce1a81c44030b321fb31029cd75',
	identity: {
		id: 5,
		type: 'individual',
		did: 'did:selfkey:0x9cb701490ad6112d2880225c1d712f1af8c7dce1a81c44030b321fb31029cd75',
		profilePicture: null,
		name: 'John Doe'
	},
	basicAttributes: [
		{
			env: 'development',
			id: 187,
			identityId: 5,
			isValid: true,
			name: 'Tax ID',
			type: {
				content: {
					$id: 'http://platform.selfkey.org/schema/attribute/email.json',
					title: 'Email',
					type: 'string'
				},
				createdAt: 1569314491493,
				defaultRepositoryId: 2,
				env: 'development',
				expires: 1579080615022,
				url: 'http://platform.selfkey.org/schema/attribute/email.json'
			},
			typeId: 52
		}
	],
	attributes: [
		{
			env: 'development',
			id: 9,
			identityId: 5,
			isValid: true,
			name: 'Email',
			type: {
				content: {
					$id: 'http://platform.selfkey.org/schema/attribute/tax-id-number.json',
					title: 'Tax ID',
					type: 'string'
				},
				createdAt: 1569314491493,
				defaultRepositoryId: 2,
				env: 'development',
				expires: 1579080615022
			},
			typeId: 52,
			url: 'http://platform.selfkey.org/schema/attribute/tax-id-number.json'
		}
	],
	documents: [
		{
			env: 'development',
			id: 12,
			identityId: 5,
			isValid: true,
			name: 'Passport',
			documents: [
				{
					attributeId: 12,
					mimeType: 'application/pdf',
					name: 'file.pdf'
				}
			],
			type: {
				content: {
					$id: '"http://platform.selfkey.org/schema/attribute/passport.json"',
					title: 'Passport',
					type: 'object'
				},
				createdAt: 1569314491493,
				defaultRepositoryId: 2,
				env: 'development',
				expires: 1579080615022,
				url: 'http://platform.selfkey.org/schema/attribute/tax-id-number.json'
			},
			typeId: 48
		}
	],
	allAttributes: [
		{
			env: 'development',
			id: 187,
			identityId: 5,
			isValid: true,
			name: 'Tax ID',
			type: {
				content: {
					$id: 'http://platform.selfkey.org/schema/attribute/email.json',
					title: 'Email',
					type: 'string'
				},
				createdAt: 1569314491493,
				defaultRepositoryId: 2,
				env: 'development',
				expires: 1579080615022
			},
			url: 'http://platform.selfkey.org/schema/attribute/email.json',
			typeId: 52
		},
		{
			env: 'development',
			id: 9,
			identityId: 5,
			isValid: true,
			name: 'Email',
			type: {
				content: {
					$id: 'http://platform.selfkey.org/schema/attribute/tax-id-number.json',
					title: 'Tax ID',
					type: 'string'
				},
				createdAt: 1569314491493,
				defaultRepositoryId: 2,
				env: 'development',
				expires: 1579080615022
			},
			typeId: 52,
			url: 'http://platform.selfkey.org/schema/attribute/tax-id-number.json'
		}
	]
};

export const dummyProfileWithoutDid = {
	firstName: 'John',
	middleName: 'C.',
	lastName: 'Doe',
	email: 'johndoe@internet.com',
	profilePicture: null,
	wallet: {},
	allAttributes: [],
	identity: {
		id: 5,
		type: 'individual',
		profilePicture: null,
		name: 'John Doe'
	},
	basicAttributes: [
		{
			env: 'development',
			id: 187,
			identityId: 5,
			isValid: true,
			name: 'Tax ID',
			type: {
				content: {
					$id: 'http://platform.selfkey.org/schema/attribute/email.json',
					title: 'Email',
					type: 'string'
				},
				createdAt: 1569314491493,
				defaultRepositoryId: 2,
				env: 'development',
				expires: 1579080615022,
				url: 'http://platform.selfkey.org/schema/attribute/email.json'
			},
			typeId: 52
		}
	],
	attributes: [
		{
			env: 'development',
			id: 9,
			identityId: 5,
			isValid: true,
			name: 'Email',
			type: {
				content: {
					$id: 'ttp://platform.selfkey.org/schema/attribute/tax-id-number.json',
					title: 'Tax ID',
					type: 'string'
				},
				createdAt: 1569314491493,
				defaultRepositoryId: 2,
				env: 'development',
				expires: 1579080615022,
				url: 'http://platform.selfkey.org/schema/attribute/tax-id-number.json'
			},
			typeId: 52
		}
	]
};
