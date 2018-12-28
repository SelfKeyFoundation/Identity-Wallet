import React from 'react';
import { Tag } from 'selfkey-ui';

const TagList = props => {
	const { categories } = props;
	if (!categories) {
		return null;
	}
	return (
		<div>
			{categories.map(cat => (
				<Tag key={cat}>{cat}</Tag>
			))}
		</div>
	);
};

export default TagList;
