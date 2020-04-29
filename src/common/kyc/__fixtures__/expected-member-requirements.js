module.exports = [
	{
		id: 2,
		type: 'individual',
		parentId: 1,
		positions: ['member-llc'],
		userData: {},
		requirements: [
			{
				uiId: '5e9e78e226963700143ab6d5',
				id: '5e9e78e226963700143ab6d5',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/email.json',
				options: [],
				title: 'Email',
				description: 'Please enter your e-mail address.',
				duplicateType: false
			},
			{
				uiId: '5e9e78e226963700143ab6d6',
				id: '5e9e78e226963700143ab6d6',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/company-name.json',
				options: [],
				title: 'Company name',
				description:
					'Please provide the name of your company, as it appears in official documents',
				duplicateType: false
			},
			{
				uiId: '5e9e78e226963700143ab6d7',
				id: '5e9e78e226963700143ab6d7',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
				options: [],
				title: 'Legal Entity Type',
				description: 'Please specify the type of legal entity.',
				duplicateType: false
			}
		],
		memberTemplate: {
			legalEntityTypes: ['llc'],
			memberRoles: ['member_llc'],
			memberType: 'individual',
			template: '5e9e799126963700143ab6de'
		}
	},
	{
		id: 3,
		type: 'corporate',
		parentId: 1,
		positions: ['member-llc'],
		userData: {
			entityType: 'llc'
		},
		requirements: [
			{
				uiId: '5e9e78e226963700143ab6d5',
				id: '5e9e78e226963700143ab6d5',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/email.json',
				options: [],
				title: 'Email',
				description: 'Please enter your e-mail address.',
				duplicateType: false
			},
			{
				uiId: '5e9e78e226963700143ab6d6',
				id: '5e9e78e226963700143ab6d6',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/company-name.json',
				options: [],
				title: 'Company name',
				description:
					'Please provide the name of your company, as it appears in official documents',
				duplicateType: false
			},
			{
				uiId: '5e9e78e226963700143ab6d7',
				id: '5e9e78e226963700143ab6d7',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
				options: [],
				title: 'Legal Entity Type',
				description: 'Please specify the type of legal entity.',
				duplicateType: false
			}
		],
		memberTemplate: {
			legalEntityTypes: ['llc'],
			memberRoles: ['member_llc'],
			memberType: 'corporate',
			template: '5e9e79d226963700143ab6e6'
		}
	},
	{
		id: 4,
		type: 'individual',
		parentId: 3,
		positions: ['ubo'],
		userData: {},
		requirements: [
			{
				uiId: '5e9e78e226963700143ab6d5',
				id: '5e9e78e226963700143ab6d5',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/email.json',
				options: [],
				title: 'Email',
				description: 'Please enter your e-mail address.',
				duplicateType: false
			},
			{
				uiId: '5e9e78e226963700143ab6d6',
				id: '5e9e78e226963700143ab6d6',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/company-name.json',
				options: [],
				title: 'Company name',
				description:
					'Please provide the name of your company, as it appears in official documents',
				duplicateType: false
			},
			{
				uiId: '5e9e78e226963700143ab6d7',
				id: '5e9e78e226963700143ab6d7',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
				options: [],
				title: 'Legal Entity Type',
				description: 'Please specify the type of legal entity.',
				duplicateType: false
			}
		],
		memberTemplate: {
			legalEntityTypes: ['ltd', 'llc'],
			memberRoles: ['ubo'],
			memberType: 'individual',
			template: '5e9e7a1226963700143ab6ee'
		}
	}
];
