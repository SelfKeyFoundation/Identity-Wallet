import React from 'react';
import { Typography } from '@material-ui/core';
import { GreenTick } from 'selfkey-ui';

const ProgramListItem = props => {
	const { title, value } = props;
	if (!value) {
		return null;
	}
	return (
		<div>
			<GreenTick />
			<Typography variant="h5" gutterBottom>
				{title}
			</Typography>
		</div>
	);
};

export default ProgramListItem;
