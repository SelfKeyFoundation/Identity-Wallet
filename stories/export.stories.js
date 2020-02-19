import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { WalletExportWarning } from '../src/renderer/wallet/main/export-warning';
import { WalletExportQRCode } from '../src/renderer/wallet/main/export-qr-code';

storiesOf('WalletExport', module)
	.add('warning', () => (
		<WalletExportWarning onCancel={action('close')} onExport={action('export')} />
	))
	.add('qr-code-loading', () => <WalletExportQRCode keystore={null} />)
	.add('qr-code', () => <WalletExportQRCode keystore="selfkey-key" />);
