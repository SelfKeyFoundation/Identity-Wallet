import React from 'react';
import { PropTypes } from 'prop-types';

export const PhysicalAddressChooser = () => {
	return <div>address chooser</div>;
};

PhysicalAddressChooser.propTypes = {
	addresses: PropTypes.arrayOf(PropTypes.object)
};

PhysicalAddressChooser.defaultProps = {
	addresses: []
};

export default PhysicalAddressChooser;
