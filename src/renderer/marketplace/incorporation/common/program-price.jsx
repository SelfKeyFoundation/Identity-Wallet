import React from 'react';

/*
const formatNumber = number => {
	// 4 decimal places for KEY values ?
	const numeric = Math.abs(number).toFixed(2);
	let splitNum = numeric.split('.');
	// Format number with thousands separator
	splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return splitNum.join('.');
};
*/

const ProgramPrice = props => {
	const { price, rate, label } = props;

	if (!price) {
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
