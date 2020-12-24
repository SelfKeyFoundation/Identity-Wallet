import React from 'react';
import { PropTypes } from 'prop-types';
import { Typography } from '@material-ui/core';

export const DefaultFullRenderer = ({ attribute }) => {
	return <Typography variant="body1">{attribute.name}</Typography>;
};

DefaultFullRenderer.propTypes = {
	attribute: PropTypes.object.isRequired,
	type: PropTypes.object
};

DefaultFullRenderer.defaultProps = {};

export default DefaultFullRenderer;
