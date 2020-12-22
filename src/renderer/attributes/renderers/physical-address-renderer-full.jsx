import React from 'react';
import { PropTypes } from 'prop-types';
import { Grid, Typography } from '@material-ui/core';

export const PhysicalAddressRendererFull = ({ attribute }) => {
	const {
		name,
		// eslint-disable-next-line camelcase
		data: { address_line1, address_line2, city, province, postalcode }
	} = attribute;

	// eslint-disable-next-line camelcase
	let strAddress = [address_line1, address_line2, city, postalcode, province]
		.filter(a => !!a)
		.join(', ');

	return (
		<Grid container direction="column" spacing={1}>
			<Grid item>
				<Typography variant="body1">{name}</Typography>
			</Grid>
			<Grid item>
				<Typography variant="body2" color="secondary">
					{strAddress}
				</Typography>
			</Grid>
		</Grid>
	);
};

PhysicalAddressRendererFull.propTypes = {
	attribute: PropTypes.object.isRequired,
	type: PropTypes.object
};

PhysicalAddressRendererFull.defaultProps = {};

export default PhysicalAddressRendererFull;
