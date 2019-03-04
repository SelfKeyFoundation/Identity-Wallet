import React from 'react';

const ProgramPrice = props => {
	const { price, rate, label } = props;

	if (!price || !rate) {
		return null;
	}

	const numeric = parseInt(price.replace(/\$/, '').replace(/,/, ''));
	const key = numeric / rate;

	return (
		<div className="price">
			{label}
			{price}
			<span className="price-key">{key.toLocaleString()} KEY</span>
		</div>
	);
};

export default ProgramPrice;
