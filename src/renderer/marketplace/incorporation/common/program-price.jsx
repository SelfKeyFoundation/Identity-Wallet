import React from 'react';

const ProgramPrice = props => {
	const { price, rate, label } = props;

	if (!price) {
		return null;
	}

	const numeric = parseInt(price.replace(/\$/, '').replace(/,/, ''));
	const key = Math.round(numeric / rate);

	return (
		<div className="price">
			{label}
			{price}
			<span className="price-key">{key} KEY</span>
		</div>
	);
};

export default ProgramPrice;
