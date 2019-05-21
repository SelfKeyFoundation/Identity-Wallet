import React from 'react';

import { storiesOf } from '@storybook/react';
import { NoConnection } from '../src/renderer/no-connection';

storiesOf('NoConnection', module).add('Main', () => <NoConnection />);
