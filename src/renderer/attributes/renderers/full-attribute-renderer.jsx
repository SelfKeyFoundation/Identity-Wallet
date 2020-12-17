import React from 'react';
import { fullRenderers } from '.';
import { PropTypes } from 'prop-types';

export const FullAttributeRenderer = ({ attribute, type }) => {
	const Renderer = fullRenderers[type.url] || fullRenderers.default;
	return <Renderer attribute={attribute} type={type} />;
};

FullAttributeRenderer.propTypes = {
	attribute: PropTypes.object.isRequired,
	type: PropTypes.object
};

FullAttributeRenderer.defaultProps = {
	type: {
		url: 'default'
	}
};
