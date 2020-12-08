import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BackupHDPhrase from './backup-hd';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

const goBackConfirmPassword = React.forwardRef((props, ref) => (
	<Link to="/createPasswordConfirmation" {...props} ref={ref} />
));

export const BackupHDWalletContainer = () => {
	const [copied, setCopied] = useState(false);

	const dispatch = useDispatch();

	const handleCancel = e => {
		e.preventDefault();
		dispatch(push('/createPasswordConfirmation'));
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
			seedPhrase={'end artist warrior civil pool average afford hour episode relief pluck that'.split(
				' '
			)}
			backComponent={goBackConfirmPassword}
			onCancelClick={handleCancel}
			onNextClick={handleNext}
			onCopyPhrase={handleCopy}
		/>
	);
};

export default BackupHDWalletContainer;
