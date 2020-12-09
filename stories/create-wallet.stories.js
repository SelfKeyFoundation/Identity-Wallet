import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Password } from '../src/renderer/wallet/create/password/password-component';
import PasswordConfirmation from '../src/renderer/wallet/create/password/confirmation-component';
import BackupHDPhrase from '../src/renderer/wallet/create/backup-hd';
import ConfirmHDPhrase from '../src/renderer/wallet/create/confirm-hd';

const backElement = React.forwardRef((props, ref) => (
	<span onClick={action('back')} {...props} ref={ref} />
));

storiesOf('CreateWallet', module)
	.add('CreatePassword', () => (
		<Password
			onNextClick={action('next clicked')}
			backComponent={backElement}
			onPasswordChange={action('password changed')}
		/>
	))
	.add('PasswordConfirmation', () => (
		<PasswordConfirmation
			onNextClick={action('next clicked')}
			backComponent={backElement}
			onPasswordChange={action('password changed')}
			onBackAction={action('back')}
		/>
	))
	.add('BackupHDPhrase', () => (
		<BackupHDPhrase
			backComponent={backElement}
			onNextClick={action('next clicked')}
			onCopyPhrase={action('copy')}
			onCancelClick={action('cancel')}
			seedPhrase={[
				'one',
				'two',
				'three',
				'for',
				'five',
				'six',
				'seven',
				'eight',
				'nine',
				'ten',
				'eleven',
				'twelve'
			]}
		/>
	))
	.add('ConfirmHDPhrase', () => (
		<ConfirmHDPhrase
			backComponent={backElement}
			onNextClick={action('next clicked')}
			onCancelClick={action('cancel')}
			onSelectWord={action('select')}
			onClear={action('clear')}
			selectedSeedPhrase={['one', 'two']}
			shuffledSeedPhrase={[
				'one',
				'two',
				'three',
				'for',
				'five',
				'six',
				'seven',
				'eight',
				'nine',
				'ten',
				'eleven',
				'twelve'
			]}
			error={'Current order doesn’t match your Recovery Phrase. Please try again.'}
		/>
	));
