import React from 'react';

import { withNavFlow } from '../navigation/with-flow-hoc';
import MoonpayAuthModal from './auth-modal';

export const MoonPayAuthContainer = withNavFlow(
	props => {
		return <MoonpayAuthModal {...props} />;
	},
	{ next: '/main/moonpay/terms' }
);

export default MoonPayAuthContainer;
