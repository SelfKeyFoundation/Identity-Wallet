import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { sanitize } from '../../common';

const styles = theme => ({});

export const DescriptionTab = withStyles(styles)(({ program }) => {
	return (
		<div
			dangerouslySetInnerHTML={{
				__html: sanitize(program.translation.introduction)
			}}
		/>
	);
});

export default DescriptionTab;
