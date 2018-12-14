import React from 'react';

const ProgramPrice = props => {
	const { price } = props;

	if (!price) {
		return null;
	}

	// FIXME: stub code
	const numeric = parseInt(price.replace(/\$/, '').replace(/,/, ''));
	const key = Math.round(numeric / 0.0075);

	return (
		<div className="price">
			{price}
			<span className="price-key">{key} KEY</span>
		</div>
	);
};

export default ProgramPrice;
