import React from 'react';

const TagList = props => {
	const { categories } = props;
	if (!categories) {
		return null;
	}
	return (
		<div>
			{categories.map(cat => (
				<span key={`cat-${cat}`} className="category">
					{cat}
				</span>
			))}
		</div>
	);
};

export default TagList;
