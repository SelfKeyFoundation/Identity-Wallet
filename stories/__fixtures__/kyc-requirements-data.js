export default [
	{
		uiId: '5c6e404177c33d90a5718cf0',
		id: '5c6e404177c33d90a5718cf0',
		required: true,
		schemaId: 'http://platform.selfkey.org/schema/attribute/email.json',
		options: [
			{
				createdAt: 1556814604445,
				data: { value: 'test@test.com' },
				id: 3,
				name: 'Email',
				typeId: 5,
				updatedAt: 1556814604464,
				walletId: 1,
				type: {
					content: {
						$id: 'http://platform.selfkey.org/schema/attribute/email.json',
						$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
						description: 'Please enter your e-mail address.',
						format: 'email',
						identityAttribute: true,
						identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
						title: 'Email',
						type: 'string'
					},
					createdAt: 1556814550987,
					defaultRepositoryId: 1,
					expires: 1558205185998,
					id: 5,
					updatedAt: 1558118786162,
					url: 'http://platform.selfkey.org/schema/attribute/email.json'
				},
				defaultRepository: {
					content: {
						identityAttributes: [
							{
								json:
									'http://platform.selfkey.org/schema/attribute/bank-statement.json',
								ui: 'http://platform.selfkey.org/schema/ui/bank-statement.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/date-of-birth.json',
								ui: 'http://platform.selfkey.org/schema/ui/date-of-birth.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/country-of-residency.json',
								ui:
									'http://platform.selfkey.org/schema/ui/country-of-residency.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/drivers-license.json',
								ui: 'http://platform.selfkey.org/schema/ui/drivers-license.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/email.json',
								ui: 'http://platform.selfkey.org/schema/ui/email.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/fingerprint.json',
								ui: 'http://platform.selfkey.org/schema/ui/fingerprint.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/first-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/first-name.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/last-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/last-name.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/middle-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/middle-name.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/national-id.json',
								ui: 'http://platform.selfkey.org/schema/ui/national-id.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/nationality.json',
								ui: 'http://platform.selfkey.org/schema/ui/nationality.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/passport.json',
								ui: 'http://platform.selfkey.org/schema/ui/passport.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/phone-number.json',
								ui: 'http://platform.selfkey.org/schema/ui/phone-number.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/physical-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/physical-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/tax-certificate.json',
								ui: 'http://platform.selfkey.org/schema/ui/tax-certificate.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/tax-id-number.json',
								ui: 'http://platform.selfkey.org/schema/ui/tax-id-number.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/utility-bill.json',
								ui: 'http://platform.selfkey.org/schema/ui/utility-bill.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/voice-id.json',
								ui: 'http://platform.selfkey.org/schema/ui/voice-id.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/work-place.json',
								ui: 'http://platform.selfkey.org/schema/ui/work-place.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/btc-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/btc-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/eth-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/eth-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/dash-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/dash-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/certificate-of-incorporation.json',
								ui:
									'http://platform.selfkey.org/schema/ui/certificate-of-incorporation.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/registration-certificate.json',
								ui:
									'http://platform.selfkey.org/schema/ui/registration-certificate.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/external-document.json',
								ui: 'http://platform.selfkey.org/schema/ui/external-document.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/company-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/company-name.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/birth-certificate.json',
								ui: 'http://platform.selfkey.org/schema/ui/birth-certificate.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/member-register.json',
								ui: 'http://platform.selfkey.org/schema/ui/member-register.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/cv.json',
								ui: 'http://platform.selfkey.org/schema/ui/cv.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/professional-reference-letter.json',
								ui:
									'http://platform.selfkey.org/schema/ui/professional-reference-letter.json'
							}
						],
						name: 'Selfkey.org'
					},
					createdAt: 1556814538497,
					eager: true,
					expires: 1558205185685,
					id: 1,
					name: 'Selfkey.org',
					updatedAt: 1558118785688,
					url: 'http://platform.selfkey.org/repository.json'
				},
				defaultUiSchema: {
					attributeTypeId: 5,
					content: {},
					createdAt: 1556814550995,
					expires: 1558205187902,
					id: 5,
					repositoryId: 1,
					updatedAt: 1558118792688,
					url: 'http://platform.selfkey.org/schema/ui/email.json'
				},
				isValid: true,
				documents: []
			},
			{
				createdAt: 1556814669750,
				data: { value: 'test@mail.com' },
				id: 5,
				name: 'test',
				typeId: 5,
				updatedAt: 1556814669769,
				walletId: 1,
				type: {
					content: {
						$id: 'http://platform.selfkey.org/schema/attribute/email.json',
						$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
						description: 'Please enter your e-mail address.',
						format: 'email',
						identityAttribute: true,
						identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
						title: 'Email',
						type: 'string'
					},
					createdAt: 1556814550987,
					defaultRepositoryId: 1,
					expires: 1558205185998,
					id: 5,
					updatedAt: 1558118786162,
					url: 'http://platform.selfkey.org/schema/attribute/email.json'
				},
				defaultRepository: {
					content: {
						identityAttributes: [
							{
								json:
									'http://platform.selfkey.org/schema/attribute/bank-statement.json',
								ui: 'http://platform.selfkey.org/schema/ui/bank-statement.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/date-of-birth.json',
								ui: 'http://platform.selfkey.org/schema/ui/date-of-birth.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/country-of-residency.json',
								ui:
									'http://platform.selfkey.org/schema/ui/country-of-residency.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/drivers-license.json',
								ui: 'http://platform.selfkey.org/schema/ui/drivers-license.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/email.json',
								ui: 'http://platform.selfkey.org/schema/ui/email.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/fingerprint.json',
								ui: 'http://platform.selfkey.org/schema/ui/fingerprint.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/first-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/first-name.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/last-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/last-name.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/middle-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/middle-name.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/national-id.json',
								ui: 'http://platform.selfkey.org/schema/ui/national-id.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/nationality.json',
								ui: 'http://platform.selfkey.org/schema/ui/nationality.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/passport.json',
								ui: 'http://platform.selfkey.org/schema/ui/passport.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/phone-number.json',
								ui: 'http://platform.selfkey.org/schema/ui/phone-number.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/physical-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/physical-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/tax-certificate.json',
								ui: 'http://platform.selfkey.org/schema/ui/tax-certificate.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/tax-id-number.json',
								ui: 'http://platform.selfkey.org/schema/ui/tax-id-number.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/utility-bill.json',
								ui: 'http://platform.selfkey.org/schema/ui/utility-bill.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/voice-id.json',
								ui: 'http://platform.selfkey.org/schema/ui/voice-id.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/work-place.json',
								ui: 'http://platform.selfkey.org/schema/ui/work-place.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/btc-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/btc-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/eth-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/eth-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/dash-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/dash-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/certificate-of-incorporation.json',
								ui:
									'http://platform.selfkey.org/schema/ui/certificate-of-incorporation.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/registration-certificate.json',
								ui:
									'http://platform.selfkey.org/schema/ui/registration-certificate.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/external-document.json',
								ui: 'http://platform.selfkey.org/schema/ui/external-document.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/company-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/company-name.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/birth-certificate.json',
								ui: 'http://platform.selfkey.org/schema/ui/birth-certificate.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/member-register.json',
								ui: 'http://platform.selfkey.org/schema/ui/member-register.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/cv.json',
								ui: 'http://platform.selfkey.org/schema/ui/cv.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/professional-reference-letter.json',
								ui:
									'http://platform.selfkey.org/schema/ui/professional-reference-letter.json'
							}
						],
						name: 'Selfkey.org'
					},
					createdAt: 1556814538497,
					eager: true,
					expires: 1558205185685,
					id: 1,
					name: 'Selfkey.org',
					updatedAt: 1558118785688,
					url: 'http://platform.selfkey.org/repository.json'
				},
				defaultUiSchema: {
					attributeTypeId: 5,
					content: {},
					createdAt: 1556814550995,
					expires: 1558205187902,
					id: 5,
					repositoryId: 1,
					updatedAt: 1558118792688,
					url: 'http://platform.selfkey.org/schema/ui/email.json'
				},
				isValid: true,
				documents: []
			}
		],
		title: 'Email',
		description: 'Email address',
		type: {
			content: {
				$id: 'http://platform.selfkey.org/schema/attribute/email.json',
				$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
				description: 'Please enter your e-mail address.',
				format: 'email',
				identityAttribute: true,
				identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
				title: 'Email',
				type: 'string'
			},
			createdAt: 1556814550987,
			defaultRepositoryId: 1,
			expires: 1558205185998,
			id: 5,
			updatedAt: 1558118786162,
			url: 'http://platform.selfkey.org/schema/attribute/email.json'
		},
		duplicateType: false
	},
	{
		uiId: '5c78efe89ef86c53565fb66b',
		id: '5c78efe89ef86c53565fb66b',
		required: true,
		schemaId: 'http://platform.selfkey.org/schema/attribute/first-name.json',
		options: [
			{
				createdAt: 1556814604346,
				data: { value: 'test' },
				id: 1,
				name: 'First Name',
				typeId: 7,
				updatedAt: 1556814604372,
				walletId: 1,
				type: {
					content: {
						$id: 'http://platform.selfkey.org/schema/attribute/first-name.json',
						$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
						description: 'Given Name.',
						identityAttribute: true,
						identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
						title: 'First Name',
						type: 'string'
					},
					createdAt: 1556814551013,
					defaultRepositoryId: 1,
					expires: 1558205186034,
					id: 7,
					updatedAt: 1558118786200,
					url: 'http://platform.selfkey.org/schema/attribute/first-name.json'
				},
				defaultRepository: {
					content: {
						identityAttributes: [
							{
								json:
									'http://platform.selfkey.org/schema/attribute/bank-statement.json',
								ui: 'http://platform.selfkey.org/schema/ui/bank-statement.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/date-of-birth.json',
								ui: 'http://platform.selfkey.org/schema/ui/date-of-birth.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/country-of-residency.json',
								ui:
									'http://platform.selfkey.org/schema/ui/country-of-residency.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/drivers-license.json',
								ui: 'http://platform.selfkey.org/schema/ui/drivers-license.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/email.json',
								ui: 'http://platform.selfkey.org/schema/ui/email.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/fingerprint.json',
								ui: 'http://platform.selfkey.org/schema/ui/fingerprint.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/first-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/first-name.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/last-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/last-name.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/middle-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/middle-name.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/national-id.json',
								ui: 'http://platform.selfkey.org/schema/ui/national-id.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/nationality.json',
								ui: 'http://platform.selfkey.org/schema/ui/nationality.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/passport.json',
								ui: 'http://platform.selfkey.org/schema/ui/passport.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/phone-number.json',
								ui: 'http://platform.selfkey.org/schema/ui/phone-number.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/physical-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/physical-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/tax-certificate.json',
								ui: 'http://platform.selfkey.org/schema/ui/tax-certificate.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/tax-id-number.json',
								ui: 'http://platform.selfkey.org/schema/ui/tax-id-number.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/utility-bill.json',
								ui: 'http://platform.selfkey.org/schema/ui/utility-bill.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/voice-id.json',
								ui: 'http://platform.selfkey.org/schema/ui/voice-id.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/work-place.json',
								ui: 'http://platform.selfkey.org/schema/ui/work-place.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/btc-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/btc-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/eth-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/eth-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/dash-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/dash-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/certificate-of-incorporation.json',
								ui:
									'http://platform.selfkey.org/schema/ui/certificate-of-incorporation.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/registration-certificate.json',
								ui:
									'http://platform.selfkey.org/schema/ui/registration-certificate.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/external-document.json',
								ui: 'http://platform.selfkey.org/schema/ui/external-document.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/company-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/company-name.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/birth-certificate.json',
								ui: 'http://platform.selfkey.org/schema/ui/birth-certificate.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/member-register.json',
								ui: 'http://platform.selfkey.org/schema/ui/member-register.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/cv.json',
								ui: 'http://platform.selfkey.org/schema/ui/cv.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/professional-reference-letter.json',
								ui:
									'http://platform.selfkey.org/schema/ui/professional-reference-letter.json'
							}
						],
						name: 'Selfkey.org'
					},
					createdAt: 1556814538497,
					eager: true,
					expires: 1558205185685,
					id: 1,
					name: 'Selfkey.org',
					updatedAt: 1558118785688,
					url: 'http://platform.selfkey.org/repository.json'
				},
				defaultUiSchema: {
					attributeTypeId: 7,
					content: {},
					createdAt: 1556814551021,
					expires: 1558205187900,
					id: 7,
					repositoryId: 1,
					updatedAt: 1558118792674,
					url: 'http://platform.selfkey.org/schema/ui/first-name.json'
				},
				isValid: true,
				documents: []
			}
		],
		title: 'First Name',
		description: 'First name',
		type: {
			content: {
				$id: 'http://platform.selfkey.org/schema/attribute/first-name.json',
				$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
				description: 'Given Name.',
				identityAttribute: true,
				identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
				title: 'First Name',
				type: 'string'
			},
			createdAt: 1556814551013,
			defaultRepositoryId: 1,
			expires: 1558205186034,
			id: 7,
			updatedAt: 1558118786200,
			url: 'http://platform.selfkey.org/schema/attribute/first-name.json'
		},
		duplicateType: false
	},
	{
		uiId: '5c78f0069ef86cf08d5fb66d',
		id: '5c78f0069ef86cf08d5fb66d',
		required: true,
		schemaId: 'http://platform.selfkey.org/schema/attribute/last-name.json',
		options: [
			{
				createdAt: 1556814604399,
				data: { value: 'test' },
				id: 2,
				name: 'Last Name',
				typeId: 8,
				updatedAt: 1556814604420,
				walletId: 1,
				type: {
					content: {
						$id: 'http://platform.selfkey.org/schema/attribute/last-name.json',
						$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
						description: 'Family Name.',
						identityAttribute: true,
						identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
						title: 'Last Name',
						type: 'string'
					},
					createdAt: 1556814551027,
					defaultRepositoryId: 1,
					expires: 1558205185984,
					id: 8,
					updatedAt: 1558118786138,
					url: 'http://platform.selfkey.org/schema/attribute/last-name.json'
				},
				defaultRepository: {
					content: {
						identityAttributes: [
							{
								json:
									'http://platform.selfkey.org/schema/attribute/bank-statement.json',
								ui: 'http://platform.selfkey.org/schema/ui/bank-statement.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/date-of-birth.json',
								ui: 'http://platform.selfkey.org/schema/ui/date-of-birth.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/country-of-residency.json',
								ui:
									'http://platform.selfkey.org/schema/ui/country-of-residency.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/drivers-license.json',
								ui: 'http://platform.selfkey.org/schema/ui/drivers-license.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/email.json',
								ui: 'http://platform.selfkey.org/schema/ui/email.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/fingerprint.json',
								ui: 'http://platform.selfkey.org/schema/ui/fingerprint.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/first-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/first-name.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/last-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/last-name.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/middle-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/middle-name.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/national-id.json',
								ui: 'http://platform.selfkey.org/schema/ui/national-id.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/nationality.json',
								ui: 'http://platform.selfkey.org/schema/ui/nationality.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/passport.json',
								ui: 'http://platform.selfkey.org/schema/ui/passport.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/phone-number.json',
								ui: 'http://platform.selfkey.org/schema/ui/phone-number.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/physical-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/physical-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/tax-certificate.json',
								ui: 'http://platform.selfkey.org/schema/ui/tax-certificate.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/tax-id-number.json',
								ui: 'http://platform.selfkey.org/schema/ui/tax-id-number.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/utility-bill.json',
								ui: 'http://platform.selfkey.org/schema/ui/utility-bill.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/voice-id.json',
								ui: 'http://platform.selfkey.org/schema/ui/voice-id.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/work-place.json',
								ui: 'http://platform.selfkey.org/schema/ui/work-place.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/btc-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/btc-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/eth-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/eth-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/dash-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/dash-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/certificate-of-incorporation.json',
								ui:
									'http://platform.selfkey.org/schema/ui/certificate-of-incorporation.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/registration-certificate.json',
								ui:
									'http://platform.selfkey.org/schema/ui/registration-certificate.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/external-document.json',
								ui: 'http://platform.selfkey.org/schema/ui/external-document.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/company-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/company-name.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/birth-certificate.json',
								ui: 'http://platform.selfkey.org/schema/ui/birth-certificate.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/member-register.json',
								ui: 'http://platform.selfkey.org/schema/ui/member-register.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/cv.json',
								ui: 'http://platform.selfkey.org/schema/ui/cv.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/professional-reference-letter.json',
								ui:
									'http://platform.selfkey.org/schema/ui/professional-reference-letter.json'
							}
						],
						name: 'Selfkey.org'
					},
					createdAt: 1556814538497,
					eager: true,
					expires: 1558205185685,
					id: 1,
					name: 'Selfkey.org',
					updatedAt: 1558118785688,
					url: 'http://platform.selfkey.org/repository.json'
				},
				defaultUiSchema: {
					attributeTypeId: 8,
					content: {},
					createdAt: 1556814551035,
					expires: 1558205187899,
					id: 8,
					repositoryId: 1,
					updatedAt: 1558118792667,
					url: 'http://platform.selfkey.org/schema/ui/last-name.json'
				},
				isValid: true,
				documents: []
			}
		],
		title: 'Last Name',
		description: 'Last name',
		type: {
			content: {
				$id: 'http://platform.selfkey.org/schema/attribute/last-name.json',
				$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
				description: 'Family Name.',
				identityAttribute: true,
				identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
				title: 'Last Name',
				type: 'string'
			},
			createdAt: 1556814551027,
			defaultRepositoryId: 1,
			expires: 1558205185984,
			id: 8,
			updatedAt: 1558118786138,
			url: 'http://platform.selfkey.org/schema/attribute/last-name.json'
		},
		duplicateType: false
	},
	{
		uiId: '5c78fdf29ef86c3ad25fb68d',
		id: '5c78fdf29ef86c3ad25fb68d',
		required: true,
		schemaId: 'http://platform.selfkey.org/schema/attribute/middle-name.json',
		options: [],
		title: 'Test',
		description: 'Test',
		type: {
			content: {
				$id: 'http://platform.selfkey.org/schema/attribute/middle-name.json',
				$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
				description: 'Middle Name.',
				identityAttribute: true,
				identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
				title: 'Middle Name',
				type: 'string'
			},
			createdAt: 1556814551039,
			defaultRepositoryId: 1,
			expires: 1558205186050,
			id: 9,
			updatedAt: 1558118786212,
			url: 'http://platform.selfkey.org/schema/attribute/middle-name.json'
		},
		duplicateType: false
	},
	{
		uiId: '5c3f3eb73075d57a394ad617',
		id: '5c3f3eb73075d57a394ad617',
		required: true,
		schemaId: 'http://platform.selfkey.org/schema/attribute/passport.json',
		options: [],
		title: 'Passport Copy',
		description:
			'Certified/notarized copy of valid passport for EACH shareholder. Certification/notarization must be in English and current within 90 days. Name and signature of the certifier, and date of certification must be visible.',
		type: {
			content: {
				$id: 'http://platform.selfkey.org/schema/attribute/passport.json',
				$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
				description: 'Please provide an image of your passport. It must still be valid.',
				identityAttribute: true,
				identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
				properties: {
					expires: {
						$id: 'http://platform.selfkey.org/schema/misc/expiry-date.json',
						$schema: 'http://json-schema.org/draft-07/schema',
						format: 'date',
						title: 'Expiry Date',
						type: 'string'
					},
					extra: {
						$id: 'http://platform.selfkey.org/schema/misc/extra-images.json',
						$schema: 'http://json-schema.org/draft-07/schema',
						description: 'Please add any extra images that are relevant',
						items: {
							$id: 'http://platform.selfkey.org/schema/file/image.json',
							$schema: 'http://json-schema.org/draft-07/schema',
							format: 'file',
							properties: {
								content: { type: 'string' },
								mimeType: {
									enum: ['image/jpeg', 'image/png', 'application/pdf'],
									type: 'string'
								},
								size: { maximum: 50000000, type: 'integer' }
							},
							required: ['mimeType', 'size', 'content'],
							title: 'Image',
							type: 'object'
						},
						title: 'Extra Images',
						type: 'array'
					},
					image: {
						$id: 'http://platform.selfkey.org/schema/file/image.json',
						$schema: 'http://json-schema.org/draft-07/schema',
						format: 'file',
						properties: {
							content: { type: 'string' },
							mimeType: {
								enum: ['image/jpeg', 'image/png', 'application/pdf'],
								type: 'string'
							},
							size: { maximum: 50000000, type: 'integer' }
						},
						required: ['mimeType', 'size', 'content'],
						title: 'Image',
						type: 'object'
					},
					issued: {
						$id: 'http://platform.selfkey.org/schema/misc/issue-date.json',
						$schema: 'http://json-schema.org/draft-07/schema',
						format: 'date',
						title: 'Issue Date',
						type: 'string'
					},
					selfie: {
						$id: 'http://platform.selfkey.org/schema/misc/selfie.json',
						$schema: 'http://json-schema.org/draft-07/schema',
						description:
							"Take a selfie, making sure the image is clear, and your face isn't covered by any items, such as glasses.",
						properties: {
							image: {
								$id: 'http://platform.selfkey.org/schema/file/image.json',
								$schema: 'http://json-schema.org/draft-07/schema',
								format: 'file',
								properties: {
									content: { type: 'string' },
									mimeType: {
										enum: ['image/jpeg', 'image/png', 'application/pdf'],
										type: 'string'
									},
									size: { maximum: 50000000, type: 'integer' }
								},
								required: ['mimeType', 'size', 'content'],
								title: 'Image',
								type: 'object'
							}
						},
						required: ['image'],
						title: 'Selfie',
						type: 'object'
					}
				},
				required: ['image', 'issued', 'expires'],
				title: 'Passport',
				type: 'object'
			},
			createdAt: 1556814551079,
			defaultRepositoryId: 1,
			expires: 1558205186343,
			id: 12,
			updatedAt: 1558118786407,
			url: 'http://platform.selfkey.org/schema/attribute/passport.json'
		},
		duplicateType: false
	},
	{
		uiId: '5c3f3eca3075d54c104ad619',
		id: '5c3f3eca3075d54c104ad619',
		required: true,
		schemaId: 'http://platform.selfkey.org/schema/attribute/utility-bill.json',
		options: [],
		title: 'Address Proof / Utility Bill',
		description:
			"Certified/notarized copy of one of the following documents for EACH shareholder: utility bill, rental agreement, national ID, driver's license, property deed or local tax payment. Name and address must be clearly displayed, and document must be current within 90 days. If not in English, the document must be translated by a certified translator. Name and signature of certifier, and date of certification must be visible.",
		type: {
			content: {
				$id: 'http://platform.selfkey.org/schema/attribute/utility-bill.json',
				$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
				description:
					'Please provide an image with a recent utility bill. No older than 3 months.',
				identityAttribute: true,
				identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
				properties: {
					extra: {
						$id: 'http://platform.selfkey.org/schema/misc/extra-images.json',
						$schema: 'http://json-schema.org/draft-07/schema',
						description: 'Please add any extra images that are relevant',
						items: {
							$id: 'http://platform.selfkey.org/schema/file/image.json',
							$schema: 'http://json-schema.org/draft-07/schema',
							format: 'file',
							properties: {
								content: { type: 'string' },
								mimeType: {
									enum: ['image/jpeg', 'image/png', 'application/pdf'],
									type: 'string'
								},
								size: { maximum: 50000000, type: 'integer' }
							},
							required: ['mimeType', 'size', 'content'],
							title: 'Image',
							type: 'object'
						},
						title: 'Extra Images',
						type: 'array'
					},
					images: {
						$id: 'http://platform.selfkey.org/schema/file/multi-image.json',
						$schema: 'http://json-schema.org/draft-07/schema',
						items: {
							$id: 'http://platform.selfkey.org/schema/file/image.json',
							$schema: 'http://json-schema.org/draft-07/schema',
							format: 'file',
							properties: {
								content: { type: 'string' },
								mimeType: {
									enum: ['image/jpeg', 'image/png', 'application/pdf'],
									type: 'string'
								},
								size: { maximum: 50000000, type: 'integer' }
							},
							required: ['mimeType', 'size', 'content'],
							title: 'Image',
							type: 'object'
						},
						title: 'Multiple Images',
						type: 'array'
					},
					issued: {
						$id: 'http://platform.selfkey.org/schema/misc/issue-date.json',
						$schema: 'http://json-schema.org/draft-07/schema',
						format: 'date',
						title: 'Issue Date',
						type: 'string'
					}
				},
				required: ['images', 'issued'],
				title: 'Utility Bill',
				type: 'object'
			},
			createdAt: 1556814551145,
			defaultRepositoryId: 1,
			expires: 1558205186491,
			id: 17,
			updatedAt: 1558118786545,
			url: 'http://platform.selfkey.org/schema/attribute/utility-bill.json'
		},
		duplicateType: false
	},
	{
		uiId: '5c3f3ee03075d50fad4ad61b',
		id: '5c3f3ee03075d50fad4ad61b',
		required: true,
		schemaId: 'http://platform.selfkey.org/schema/attribute/bank-statement.json',
		options: [
			{
				createdAt: 1556814632113,
				data: { value: { images: ['$document-1'], issued: '2019-05-09' } },
				id: 4,
				name: 'test',
				typeId: 1,
				updatedAt: 1556814632458,
				walletId: 1,
				type: {
					content: {
						$id: 'http://platform.selfkey.org/schema/attribute/bank-statement.json',
						$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
						description:
							'Please provide a copy of a recent bank statement. No older than 6 months.',
						identityAttribute: true,
						identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
						properties: {
							extra: {
								$id: 'http://platform.selfkey.org/schema/misc/extra-images.json',
								$schema: 'http://json-schema.org/draft-07/schema',
								description: 'Please add any extra images that are relevant',
								items: {
									$id: 'http://platform.selfkey.org/schema/file/image.json',
									$schema: 'http://json-schema.org/draft-07/schema',
									format: 'file',
									properties: {
										content: { type: 'string' },
										mimeType: {
											enum: ['image/jpeg', 'image/png', 'application/pdf'],
											type: 'string'
										},
										size: { maximum: 50000000, type: 'integer' }
									},
									required: ['mimeType', 'size', 'content'],
									title: 'Image',
									type: 'object'
								},
								title: 'Extra Images',
								type: 'array'
							},
							images: {
								$id: 'http://platform.selfkey.org/schema/file/multi-image.json',
								$schema: 'http://json-schema.org/draft-07/schema',
								items: {
									$id: 'http://platform.selfkey.org/schema/file/image.json',
									$schema: 'http://json-schema.org/draft-07/schema',
									format: 'file',
									properties: {
										content: { type: 'string' },
										mimeType: {
											enum: ['image/jpeg', 'image/png', 'application/pdf'],
											type: 'string'
										},
										size: { maximum: 50000000, type: 'integer' }
									},
									required: ['mimeType', 'size', 'content'],
									title: 'Image',
									type: 'object'
								},
								title: 'Multiple Images',
								type: 'array'
							},
							issued: {
								$id: 'http://platform.selfkey.org/schema/misc/issue-date.json',
								$schema: 'http://json-schema.org/draft-07/schema',
								format: 'date',
								title: 'Issue Date',
								type: 'string'
							}
						},
						required: ['images', 'issued'],
						title: 'Bank Statement',
						type: 'object'
					},
					createdAt: 1556814550917,
					defaultRepositoryId: 1,
					expires: 1558205186427,
					id: 1,
					updatedAt: 1558118786481,
					url: 'http://platform.selfkey.org/schema/attribute/bank-statement.json'
				},
				defaultRepository: {
					content: {
						identityAttributes: [
							{
								json:
									'http://platform.selfkey.org/schema/attribute/bank-statement.json',
								ui: 'http://platform.selfkey.org/schema/ui/bank-statement.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/date-of-birth.json',
								ui: 'http://platform.selfkey.org/schema/ui/date-of-birth.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/country-of-residency.json',
								ui:
									'http://platform.selfkey.org/schema/ui/country-of-residency.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/drivers-license.json',
								ui: 'http://platform.selfkey.org/schema/ui/drivers-license.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/email.json',
								ui: 'http://platform.selfkey.org/schema/ui/email.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/fingerprint.json',
								ui: 'http://platform.selfkey.org/schema/ui/fingerprint.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/first-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/first-name.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/last-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/last-name.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/middle-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/middle-name.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/national-id.json',
								ui: 'http://platform.selfkey.org/schema/ui/national-id.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/nationality.json',
								ui: 'http://platform.selfkey.org/schema/ui/nationality.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/passport.json',
								ui: 'http://platform.selfkey.org/schema/ui/passport.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/phone-number.json',
								ui: 'http://platform.selfkey.org/schema/ui/phone-number.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/physical-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/physical-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/tax-certificate.json',
								ui: 'http://platform.selfkey.org/schema/ui/tax-certificate.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/tax-id-number.json',
								ui: 'http://platform.selfkey.org/schema/ui/tax-id-number.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/utility-bill.json',
								ui: 'http://platform.selfkey.org/schema/ui/utility-bill.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/voice-id.json',
								ui: 'http://platform.selfkey.org/schema/ui/voice-id.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/work-place.json',
								ui: 'http://platform.selfkey.org/schema/ui/work-place.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/btc-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/btc-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/eth-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/eth-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/dash-address.json',
								ui: 'http://platform.selfkey.org/schema/ui/dash-address.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/certificate-of-incorporation.json',
								ui:
									'http://platform.selfkey.org/schema/ui/certificate-of-incorporation.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/registration-certificate.json',
								ui:
									'http://platform.selfkey.org/schema/ui/registration-certificate.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/external-document.json',
								ui: 'http://platform.selfkey.org/schema/ui/external-document.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/company-name.json',
								ui: 'http://platform.selfkey.org/schema/ui/company-name.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/birth-certificate.json',
								ui: 'http://platform.selfkey.org/schema/ui/birth-certificate.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/member-register.json',
								ui: 'http://platform.selfkey.org/schema/ui/member-register.json'
							},
							{
								json: 'http://platform.selfkey.org/schema/attribute/cv.json',
								ui: 'http://platform.selfkey.org/schema/ui/cv.json'
							},
							{
								json:
									'http://platform.selfkey.org/schema/attribute/professional-reference-letter.json',
								ui:
									'http://platform.selfkey.org/schema/ui/professional-reference-letter.json'
							}
						],
						name: 'Selfkey.org'
					},
					createdAt: 1556814538497,
					eager: true,
					expires: 1558205185685,
					id: 1,
					name: 'Selfkey.org',
					updatedAt: 1558118785688,
					url: 'http://platform.selfkey.org/repository.json'
				},
				defaultUiSchema: {
					attributeTypeId: 1,
					content: {
						extra: { 'ui:hidden': true },
						images: { 'ui:label': false },
						'ui:order': ['images', 'issued', 'extra']
					},
					createdAt: 1556814550942,
					expires: 1558205187895,
					id: 1,
					repositoryId: 1,
					updatedAt: 1558118792632,
					url: 'http://platform.selfkey.org/schema/ui/bank-statement.json'
				},
				isValid: true,
				documents: [
					{
						attributeId: 4,
						content: 'data:application/pdf;base64,czxczxczxczxczxvxcvx',
						createdAt: 1556814632300,
						id: 1,
						mimeType: 'application/pdf',
						name: 'SEO report https_selfkey.org 2019-03-19 (1).pdf',
						size: 972553,
						updatedAt: 1556814632458,
						walletId: 1
					}
				]
			}
		],
		title: 'Bank Proof',
		description:
			'Certified/notarized copy of bank statement or reference letter for EACH shareholder. Name and address must be clearly displayed, and document must be current within 90 days. If not in English, the document must be translated by a certified translator. Name and signature of certifier, and date of certification must be visible.',
		type: {
			content: {
				$id: 'http://platform.selfkey.org/schema/attribute/bank-statement.json',
				$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
				description:
					'Please provide a copy of a recent bank statement. No older than 6 months.',
				identityAttribute: true,
				identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
				properties: {
					extra: {
						$id: 'http://platform.selfkey.org/schema/misc/extra-images.json',
						$schema: 'http://json-schema.org/draft-07/schema',
						description: 'Please add any extra images that are relevant',
						items: {
							$id: 'http://platform.selfkey.org/schema/file/image.json',
							$schema: 'http://json-schema.org/draft-07/schema',
							format: 'file',
							properties: {
								content: { type: 'string' },
								mimeType: {
									enum: ['image/jpeg', 'image/png', 'application/pdf'],
									type: 'string'
								},
								size: { maximum: 50000000, type: 'integer' }
							},
							required: ['mimeType', 'size', 'content'],
							title: 'Image',
							type: 'object'
						},
						title: 'Extra Images',
						type: 'array'
					},
					images: {
						$id: 'http://platform.selfkey.org/schema/file/multi-image.json',
						$schema: 'http://json-schema.org/draft-07/schema',
						items: {
							$id: 'http://platform.selfkey.org/schema/file/image.json',
							$schema: 'http://json-schema.org/draft-07/schema',
							format: 'file',
							properties: {
								content: { type: 'string' },
								mimeType: {
									enum: ['image/jpeg', 'image/png', 'application/pdf'],
									type: 'string'
								},
								size: { maximum: 50000000, type: 'integer' }
							},
							required: ['mimeType', 'size', 'content'],
							title: 'Image',
							type: 'object'
						},
						title: 'Multiple Images',
						type: 'array'
					},
					issued: {
						$id: 'http://platform.selfkey.org/schema/misc/issue-date.json',
						$schema: 'http://json-schema.org/draft-07/schema',
						format: 'date',
						title: 'Issue Date',
						type: 'string'
					}
				},
				required: ['images', 'issued'],
				title: 'Bank Statement',
				type: 'object'
			},
			createdAt: 1556814550917,
			defaultRepositoryId: 1,
			expires: 1558205186427,
			id: 1,
			updatedAt: 1558118786481,
			url: 'http://platform.selfkey.org/schema/attribute/bank-statement.json'
		},
		duplicateType: false
	},
	{
		uiId: '5c3f3efa3075d5573b4ad61d',
		id: '5c3f3efa3075d5573b4ad61d',
		required: true,
		schemaId: 'http://platform.selfkey.org/schema/attribute/cv.json',
		options: [],
		title: 'CV/Resume',
		description: 'A copy of a resume or CV for EACH shareholder',
		type: {
			content: {
				$id: 'http://platform.selfkey.org/schema/attribute/cv.json',
				$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
				description: 'Please provide a detailed copy of your CV',
				identityAttribute: true,
				identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
				items: {
					$id: 'http://platform.selfkey.org/schema/file/image.json',
					$schema: 'http://json-schema.org/draft-07/schema',
					format: 'file',
					properties: {
						content: { type: 'string' },
						mimeType: {
							enum: ['image/jpeg', 'image/png', 'application/pdf'],
							type: 'string'
						},
						size: { maximum: 50000000, type: 'integer' }
					},
					required: ['mimeType', 'size', 'content'],
					title: 'Image',
					type: 'object'
				},
				minItems: 1,
				noFill: true,
				title: 'CV (Resume)',
				type: 'array'
			},
			createdAt: 1556814551457,
			defaultRepositoryId: 1,
			expires: 1558205186358,
			id: 29,
			updatedAt: 1558118786452,
			url: 'http://platform.selfkey.org/schema/attribute/cv.json'
		},
		duplicateType: false
	},
	{
		uiId: '5c3f3f083075d53ed74ad61f',
		id: '5c3f3f083075d53ed74ad61f',
		required: true,
		schemaId: 'http://platform.selfkey.org/schema/attribute/professional-reference-letter.json',
		options: [],
		title: 'Professional Reference Letter',
		description:
			'This can be issued by a business partner, a lawyer, accountant, employer or previous colleague from work. This is similar to a recommendation letter.',
		type: {
			content: {
				$id:
					'http://platform.selfkey.org/schema/attribute/professional-reference-letter.json',
				$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
				description: 'Please provide a copy of a recommendation letter your received.',
				identityAttribute: true,
				identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
				items: {
					$id: 'http://platform.selfkey.org/schema/file/image.json',
					$schema: 'http://json-schema.org/draft-07/schema',
					format: 'file',
					properties: {
						content: { type: 'string' },
						mimeType: {
							enum: ['image/jpeg', 'image/png', 'application/pdf'],
							type: 'string'
						},
						size: { maximum: 50000000, type: 'integer' }
					},
					required: ['mimeType', 'size', 'content'],
					title: 'Image',
					type: 'object'
				},
				minItems: 1,
				noFill: true,
				title: 'Professional Reference Letter',
				type: 'array'
			},
			createdAt: 1556814551475,
			defaultRepositoryId: 1,
			expires: 1558205186352,
			id: 30,
			updatedAt: 1558118786435,
			url: 'http://platform.selfkey.org/schema/attribute/professional-reference-letter.json'
		},
		duplicateType: false
	}
];
