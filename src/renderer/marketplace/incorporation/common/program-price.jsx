import React from 'react';

const ProgramPrice = props => {
	const { price, rate } = props;

	if (!price) {
		return null;
	}

	const numeric = parseInt(price.replace(/\$/, '').replace(/,/, ''));
	const key = Math.round(numeric / rate);

	return (
		<div className="price">
			{price}
			<span className="price-key">{key} KEY</span>
		</div>
	);
};

export default ProgramPrice;
