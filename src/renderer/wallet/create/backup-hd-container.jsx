import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BackupHDPhrase from './backup-hd';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { appOperations, appSelectors } from 'common/app';

const goBackConfirmPassword = React.forwardRef((props, ref) => (
	<Link to="/home" {...props} ref={ref} />
));

export const BackupHDWalletContainer = () => {
	const [copied, setCopied] = useState(false);

	const dispatch = useDispatch();
	const seed = useSelector(appSelectors.selectSeed);

	useEffect(
		() => {
			if (!seed) {
				dispatch(appOperations.generateSeedPhraseOperation());
			}
		},
		[seed]
	);

	const handleCancel = e => {
		e.preventDefault();
		dispatch(push('/home'));
	};

	const handleNext = e => {
		e.preventDefault();
		dispatch(push('/confirmHDWallet'));
	};

	const handleCopy = () => {
		setCopied(true);
	};

	return (
		<BackupHDPhrase
			copied={copied}
			seedPhrase={(seed || '').split(' ')}
			backComponent={goBackConfirmPassword}
			onCancelClick={handleCancel}
			onNextClick={handleNext}
			onCopyPhrase={handleCopy}
		/>
	);
};

export default BackupHDWalletContainer;
