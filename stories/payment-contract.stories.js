import React from 'react';
import { storiesOf } from '@storybook/react';
import PaymentContract from '../src/renderer/marketplace/common/payment-contract';

storiesOf('Payment Contract', module).add('Payment Contract', () => (
	<PaymentContract whyLink={'https://help.selfkey.org/'} price={123456} />
));
