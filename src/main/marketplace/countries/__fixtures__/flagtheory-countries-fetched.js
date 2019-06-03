export default (filter = []) => [
	...new Set(
		['AT', 'SG', 'SK', 'HU', 'AT', 'QA', 'AT', 'EE', 'KR', 'SE', 'AT', 'DK', 'MK', 'LT'].filter(
			c => !filter.includes(c)
		)
	)
];
