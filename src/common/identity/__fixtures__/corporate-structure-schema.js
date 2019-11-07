export const companyTypes = [
	'Company Limited by Shares (LTD)',
	'Limited Liability Company (LLC)',
	'Trust (TST)',
	'Foundation (FND)',
	'Limited Partnership (LLP)',
	'Other'
];
export const companyEquity = {
	'Company Limited by Shares (LTD)': 'Shares',
	'Limited Liability Company (LLC)': 'Membership Interest',
	'Trust (TST)': false,
	'Foundation (FND)': false,
	'Limited Partnership (LLP)': 'Percentage',
	Other: 'Membership Interest'
};

export const positionEquity = {
	director: false,
	shareholder: 'Shares',
	ubo: false,
	observer: false,
	authorizedSignatory: false,
	manager: false,
	member: 'Membership Interest',
	grantor: false,
	beneficiary: false,
	trustee: false,
	protector: false,
	founder: false,
	'general-partner': 'Percentage',
	'limited-partner': 'Percentage'
};

export const companyPositions = {
	'Company Limited by Shares (LTD)': [
		{ position: 'director' },
		{ position: 'shareholder', equity: 'Shares' },
		{ position: 'ubo' },
		{ position: 'observer' },
		{ position: 'authorizedSignatory' }
	],
	'Limited Liability Company (LLC)': [
		{ position: 'manager' },
		{ position: 'member', equity: 'Membership Interest' },
		{ position: 'ubo' },
		{ position: 'observer' },
		{ position: 'authorizedSignatory' }
	],
	'Trust (TST)': [
		{ position: 'grantor' },
		{ position: 'beneficiary' },
		{ position: 'trustee' },
		{ position: 'protector' },
		{ position: 'ubo' },
		{ position: 'observer' },
		{ position: 'authorizedSignatory' }
	],
	'Foundation (FND)': [
		{ position: 'founder' },
		{ position: 'director' },
		{ position: 'protector' },
		{ position: 'beneficiary' },
		{ position: 'ubo' },
		{ position: 'observer' },
		{ position: 'authorizedSignatory' }
	],
	'Limited Partnership (LLP)': [
		{ position: 'general-partner', equity: 'Percentage' },
		{ position: 'limited-partner', equity: 'Percentage' },
		{ position: 'ubo' },
		{ position: 'observer' },
		{ position: 'authorizedSignatory' }
	],
	Other: [
		{ position: 'member', equity: 'Membership Interest' },
		{ position: 'ubo' },
		{ position: 'observer' },
		{ position: 'authorizedSignatory' }
	]
};
export const resolvedCorporateSchema = {
	url: 'http://platform.selfkey.org/schema/attribute/corporate-structure.json',
	schema: {
		$id: 'http://platform.selfkey.org/schema/attribute/corporate-structure.json',
		$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
		identityAttribute: true,
		system: true,
		identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
		entityType: ['corporate'],
		title: 'Corporate Structure',
		type: 'object',
		properties: {
			companyType: {
				$ref: 'http://platform.selfkey.org/schema/attribute/legal-entity-type.json'
			}
		},
		dependencies: {
			companyType: {
				oneOf: [
					{
						$ref: '#/definitions/ltd'
					},
					{
						$ref: '#/definitions/llc'
					},
					{
						$ref: '#/definitions/tst'
					},
					{
						$ref: '#/definitions/fnd'
					},
					{
						$ref: '#/definitions/llp'
					},
					{
						$ref: '#/definitions/other_company'
					}
				]
			}
		},
		definitions: {
			equity: {
				type: 'number',
				default: 0,
				minimum: 0,
				maximum: 100
			},
			ltd: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['Company Limited by Shares (LTD)']
					},
					members: {
						$ref: '#/definitions/members/ltd'
					}
				}
			},
			llc: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['Limited Liability Company (LLC)']
					},
					members: {
						$ref: '#/definitions/members/llc'
					}
				}
			},
			tst: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['Trust (TST)']
					},
					members: {
						$ref: '#/definitions/members/tst'
					}
				}
			},
			fnd: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['Foundation (FND)']
					},
					members: {
						$ref: '#/definitions/members/fnd'
					}
				}
			},
			llp: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['Limited Partnership (LLP)']
					},
					members: {
						$ref: '#/definitions/members/llp'
					}
				}
			},
			other_company: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['Other']
					},
					members: {
						$ref: '#/definitions/members/other_company'
					}
				}
			},
			members: {
				ltd: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									$ref: '#/definitions/positions/ltd'
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								$ref: '#/definitions/entities/entity'
							}
						},
						required: ['positions', 'entity']
					}
				},
				llc: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									$ref: '#/definitions/positions/llc'
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								$ref: '#/definitions/entities/entity'
							}
						},
						required: ['positions', 'entity']
					}
				},
				tst: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									$ref: '#/definitions/positions/tst'
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								$ref: '#/definitions/entities/entity'
							}
						},
						required: ['positions', 'entity']
					}
				},
				fnd: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									$ref: '#/definitions/positions/fnd'
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								$ref: '#/definitions/entities/entity'
							}
						},
						required: ['positions', 'entity']
					}
				},
				llp: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									$ref: '#/definitions/positions/llp'
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								$ref: '#/definitions/entities/entity'
							}
						},
						required: ['positions', 'entity']
					}
				},
				other_company: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									$ref: '#/definitions/positions/other_company'
								},
								minItems: 1
							},
							entity: {
								$ref: '#/definitions/entities/entity'
							}
						},
						required: ['positions', 'entity']
					}
				}
			},
			positions: {
				ltd: {
					type: 'object',
					oneOf: [
						{
							$ref: '#/definitions/positions/director'
						},
						{
							$ref: '#/definitions/positions/shareholder'
						},
						{
							$ref: '#/definitions/positions/ubo'
						},
						{
							$ref: '#/definitions/positions/observer'
						},
						{
							$ref: '#/definitions/positions/authorizedSignatory'
						}
					]
				},
				llc: {
					oneOf: [
						{
							$ref: '#/definitions/positions/manager'
						},
						{
							$ref: '#/definitions/positions/member'
						},
						{
							$ref: '#/definitions/positions/ubo'
						},
						{
							$ref: '#/definitions/positions/observer'
						},
						{
							$ref: '#/definitions/positions/authorizedSignatory'
						}
					]
				},
				tst: {
					oneOf: [
						{
							$ref: '#/definitions/positions/grantor'
						},
						{
							$ref: '#/definitions/positions/beneficiary'
						},
						{
							$ref: '#/definitions/positions/trustee'
						},
						{
							$ref: '#/definitions/positions/protector'
						},
						{
							$ref: '#/definitions/positions/ubo'
						},
						{
							$ref: '#/definitions/positions/observer'
						},
						{
							$ref: '#/definitions/positions/authorizedSignatory'
						}
					]
				},
				fnd: {
					oneOf: [
						{
							$ref: '#/definitions/positions/founder'
						},
						{
							$ref: '#/definitions/positions/director'
						},
						{
							$ref: '#/definitions/positions/supervisor'
						},
						{
							$ref: '#/definitions/positions/beneficiary'
						},
						{
							$ref: '#/definitions/positions/ubo'
						},
						{
							$ref: '#/definitions/positions/observer'
						},
						{
							$ref: '#/definitions/positions/authorizedSignatory'
						}
					]
				},
				llp: {
					oneOf: [
						{
							$ref: '#/definitions/positions/generalPartner'
						},
						{
							$ref: '#/definitions/positions/limitedPartner'
						},
						{
							$ref: '#/definitions/positions/ubo'
						},
						{
							$ref: '#/definitions/positions/observer'
						},
						{
							$ref: '#/definitions/positions/authorizedSignatory'
						}
					]
				},
				other_company: {
					oneOf: [
						{
							$ref: '#/definitions/positions/member'
						},
						{
							$ref: '#/definitions/positions/ubo'
						},
						{
							$ref: '#/definitions/positions/observer'
						},
						{
							$ref: '#/definitions/positions/authorizedSignatory'
						}
					]
				},
				director: {
					type: 'object',
					properties: {
						position: {
							const: 'director'
						}
					}
				},
				ubo: {
					type: 'object',
					properties: {
						position: {
							const: 'ubo'
						}
					}
				},
				observer: {
					type: 'object',
					properties: {
						position: {
							const: 'observer'
						}
					}
				},
				authorizedSignatory: {
					type: 'object',
					properties: {
						position: {
							const: 'authorizedSignatory'
						}
					}
				},
				shareholder: {
					type: 'object',
					properties: {
						position: {
							const: 'shareholder'
						},
						equity: {
							title: 'Shares',
							$ref: '#/definitions/equity'
						}
					}
				},
				member: {
					type: 'object',
					properties: {
						position: {
							const: 'member'
						},
						equity: {
							title: 'Membership Interest',
							$ref: '#/definitions/equity'
						}
					}
				},
				manager: {
					type: 'object',
					properties: {
						position: {
							const: 'manager'
						}
					}
				},
				grantor: {
					type: 'object',
					properties: {
						position: {
							const: 'grantor'
						}
					}
				},
				beneficiary: {
					type: 'object',
					properties: {
						position: {
							const: 'beneficiary'
						}
					}
				},
				trustee: {
					type: 'object',
					properties: {
						position: {
							const: 'trustee'
						}
					}
				},
				protector: {
					type: 'object',
					properties: {
						position: {
							const: 'protector'
						}
					}
				},
				founder: {
					type: 'object',
					properties: {
						position: {
							const: 'founder'
						}
					}
				},
				supervisor: {
					type: 'object',
					properties: {
						position: {
							const: 'protector'
						}
					}
				},
				generalPartner: {
					type: 'object',
					properties: {
						position: {
							const: 'general-partner'
						},
						equity: {
							$ref: '#/definitions/equity'
						}
					}
				},
				limitedPartner: {
					type: 'object',
					properties: {
						position: {
							const: 'limited-partner'
						},
						equity: {
							$ref: '#/definitions/equity'
						}
					}
				}
			},
			entities: {
				entity: {
					oneOf: [
						{
							$ref: '#/definitions/entities/individual'
						},
						{
							$ref: '#/definitions/entities/corporate'
						}
					]
				},
				individual: {
					type: 'object',
					properties: {
						type: {
							const: 'individual'
						},
						firstName: {
							$ref: 'http://platform.selfkey.org/schema/attribute/first-name.json'
						},
						lastName: {
							$ref: 'http://platform.selfkey.org/schema/attribute/last-name.json'
						},
						email: {
							$ref: 'http://platform.selfkey.org/schema/attribute/email.json'
						}
					},
					required: ['type', 'email']
				},
				corporate: {
					type: 'object',
					properties: {
						type: {
							const: 'corporate'
						},
						companyType: {
							$ref:
								'http://platform.selfkey.org/schema/attribute/legal-entity-type.json'
						},
						companyName: {
							$ref: 'http://platform.selfkey.org/schema/attribute/company-name.json'
						},
						email: {
							$ref: 'http://platform.selfkey.org/schema/attribute/email.json'
						}
					},
					required: ['type', 'email', 'companyType', 'companyName']
				}
			}
		},
		required: ['companyType', 'members']
	},
	dereferenced: {
		$id: 'http://platform.selfkey.org/schema/attribute/corporate-structure.json',
		$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
		identityAttribute: true,
		system: true,
		identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
		entityType: ['corporate'],
		title: 'Corporate Structure',
		type: 'object',
		properties: {
			companyType: {
				$id: 'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
				$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
				entityType: ['corporate'],
				identityAttribute: true,
				identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
				title: 'Legal Entity Type',
				description: 'Please specify the type of legal entity.',
				type: 'string',
				enum: [
					'Company Limited by Shares (LTD)',
					'Limited Liability Company (LLC)',
					'Trust (TST)',
					'Foundation (FND)',
					'Limited Partnership (LLP)',
					'Other'
				]
			}
		},
		dependencies: {
			companyType: {
				oneOf: [
					{
						type: 'object',
						properties: {
							companyType: {
								enum: ['Company Limited by Shares (LTD)']
							},
							members: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										positions: {
											type: 'array',
											items: {
												type: 'object',
												oneOf: [
													{
														type: 'object',
														properties: {
															position: {
																const: 'director'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'shareholder'
															},
															equity: {
																title: 'Shares',
																type: 'number',
																default: 0,
																minimum: 0,
																maximum: 100
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'ubo'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'observer'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'authorizedSignatory'
															}
														}
													}
												]
											},
											minItems: 1,
											uniqueItems: true
										},
										entity: {
											oneOf: [
												{
													type: 'object',
													properties: {
														type: {
															const: 'individual'
														},
														firstName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/first-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'First Name',
															description: 'Given Name.',
															type: 'string'
														},
														lastName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/last-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'Last Name',
															description: 'Family Name.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: ['type', 'email']
												},
												{
													type: 'object',
													properties: {
														type: {
															const: 'corporate'
														},
														companyType: {
															$id:
																'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															entityType: ['corporate'],
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															title: 'Legal Entity Type',
															description:
																'Please specify the type of legal entity.',
															type: 'string',
															enum: [
																'Company Limited by Shares (LTD)',
																'Limited Liability Company (LLC)',
																'Trust (TST)',
																'Foundation (FND)',
																'Limited Partnership (LLP)',
																'Other'
															]
														},
														companyName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/company-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate'],
															title: 'Company Name',
															description:
																'Please provide the name of your company, as it appears in official documents.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: [
														'type',
														'email',
														'companyType',
														'companyName'
													]
												}
											]
										}
									},
									required: ['positions', 'entity']
								}
							}
						}
					},
					{
						type: 'object',
						properties: {
							companyType: {
								enum: ['Limited Liability Company (LLC)']
							},
							members: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										positions: {
											type: 'array',
											items: {
												oneOf: [
													{
														type: 'object',
														properties: {
															position: {
																const: 'manager'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'member'
															},
															equity: {
																title: 'Membership Interest',
																type: 'number',
																default: 0,
																minimum: 0,
																maximum: 100
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'ubo'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'observer'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'authorizedSignatory'
															}
														}
													}
												]
											},
											minItems: 1,
											uniqueItems: true
										},
										entity: {
											oneOf: [
												{
													type: 'object',
													properties: {
														type: {
															const: 'individual'
														},
														firstName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/first-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'First Name',
															description: 'Given Name.',
															type: 'string'
														},
														lastName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/last-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'Last Name',
															description: 'Family Name.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: ['type', 'email']
												},
												{
													type: 'object',
													properties: {
														type: {
															const: 'corporate'
														},
														companyType: {
															$id:
																'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															entityType: ['corporate'],
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															title: 'Legal Entity Type',
															description:
																'Please specify the type of legal entity.',
															type: 'string',
															enum: [
																'Company Limited by Shares (LTD)',
																'Limited Liability Company (LLC)',
																'Trust (TST)',
																'Foundation (FND)',
																'Limited Partnership (LLP)',
																'Other'
															]
														},
														companyName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/company-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate'],
															title: 'Company Name',
															description:
																'Please provide the name of your company, as it appears in official documents.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: [
														'type',
														'email',
														'companyType',
														'companyName'
													]
												}
											]
										}
									},
									required: ['positions', 'entity']
								}
							}
						}
					},
					{
						type: 'object',
						properties: {
							companyType: {
								enum: ['Trust (TST)']
							},
							members: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										positions: {
											type: 'array',
											items: {
												oneOf: [
													{
														type: 'object',
														properties: {
															position: {
																const: 'grantor'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'beneficiary'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'trustee'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'protector'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'ubo'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'observer'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'authorizedSignatory'
															}
														}
													}
												]
											},
											minItems: 1,
											uniqueItems: true
										},
										entity: {
											oneOf: [
												{
													type: 'object',
													properties: {
														type: {
															const: 'individual'
														},
														firstName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/first-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'First Name',
															description: 'Given Name.',
															type: 'string'
														},
														lastName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/last-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'Last Name',
															description: 'Family Name.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: ['type', 'email']
												},
												{
													type: 'object',
													properties: {
														type: {
															const: 'corporate'
														},
														companyType: {
															$id:
																'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															entityType: ['corporate'],
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															title: 'Legal Entity Type',
															description:
																'Please specify the type of legal entity.',
															type: 'string',
															enum: [
																'Company Limited by Shares (LTD)',
																'Limited Liability Company (LLC)',
																'Trust (TST)',
																'Foundation (FND)',
																'Limited Partnership (LLP)',
																'Other'
															]
														},
														companyName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/company-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate'],
															title: 'Company Name',
															description:
																'Please provide the name of your company, as it appears in official documents.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: [
														'type',
														'email',
														'companyType',
														'companyName'
													]
												}
											]
										}
									},
									required: ['positions', 'entity']
								}
							}
						}
					},
					{
						type: 'object',
						properties: {
							companyType: {
								enum: ['Foundation (FND)']
							},
							members: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										positions: {
											type: 'array',
											items: {
												oneOf: [
													{
														type: 'object',
														properties: {
															position: {
																const: 'founder'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'director'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'protector'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'beneficiary'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'ubo'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'observer'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'authorizedSignatory'
															}
														}
													}
												]
											},
											minItems: 1,
											uniqueItems: true
										},
										entity: {
											oneOf: [
												{
													type: 'object',
													properties: {
														type: {
															const: 'individual'
														},
														firstName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/first-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'First Name',
															description: 'Given Name.',
															type: 'string'
														},
														lastName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/last-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'Last Name',
															description: 'Family Name.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: ['type', 'email']
												},
												{
													type: 'object',
													properties: {
														type: {
															const: 'corporate'
														},
														companyType: {
															$id:
																'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															entityType: ['corporate'],
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															title: 'Legal Entity Type',
															description:
																'Please specify the type of legal entity.',
															type: 'string',
															enum: [
																'Company Limited by Shares (LTD)',
																'Limited Liability Company (LLC)',
																'Trust (TST)',
																'Foundation (FND)',
																'Limited Partnership (LLP)',
																'Other'
															]
														},
														companyName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/company-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate'],
															title: 'Company Name',
															description:
																'Please provide the name of your company, as it appears in official documents.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: [
														'type',
														'email',
														'companyType',
														'companyName'
													]
												}
											]
										}
									},
									required: ['positions', 'entity']
								}
							}
						}
					},
					{
						type: 'object',
						properties: {
							companyType: {
								enum: ['Limited Partnership (LLP)']
							},
							members: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										positions: {
											type: 'array',
											items: {
												oneOf: [
													{
														type: 'object',
														properties: {
															position: {
																const: 'general-partner'
															},
															equity: {
																type: 'number',
																default: 0,
																minimum: 0,
																maximum: 100
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'limited-partner'
															},
															equity: {
																type: 'number',
																default: 0,
																minimum: 0,
																maximum: 100
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'ubo'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'observer'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'authorizedSignatory'
															}
														}
													}
												]
											},
											minItems: 1,
											uniqueItems: true
										},
										entity: {
											oneOf: [
												{
													type: 'object',
													properties: {
														type: {
															const: 'individual'
														},
														firstName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/first-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'First Name',
															description: 'Given Name.',
															type: 'string'
														},
														lastName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/last-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'Last Name',
															description: 'Family Name.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: ['type', 'email']
												},
												{
													type: 'object',
													properties: {
														type: {
															const: 'corporate'
														},
														companyType: {
															$id:
																'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															entityType: ['corporate'],
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															title: 'Legal Entity Type',
															description:
																'Please specify the type of legal entity.',
															type: 'string',
															enum: [
																'Company Limited by Shares (LTD)',
																'Limited Liability Company (LLC)',
																'Trust (TST)',
																'Foundation (FND)',
																'Limited Partnership (LLP)',
																'Other'
															]
														},
														companyName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/company-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate'],
															title: 'Company Name',
															description:
																'Please provide the name of your company, as it appears in official documents.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: [
														'type',
														'email',
														'companyType',
														'companyName'
													]
												}
											]
										}
									},
									required: ['positions', 'entity']
								}
							}
						}
					},
					{
						type: 'object',
						properties: {
							companyType: {
								enum: ['Other']
							},
							members: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										positions: {
											type: 'array',
											items: {
												oneOf: [
													{
														type: 'object',
														properties: {
															position: {
																const: 'member'
															},
															equity: {
																title: 'Membership Interest',
																type: 'number',
																default: 0,
																minimum: 0,
																maximum: 100
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'ubo'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'observer'
															}
														}
													},
													{
														type: 'object',
														properties: {
															position: {
																const: 'authorizedSignatory'
															}
														}
													}
												]
											},
											minItems: 1
										},
										entity: {
											oneOf: [
												{
													type: 'object',
													properties: {
														type: {
															const: 'individual'
														},
														firstName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/first-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'First Name',
															description: 'Given Name.',
															type: 'string'
														},
														lastName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/last-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['individual'],
															title: 'Last Name',
															description: 'Family Name.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: ['type', 'email']
												},
												{
													type: 'object',
													properties: {
														type: {
															const: 'corporate'
														},
														companyType: {
															$id:
																'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															entityType: ['corporate'],
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															title: 'Legal Entity Type',
															description:
																'Please specify the type of legal entity.',
															type: 'string',
															enum: [
																'Company Limited by Shares (LTD)',
																'Limited Liability Company (LLC)',
																'Trust (TST)',
																'Foundation (FND)',
																'Limited Partnership (LLP)',
																'Other'
															]
														},
														companyName: {
															$id:
																'http://platform.selfkey.org/schema/attribute/company-name.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate'],
															title: 'Company Name',
															description:
																'Please provide the name of your company, as it appears in official documents.',
															type: 'string'
														},
														email: {
															$id:
																'http://platform.selfkey.org/schema/attribute/email.json',
															$schema:
																'http://platform.selfkey.org/schema/identity-attribute.json',
															identityAttribute: true,
															identityAttributeRepository:
																'http://platform.selfkey.org/repository.json',
															entityType: ['corporate', 'individual'],
															title: 'Email',
															description:
																'Please enter your e-mail address.',
															type: 'string',
															format: 'email'
														}
													},
													required: [
														'type',
														'email',
														'companyType',
														'companyName'
													]
												}
											]
										}
									},
									required: ['positions', 'entity']
								}
							}
						}
					}
				]
			}
		},
		definitions: {
			equity: {
				type: 'number',
				default: 0,
				minimum: 0,
				maximum: 100
			},
			ltd: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['Company Limited by Shares (LTD)']
					},
					members: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								positions: {
									type: 'array',
									items: {
										type: 'object',
										oneOf: [
											{
												type: 'object',
												properties: {
													position: {
														const: 'director'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'shareholder'
													},
													equity: {
														title: 'Shares',
														type: 'number',
														default: 0,
														minimum: 0,
														maximum: 100
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'ubo'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'observer'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'authorizedSignatory'
													}
												}
											}
										]
									},
									minItems: 1,
									uniqueItems: true
								},
								entity: {
									oneOf: [
										{
											type: 'object',
											properties: {
												type: {
													const: 'individual'
												},
												firstName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/first-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'First Name',
													description: 'Given Name.',
													type: 'string'
												},
												lastName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/last-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'Last Name',
													description: 'Family Name.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: ['type', 'email']
										},
										{
											type: 'object',
											properties: {
												type: {
													const: 'corporate'
												},
												companyType: {
													$id:
														'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													entityType: ['corporate'],
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													title: 'Legal Entity Type',
													description:
														'Please specify the type of legal entity.',
													type: 'string',
													enum: [
														'Company Limited by Shares (LTD)',
														'Limited Liability Company (LLC)',
														'Trust (TST)',
														'Foundation (FND)',
														'Limited Partnership (LLP)',
														'Other'
													]
												},
												companyName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/company-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate'],
													title: 'Company Name',
													description:
														'Please provide the name of your company, as it appears in official documents.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: [
												'type',
												'email',
												'companyType',
												'companyName'
											]
										}
									]
								}
							},
							required: ['positions', 'entity']
						}
					}
				}
			},
			llc: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['Limited Liability Company (LLC)']
					},
					members: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								positions: {
									type: 'array',
									items: {
										oneOf: [
											{
												type: 'object',
												properties: {
													position: {
														const: 'manager'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'member'
													},
													equity: {
														title: 'Membership Interest',
														type: 'number',
														default: 0,
														minimum: 0,
														maximum: 100
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'ubo'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'observer'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'authorizedSignatory'
													}
												}
											}
										]
									},
									minItems: 1,
									uniqueItems: true
								},
								entity: {
									oneOf: [
										{
											type: 'object',
											properties: {
												type: {
													const: 'individual'
												},
												firstName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/first-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'First Name',
													description: 'Given Name.',
													type: 'string'
												},
												lastName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/last-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'Last Name',
													description: 'Family Name.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: ['type', 'email']
										},
										{
											type: 'object',
											properties: {
												type: {
													const: 'corporate'
												},
												companyType: {
													$id:
														'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													entityType: ['corporate'],
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													title: 'Legal Entity Type',
													description:
														'Please specify the type of legal entity.',
													type: 'string',
													enum: [
														'Company Limited by Shares (LTD)',
														'Limited Liability Company (LLC)',
														'Trust (TST)',
														'Foundation (FND)',
														'Limited Partnership (LLP)',
														'Other'
													]
												},
												companyName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/company-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate'],
													title: 'Company Name',
													description:
														'Please provide the name of your company, as it appears in official documents.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: [
												'type',
												'email',
												'companyType',
												'companyName'
											]
										}
									]
								}
							},
							required: ['positions', 'entity']
						}
					}
				}
			},
			tst: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['Trust (TST)']
					},
					members: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								positions: {
									type: 'array',
									items: {
										oneOf: [
											{
												type: 'object',
												properties: {
													position: {
														const: 'grantor'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'beneficiary'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'trustee'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'protector'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'ubo'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'observer'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'authorizedSignatory'
													}
												}
											}
										]
									},
									minItems: 1,
									uniqueItems: true
								},
								entity: {
									oneOf: [
										{
											type: 'object',
											properties: {
												type: {
													const: 'individual'
												},
												firstName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/first-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'First Name',
													description: 'Given Name.',
													type: 'string'
												},
												lastName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/last-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'Last Name',
													description: 'Family Name.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: ['type', 'email']
										},
										{
											type: 'object',
											properties: {
												type: {
													const: 'corporate'
												},
												companyType: {
													$id:
														'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													entityType: ['corporate'],
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													title: 'Legal Entity Type',
													description:
														'Please specify the type of legal entity.',
													type: 'string',
													enum: [
														'Company Limited by Shares (LTD)',
														'Limited Liability Company (LLC)',
														'Trust (TST)',
														'Foundation (FND)',
														'Limited Partnership (LLP)',
														'Other'
													]
												},
												companyName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/company-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate'],
													title: 'Company Name',
													description:
														'Please provide the name of your company, as it appears in official documents.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: [
												'type',
												'email',
												'companyType',
												'companyName'
											]
										}
									]
								}
							},
							required: ['positions', 'entity']
						}
					}
				}
			},
			fnd: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['Foundation (FND)']
					},
					members: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								positions: {
									type: 'array',
									items: {
										oneOf: [
											{
												type: 'object',
												properties: {
													position: {
														const: 'founder'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'director'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'protector'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'beneficiary'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'ubo'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'observer'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'authorizedSignatory'
													}
												}
											}
										]
									},
									minItems: 1,
									uniqueItems: true
								},
								entity: {
									oneOf: [
										{
											type: 'object',
											properties: {
												type: {
													const: 'individual'
												},
												firstName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/first-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'First Name',
													description: 'Given Name.',
													type: 'string'
												},
												lastName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/last-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'Last Name',
													description: 'Family Name.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: ['type', 'email']
										},
										{
											type: 'object',
											properties: {
												type: {
													const: 'corporate'
												},
												companyType: {
													$id:
														'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													entityType: ['corporate'],
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													title: 'Legal Entity Type',
													description:
														'Please specify the type of legal entity.',
													type: 'string',
													enum: [
														'Company Limited by Shares (LTD)',
														'Limited Liability Company (LLC)',
														'Trust (TST)',
														'Foundation (FND)',
														'Limited Partnership (LLP)',
														'Other'
													]
												},
												companyName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/company-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate'],
													title: 'Company Name',
													description:
														'Please provide the name of your company, as it appears in official documents.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: [
												'type',
												'email',
												'companyType',
												'companyName'
											]
										}
									]
								}
							},
							required: ['positions', 'entity']
						}
					}
				}
			},
			llp: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['Limited Partnership (LLP)']
					},
					members: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								positions: {
									type: 'array',
									items: {
										oneOf: [
											{
												type: 'object',
												properties: {
													position: {
														const: 'general-partner'
													},
													equity: {
														type: 'number',
														default: 0,
														minimum: 0,
														maximum: 100
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'limited-partner'
													},
													equity: {
														type: 'number',
														default: 0,
														minimum: 0,
														maximum: 100
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'ubo'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'observer'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'authorizedSignatory'
													}
												}
											}
										]
									},
									minItems: 1,
									uniqueItems: true
								},
								entity: {
									oneOf: [
										{
											type: 'object',
											properties: {
												type: {
													const: 'individual'
												},
												firstName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/first-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'First Name',
													description: 'Given Name.',
													type: 'string'
												},
												lastName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/last-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'Last Name',
													description: 'Family Name.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: ['type', 'email']
										},
										{
											type: 'object',
											properties: {
												type: {
													const: 'corporate'
												},
												companyType: {
													$id:
														'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													entityType: ['corporate'],
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													title: 'Legal Entity Type',
													description:
														'Please specify the type of legal entity.',
													type: 'string',
													enum: [
														'Company Limited by Shares (LTD)',
														'Limited Liability Company (LLC)',
														'Trust (TST)',
														'Foundation (FND)',
														'Limited Partnership (LLP)',
														'Other'
													]
												},
												companyName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/company-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate'],
													title: 'Company Name',
													description:
														'Please provide the name of your company, as it appears in official documents.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: [
												'type',
												'email',
												'companyType',
												'companyName'
											]
										}
									]
								}
							},
							required: ['positions', 'entity']
						}
					}
				}
			},
			other_company: {
				type: 'object',
				properties: {
					companyType: {
						enum: ['Other']
					},
					members: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								positions: {
									type: 'array',
									items: {
										oneOf: [
											{
												type: 'object',
												properties: {
													position: {
														const: 'member'
													},
													equity: {
														title: 'Membership Interest',
														type: 'number',
														default: 0,
														minimum: 0,
														maximum: 100
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'ubo'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'observer'
													}
												}
											},
											{
												type: 'object',
												properties: {
													position: {
														const: 'authorizedSignatory'
													}
												}
											}
										]
									},
									minItems: 1
								},
								entity: {
									oneOf: [
										{
											type: 'object',
											properties: {
												type: {
													const: 'individual'
												},
												firstName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/first-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'First Name',
													description: 'Given Name.',
													type: 'string'
												},
												lastName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/last-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['individual'],
													title: 'Last Name',
													description: 'Family Name.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: ['type', 'email']
										},
										{
											type: 'object',
											properties: {
												type: {
													const: 'corporate'
												},
												companyType: {
													$id:
														'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													entityType: ['corporate'],
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													title: 'Legal Entity Type',
													description:
														'Please specify the type of legal entity.',
													type: 'string',
													enum: [
														'Company Limited by Shares (LTD)',
														'Limited Liability Company (LLC)',
														'Trust (TST)',
														'Foundation (FND)',
														'Limited Partnership (LLP)',
														'Other'
													]
												},
												companyName: {
													$id:
														'http://platform.selfkey.org/schema/attribute/company-name.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate'],
													title: 'Company Name',
													description:
														'Please provide the name of your company, as it appears in official documents.',
													type: 'string'
												},
												email: {
													$id:
														'http://platform.selfkey.org/schema/attribute/email.json',
													$schema:
														'http://platform.selfkey.org/schema/identity-attribute.json',
													identityAttribute: true,
													identityAttributeRepository:
														'http://platform.selfkey.org/repository.json',
													entityType: ['corporate', 'individual'],
													title: 'Email',
													description:
														'Please enter your e-mail address.',
													type: 'string',
													format: 'email'
												}
											},
											required: [
												'type',
												'email',
												'companyType',
												'companyName'
											]
										}
									]
								}
							},
							required: ['positions', 'entity']
						}
					}
				}
			},
			members: {
				ltd: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									type: 'object',
									oneOf: [
										{
											type: 'object',
											properties: {
												position: {
													const: 'director'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'shareholder'
												},
												equity: {
													title: 'Shares',
													type: 'number',
													default: 0,
													minimum: 0,
													maximum: 100
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'ubo'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'observer'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'authorizedSignatory'
												}
											}
										}
									]
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								oneOf: [
									{
										type: 'object',
										properties: {
											type: {
												const: 'individual'
											},
											firstName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/first-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'First Name',
												description: 'Given Name.',
												type: 'string'
											},
											lastName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/last-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'Last Name',
												description: 'Family Name.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email']
									},
									{
										type: 'object',
										properties: {
											type: {
												const: 'corporate'
											},
											companyType: {
												$id:
													'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												entityType: ['corporate'],
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												title: 'Legal Entity Type',
												description:
													'Please specify the type of legal entity.',
												type: 'string',
												enum: [
													'Company Limited by Shares (LTD)',
													'Limited Liability Company (LLC)',
													'Trust (TST)',
													'Foundation (FND)',
													'Limited Partnership (LLP)',
													'Other'
												]
											},
											companyName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/company-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate'],
												title: 'Company Name',
												description:
													'Please provide the name of your company, as it appears in official documents.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email', 'companyType', 'companyName']
									}
								]
							}
						},
						required: ['positions', 'entity']
					}
				},
				llc: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									oneOf: [
										{
											type: 'object',
											properties: {
												position: {
													const: 'manager'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'member'
												},
												equity: {
													title: 'Membership Interest',
													type: 'number',
													default: 0,
													minimum: 0,
													maximum: 100
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'ubo'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'observer'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'authorizedSignatory'
												}
											}
										}
									]
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								oneOf: [
									{
										type: 'object',
										properties: {
											type: {
												const: 'individual'
											},
											firstName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/first-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'First Name',
												description: 'Given Name.',
												type: 'string'
											},
											lastName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/last-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'Last Name',
												description: 'Family Name.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email']
									},
									{
										type: 'object',
										properties: {
											type: {
												const: 'corporate'
											},
											companyType: {
												$id:
													'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												entityType: ['corporate'],
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												title: 'Legal Entity Type',
												description:
													'Please specify the type of legal entity.',
												type: 'string',
												enum: [
													'Company Limited by Shares (LTD)',
													'Limited Liability Company (LLC)',
													'Trust (TST)',
													'Foundation (FND)',
													'Limited Partnership (LLP)',
													'Other'
												]
											},
											companyName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/company-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate'],
												title: 'Company Name',
												description:
													'Please provide the name of your company, as it appears in official documents.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email', 'companyType', 'companyName']
									}
								]
							}
						},
						required: ['positions', 'entity']
					}
				},
				tst: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									oneOf: [
										{
											type: 'object',
											properties: {
												position: {
													const: 'grantor'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'beneficiary'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'trustee'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'protector'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'ubo'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'observer'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'authorizedSignatory'
												}
											}
										}
									]
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								oneOf: [
									{
										type: 'object',
										properties: {
											type: {
												const: 'individual'
											},
											firstName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/first-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'First Name',
												description: 'Given Name.',
												type: 'string'
											},
											lastName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/last-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'Last Name',
												description: 'Family Name.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email']
									},
									{
										type: 'object',
										properties: {
											type: {
												const: 'corporate'
											},
											companyType: {
												$id:
													'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												entityType: ['corporate'],
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												title: 'Legal Entity Type',
												description:
													'Please specify the type of legal entity.',
												type: 'string',
												enum: [
													'Company Limited by Shares (LTD)',
													'Limited Liability Company (LLC)',
													'Trust (TST)',
													'Foundation (FND)',
													'Limited Partnership (LLP)',
													'Other'
												]
											},
											companyName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/company-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate'],
												title: 'Company Name',
												description:
													'Please provide the name of your company, as it appears in official documents.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email', 'companyType', 'companyName']
									}
								]
							}
						},
						required: ['positions', 'entity']
					}
				},
				fnd: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									oneOf: [
										{
											type: 'object',
											properties: {
												position: {
													const: 'founder'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'director'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'protector'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'beneficiary'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'ubo'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'observer'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'authorizedSignatory'
												}
											}
										}
									]
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								oneOf: [
									{
										type: 'object',
										properties: {
											type: {
												const: 'individual'
											},
											firstName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/first-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'First Name',
												description: 'Given Name.',
												type: 'string'
											},
											lastName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/last-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'Last Name',
												description: 'Family Name.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email']
									},
									{
										type: 'object',
										properties: {
											type: {
												const: 'corporate'
											},
											companyType: {
												$id:
													'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												entityType: ['corporate'],
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												title: 'Legal Entity Type',
												description:
													'Please specify the type of legal entity.',
												type: 'string',
												enum: [
													'Company Limited by Shares (LTD)',
													'Limited Liability Company (LLC)',
													'Trust (TST)',
													'Foundation (FND)',
													'Limited Partnership (LLP)',
													'Other'
												]
											},
											companyName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/company-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate'],
												title: 'Company Name',
												description:
													'Please provide the name of your company, as it appears in official documents.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email', 'companyType', 'companyName']
									}
								]
							}
						},
						required: ['positions', 'entity']
					}
				},
				llp: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									oneOf: [
										{
											type: 'object',
											properties: {
												position: {
													const: 'general-partner'
												},
												equity: {
													type: 'number',
													default: 0,
													minimum: 0,
													maximum: 100
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'limited-partner'
												},
												equity: {
													type: 'number',
													default: 0,
													minimum: 0,
													maximum: 100
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'ubo'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'observer'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'authorizedSignatory'
												}
											}
										}
									]
								},
								minItems: 1,
								uniqueItems: true
							},
							entity: {
								oneOf: [
									{
										type: 'object',
										properties: {
											type: {
												const: 'individual'
											},
											firstName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/first-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'First Name',
												description: 'Given Name.',
												type: 'string'
											},
											lastName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/last-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'Last Name',
												description: 'Family Name.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email']
									},
									{
										type: 'object',
										properties: {
											type: {
												const: 'corporate'
											},
											companyType: {
												$id:
													'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												entityType: ['corporate'],
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												title: 'Legal Entity Type',
												description:
													'Please specify the type of legal entity.',
												type: 'string',
												enum: [
													'Company Limited by Shares (LTD)',
													'Limited Liability Company (LLC)',
													'Trust (TST)',
													'Foundation (FND)',
													'Limited Partnership (LLP)',
													'Other'
												]
											},
											companyName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/company-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate'],
												title: 'Company Name',
												description:
													'Please provide the name of your company, as it appears in official documents.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email', 'companyType', 'companyName']
									}
								]
							}
						},
						required: ['positions', 'entity']
					}
				},
				other_company: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							positions: {
								type: 'array',
								items: {
									oneOf: [
										{
											type: 'object',
											properties: {
												position: {
													const: 'member'
												},
												equity: {
													title: 'Membership Interest',
													type: 'number',
													default: 0,
													minimum: 0,
													maximum: 100
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'ubo'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'observer'
												}
											}
										},
										{
											type: 'object',
											properties: {
												position: {
													const: 'authorizedSignatory'
												}
											}
										}
									]
								},
								minItems: 1
							},
							entity: {
								oneOf: [
									{
										type: 'object',
										properties: {
											type: {
												const: 'individual'
											},
											firstName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/first-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'First Name',
												description: 'Given Name.',
												type: 'string'
											},
											lastName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/last-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['individual'],
												title: 'Last Name',
												description: 'Family Name.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email']
									},
									{
										type: 'object',
										properties: {
											type: {
												const: 'corporate'
											},
											companyType: {
												$id:
													'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												entityType: ['corporate'],
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												title: 'Legal Entity Type',
												description:
													'Please specify the type of legal entity.',
												type: 'string',
												enum: [
													'Company Limited by Shares (LTD)',
													'Limited Liability Company (LLC)',
													'Trust (TST)',
													'Foundation (FND)',
													'Limited Partnership (LLP)',
													'Other'
												]
											},
											companyName: {
												$id:
													'http://platform.selfkey.org/schema/attribute/company-name.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate'],
												title: 'Company Name',
												description:
													'Please provide the name of your company, as it appears in official documents.',
												type: 'string'
											},
											email: {
												$id:
													'http://platform.selfkey.org/schema/attribute/email.json',
												$schema:
													'http://platform.selfkey.org/schema/identity-attribute.json',
												identityAttribute: true,
												identityAttributeRepository:
													'http://platform.selfkey.org/repository.json',
												entityType: ['corporate', 'individual'],
												title: 'Email',
												description: 'Please enter your e-mail address.',
												type: 'string',
												format: 'email'
											}
										},
										required: ['type', 'email', 'companyType', 'companyName']
									}
								]
							}
						},
						required: ['positions', 'entity']
					}
				}
			},
			positions: {
				ltd: {
					type: 'object',
					oneOf: [
						{
							type: 'object',
							properties: {
								position: {
									const: 'director'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'shareholder'
								},
								equity: {
									title: 'Shares',
									type: 'number',
									default: 0,
									minimum: 0,
									maximum: 100
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'ubo'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'observer'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'authorizedSignatory'
								}
							}
						}
					]
				},
				llc: {
					oneOf: [
						{
							type: 'object',
							properties: {
								position: {
									const: 'manager'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'member'
								},
								equity: {
									title: 'Membership Interest',
									type: 'number',
									default: 0,
									minimum: 0,
									maximum: 100
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'ubo'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'observer'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'authorizedSignatory'
								}
							}
						}
					]
				},
				tst: {
					oneOf: [
						{
							type: 'object',
							properties: {
								position: {
									const: 'grantor'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'beneficiary'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'trustee'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'protector'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'ubo'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'observer'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'authorizedSignatory'
								}
							}
						}
					]
				},
				fnd: {
					oneOf: [
						{
							type: 'object',
							properties: {
								position: {
									const: 'founder'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'director'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'protector'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'beneficiary'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'ubo'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'observer'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'authorizedSignatory'
								}
							}
						}
					]
				},
				llp: {
					oneOf: [
						{
							type: 'object',
							properties: {
								position: {
									const: 'general-partner'
								},
								equity: {
									type: 'number',
									default: 0,
									minimum: 0,
									maximum: 100
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'limited-partner'
								},
								equity: {
									type: 'number',
									default: 0,
									minimum: 0,
									maximum: 100
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'ubo'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'observer'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'authorizedSignatory'
								}
							}
						}
					]
				},
				other_company: {
					oneOf: [
						{
							type: 'object',
							properties: {
								position: {
									const: 'member'
								},
								equity: {
									title: 'Membership Interest',
									type: 'number',
									default: 0,
									minimum: 0,
									maximum: 100
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'ubo'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'observer'
								}
							}
						},
						{
							type: 'object',
							properties: {
								position: {
									const: 'authorizedSignatory'
								}
							}
						}
					]
				},
				director: {
					type: 'object',
					properties: {
						position: {
							const: 'director'
						}
					}
				},
				ubo: {
					type: 'object',
					properties: {
						position: {
							const: 'ubo'
						}
					}
				},
				observer: {
					type: 'object',
					properties: {
						position: {
							const: 'observer'
						}
					}
				},
				authorizedSignatory: {
					type: 'object',
					properties: {
						position: {
							const: 'authorizedSignatory'
						}
					}
				},
				shareholder: {
					type: 'object',
					properties: {
						position: {
							const: 'shareholder'
						},
						equity: {
							title: 'Shares',
							type: 'number',
							default: 0,
							minimum: 0,
							maximum: 100
						}
					}
				},
				member: {
					type: 'object',
					properties: {
						position: {
							const: 'member'
						},
						equity: {
							title: 'Membership Interest',
							type: 'number',
							default: 0,
							minimum: 0,
							maximum: 100
						}
					}
				},
				manager: {
					type: 'object',
					properties: {
						position: {
							const: 'manager'
						}
					}
				},
				grantor: {
					type: 'object',
					properties: {
						position: {
							const: 'grantor'
						}
					}
				},
				beneficiary: {
					type: 'object',
					properties: {
						position: {
							const: 'beneficiary'
						}
					}
				},
				trustee: {
					type: 'object',
					properties: {
						position: {
							const: 'trustee'
						}
					}
				},
				protector: {
					type: 'object',
					properties: {
						position: {
							const: 'protector'
						}
					}
				},
				founder: {
					type: 'object',
					properties: {
						position: {
							const: 'founder'
						}
					}
				},
				supervisor: {
					type: 'object',
					properties: {
						position: {
							const: 'protector'
						}
					}
				},
				generalPartner: {
					type: 'object',
					properties: {
						position: {
							const: 'general-partner'
						},
						equity: {
							type: 'number',
							default: 0,
							minimum: 0,
							maximum: 100
						}
					}
				},
				limitedPartner: {
					type: 'object',
					properties: {
						position: {
							const: 'limited-partner'
						},
						equity: {
							type: 'number',
							default: 0,
							minimum: 0,
							maximum: 100
						}
					}
				}
			},
			entities: {
				entity: {
					oneOf: [
						{
							type: 'object',
							properties: {
								type: {
									const: 'individual'
								},
								firstName: {
									$id:
										'http://platform.selfkey.org/schema/attribute/first-name.json',
									$schema:
										'http://platform.selfkey.org/schema/identity-attribute.json',
									identityAttribute: true,
									identityAttributeRepository:
										'http://platform.selfkey.org/repository.json',
									entityType: ['individual'],
									title: 'First Name',
									description: 'Given Name.',
									type: 'string'
								},
								lastName: {
									$id:
										'http://platform.selfkey.org/schema/attribute/last-name.json',
									$schema:
										'http://platform.selfkey.org/schema/identity-attribute.json',
									identityAttribute: true,
									identityAttributeRepository:
										'http://platform.selfkey.org/repository.json',
									entityType: ['individual'],
									title: 'Last Name',
									description: 'Family Name.',
									type: 'string'
								},
								email: {
									$id: 'http://platform.selfkey.org/schema/attribute/email.json',
									$schema:
										'http://platform.selfkey.org/schema/identity-attribute.json',
									identityAttribute: true,
									identityAttributeRepository:
										'http://platform.selfkey.org/repository.json',
									entityType: ['corporate', 'individual'],
									title: 'Email',
									description: 'Please enter your e-mail address.',
									type: 'string',
									format: 'email'
								}
							},
							required: ['type', 'email']
						},
						{
							type: 'object',
							properties: {
								type: {
									const: 'corporate'
								},
								companyType: {
									$id:
										'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
									$schema:
										'http://platform.selfkey.org/schema/identity-attribute.json',
									entityType: ['corporate'],
									identityAttribute: true,
									identityAttributeRepository:
										'http://platform.selfkey.org/repository.json',
									title: 'Legal Entity Type',
									description: 'Please specify the type of legal entity.',
									type: 'string',
									enum: [
										'Company Limited by Shares (LTD)',
										'Limited Liability Company (LLC)',
										'Trust (TST)',
										'Foundation (FND)',
										'Limited Partnership (LLP)',
										'Other'
									]
								},
								companyName: {
									$id:
										'http://platform.selfkey.org/schema/attribute/company-name.json',
									$schema:
										'http://platform.selfkey.org/schema/identity-attribute.json',
									identityAttribute: true,
									identityAttributeRepository:
										'http://platform.selfkey.org/repository.json',
									entityType: ['corporate'],
									title: 'Company Name',
									description:
										'Please provide the name of your company, as it appears in official documents.',
									type: 'string'
								},
								email: {
									$id: 'http://platform.selfkey.org/schema/attribute/email.json',
									$schema:
										'http://platform.selfkey.org/schema/identity-attribute.json',
									identityAttribute: true,
									identityAttributeRepository:
										'http://platform.selfkey.org/repository.json',
									entityType: ['corporate', 'individual'],
									title: 'Email',
									description: 'Please enter your e-mail address.',
									type: 'string',
									format: 'email'
								}
							},
							required: ['type', 'email', 'companyType', 'companyName']
						}
					]
				},
				individual: {
					type: 'object',
					properties: {
						type: {
							const: 'individual'
						},
						firstName: {
							$id: 'http://platform.selfkey.org/schema/attribute/first-name.json',
							$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
							identityAttribute: true,
							identityAttributeRepository:
								'http://platform.selfkey.org/repository.json',
							entityType: ['individual'],
							title: 'First Name',
							description: 'Given Name.',
							type: 'string'
						},
						lastName: {
							$id: 'http://platform.selfkey.org/schema/attribute/last-name.json',
							$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
							identityAttribute: true,
							identityAttributeRepository:
								'http://platform.selfkey.org/repository.json',
							entityType: ['individual'],
							title: 'Last Name',
							description: 'Family Name.',
							type: 'string'
						},
						email: {
							$id: 'http://platform.selfkey.org/schema/attribute/email.json',
							$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
							identityAttribute: true,
							identityAttributeRepository:
								'http://platform.selfkey.org/repository.json',
							entityType: ['corporate', 'individual'],
							title: 'Email',
							description: 'Please enter your e-mail address.',
							type: 'string',
							format: 'email'
						}
					},
					required: ['type', 'email']
				},
				corporate: {
					type: 'object',
					properties: {
						type: {
							const: 'corporate'
						},
						companyType: {
							$id:
								'http://platform.selfkey.org/schema/attribute/legal-entity-type.json',
							$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
							entityType: ['corporate'],
							identityAttribute: true,
							identityAttributeRepository:
								'http://platform.selfkey.org/repository.json',
							title: 'Legal Entity Type',
							description: 'Please specify the type of legal entity.',
							type: 'string',
							enum: [
								'Company Limited by Shares (LTD)',
								'Limited Liability Company (LLC)',
								'Trust (TST)',
								'Foundation (FND)',
								'Limited Partnership (LLP)',
								'Other'
							]
						},
						companyName: {
							$id: 'http://platform.selfkey.org/schema/attribute/company-name.json',
							$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
							identityAttribute: true,
							identityAttributeRepository:
								'http://platform.selfkey.org/repository.json',
							entityType: ['corporate'],
							title: 'Company Name',
							description:
								'Please provide the name of your company, as it appears in official documents.',
							type: 'string'
						},
						email: {
							$id: 'http://platform.selfkey.org/schema/attribute/email.json',
							$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
							identityAttribute: true,
							identityAttributeRepository:
								'http://platform.selfkey.org/repository.json',
							entityType: ['corporate', 'individual'],
							title: 'Email',
							description: 'Please enter your e-mail address.',
							type: 'string',
							format: 'email'
						}
					},
					required: ['type', 'email', 'companyType', 'companyName']
				}
			}
		},
		required: ['companyType', 'members']
	}
};
