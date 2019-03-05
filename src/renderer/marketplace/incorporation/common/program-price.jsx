import React from 'react';

const ProgramPrice = props => {
	const { price, rate, label } = props;

	if (!price || !rate) {
		return null;
	}

	const numeric = parseInt(price.replace(/\$/, '').replace(/,/, ''));
	const key = numeric / rate;
	const formattedLabel = label ? `${label} ` : '';

	return (
		<div className="price">
			{formattedLabel}
			{price}
			<span className="price-key">{key.toLocaleString()} KEY</span>
		</div>
	);
};

export default ProgramPrice;
