module.exports = [
	{
		attributes: [
			{
				description: 'Email',
				id: '5df10a2811ee271569c88db7',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/email.json',
				title: 'Email'
			},
			{
				description: 'Company Name',
				id: '5dfb6a6742279f5a50c864ec',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/company-name.json',
				title: 'Company Name'
			},
			{
				description: 'Legal Entity Type',
				id: '5dfb6a7c42279f59a5c864ee',
				required: true,
				schemaId: 'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
				title: 'Legal Entity Type'
			}
		],
		questions: [],
		description: 'Testing of corporate marketplace SK',
		id: '5df109f511ee2794bac88db4',
		memberTemplates: [
			{
				legalEntityTypes: [],
				memberRoles: [
					'director',
					'shareholder',
					'UBO',
					'primary contact',
					'authorised signatory',
					'member',
					'manager'
				],
				template: '5dfb5f3f42279f41d1c864e0'
			},
			{
				legalEntityTypes: ['LTD'],
				memberRoles: [
					'director',
					'shareholder',
					'UBO',
					'primary contact',
					'authorised signatory'
				],
				template: '5dfb613542279f4e79c864e6'
			}
		],
		name: 'Selfkey Corp Test',
		type: 'corporate'
	}
];
