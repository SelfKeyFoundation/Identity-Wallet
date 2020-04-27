module.exports = [
	{
		attributes: [
			{
				description: 'Please enter your e-mail address.',
				id: '5e9e799126963700143ab6df',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/email.json',
				title: 'Email'
			},
			{
				description: 'First name',
				id: '5e9e799126963700143ab6e0',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/first-name.json',
				title: 'First name'
			},
			{
				description: 'Middle name',
				id: '5e9e799126963700143ab6e1',
				required: false,
				schemaId: 'http://platform.selfkey.org/schema/attribute/middle-name.json',
				title: 'Middle name'
			},
			{
				description: 'Last name',
				id: '5e9e799126963700143ab6e2',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/last-name.json',
				title: 'Last name'
			}
		],
		questions: [],
		description: 'Incorporation Individual Member Test',
		id: '5e9e799126963700143ab6de',
		memberTemplates: [
			{
				legalEntityTypes: [],
				memberRoles: [
					'director_ltd',
					'shareholder',
					'ubo',
					'observer',
					'authorizedSignatory',
					'other',
					'manager',
					'member_llc',
					'other_llc',
					'grantor',
					'beneficiary_tst',
					'trustee',
					'protector',
					'founder',
					'director_fnd',
					'supervisor',
					'beneficiary_fnd',
					'generalPartner',
					'limitedPartner',
					'member'
				],
				memberType: 'individual',
				template: null
			}
		],
		name: 'Incorporation Individual Member Test',
		type: 'individual'
	},
	{
		attributes: [
			{
				description: 'Please enter your e-mail address.',
				id: '5e9e78e226963700143ab6d5',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/email.json',
				title: 'Email'
			},
			{
				description:
					'Please provide the name of your company, as it appears in official documents',
				id: '5e9e78e226963700143ab6d6',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/company-name.json',
				title: 'Company name'
			},
			{
				description: 'Please specify the type of legal entity.',
				id: '5e9e78e226963700143ab6d7',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
				title: 'Legal Entity Type'
			}
		],
		questions: [],
		description: 'test',
		id: '5e9e78e226963700143ab6d4',
		memberTemplates: [
			{
				legalEntityTypes: ['ltd', 'llc', 'tst', 'fnd', 'llp', 'other_company'],
				memberRoles: [
					'director_ltd',
					'shareholder',
					'ubo',
					'observer',
					'authorizedSignatory',
					'other',
					'manager',
					'member_llc',
					'other_llc',
					'grantor',
					'beneficiary_tst',
					'trustee',
					'protector',
					'founder',
					'director_fnd',
					'supervisor',
					'beneficiary_fnd',
					'generalPartner',
					'limitedPartner',
					'member'
				],
				memberType: 'corporate',
				template: null
			},
			{
				legalEntityTypes: [],
				memberRoles: [
					'director_ltd',
					'shareholder',
					'ubo',
					'observer',
					'authorizedSignatory',
					'other',
					'manager',
					'member_llc',
					'other_llc',
					'grantor',
					'beneficiary_tst',
					'trustee',
					'protector',
					'founder',
					'director_fnd',
					'supervisor',
					'beneficiary_fnd',
					'generalPartner',
					'limitedPartner',
					'member'
				],
				memberType: 'individual',
				template: null
			},
			{
				legalEntityTypes: ['llc'],
				memberRoles: ['member_llc'],
				memberType: 'corporate',
				template: '5e9e79d226963700143ab6e6'
			},
			{
				legalEntityTypes: [],
				memberRoles: ['member_llc'],
				memberType: 'individual',
				template: '5e9e799126963700143ab6de'
			},
			{
				legalEntityTypes: ['ltd', 'llc'],
				memberRoles: ['ubo'],
				memberType: 'individual',
				template: '5e9e7a1226963700143ab6ee'
			},
			{
				legalEntityTypes: [],
				memberRoles: ['ubo'],
				memberType: 'individual',
				template: '5e9e7a1226963700143ab6ee'
			},
			{
				legalEntityTypes: ['llc', 'ltd'],
				memberRoles: ['ubo'],
				memberType: 'corporate',
				template: '5e9e7a3c26963700143ab6f7'
			},
			{
				legalEntityTypes: ['llc'],
				memberRoles: ['member_llc'],
				memberType: 'individual',
				template: '5e9e799126963700143ab6de'
			}
		],
		name: 'Incorporation Test Main',
		type: 'corporate'
	}
];
