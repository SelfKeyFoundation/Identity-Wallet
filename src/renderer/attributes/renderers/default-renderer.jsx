import React from 'react';
import { PropTypes } from 'prop-types';
import { Typography } from '@material-ui/core';

export const DefaultRenderer = ({ attribute }) => {
	return <Typography variant="body1">{attribute.name}</Typography>;
};

DefaultRenderer.propTypes = {
	attribute: PropTypes.object.isRequired,
	type: PropTypes.object
};

DefaultRenderer.defaultProps = {};

export default DefaultRenderer;
