import React from 'react';
import { PropTypes } from 'prop-types';
import { Typography } from '@material-ui/core';

export const EmailFullRenderer = ({ attribute }) => {
	return <Typography variant="body1">{attribute.data.value}</Typography>;
};

EmailFullRenderer.propTypes = {
	attribute: PropTypes.object.isRequired,
	type: PropTypes.object
};

EmailFullRenderer.defaultProps = {};

export default EmailFullRenderer;
