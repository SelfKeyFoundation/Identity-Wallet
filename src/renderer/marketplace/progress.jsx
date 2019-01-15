import React from 'react';
import { UnlockBox, UnlockProgress } from 'selfkey-ui';

export const UnlockProgressWrapper = props => {
	return (
		<UnlockBox closeAction={props.closeAction}>
			<UnlockProgress {...props} />
		</UnlockBox>
	);
};

export default UnlockProgressWrapper;
