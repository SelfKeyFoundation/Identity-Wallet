import React from 'react';
import { PropTypes } from 'prop-types';
import { Typography } from '@material-ui/core';

export const CountryOfResidencyRendererFull = ({ attribute, type }) => {
	const {
		// eslint-disable-next-line camelcase
		data: { country }
	} = attribute;
	let countryName = country;

	try {
		let idx = type.content.properties.country.enum.findIndex(c => c === country);
		countryName = type.content.properties.country.enumNames[idx];
	} catch (error) {}

	return (
		<Typography variant="body2" color="secondary">
			{countryName}
		</Typography>
	);
};

CountryOfResidencyRendererFull.propTypes = {
	attribute: PropTypes.object.isRequired,
	type: PropTypes.object.isRequired
};

CountryOfResidencyRendererFull.defaultProps = {};

export default CountryOfResidencyRendererFull;
