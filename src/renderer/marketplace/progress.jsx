import React from 'react';
import UnlockBox from './unlock-box';
import UnlockProgress from './unlock-progress';

export const UnlockProgressWrapper = props => {
	return (
		<UnlockBox closeAction={props.closeAction}>
			<UnlockProgress {...props} />
		</UnlockBox>
	);
};

export default UnlockProgressWrapper;
