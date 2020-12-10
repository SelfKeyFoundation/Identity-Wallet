import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import ConfirmHDPhrase from './confirm-hd';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { appSelectors, appOperations } from 'common/app';

const goBackConfirmPassword = React.forwardRef((props, ref) => (
	<Link to="/backupHDWallet" {...props} ref={ref} />
));

export const ConfirmHDWalletContainer = () => {
	const seed = useSelector(appSelectors.selectSeed);

	const [selected, setSelected] = useState([]);
	const [shuffled] = useState(_.shuffle((seed || '').split(' ')));
	const [error, setError] = useState(null);

	// const seed = useSelector(appSelectors.selectSeedPhrase);

	const dispatch = useDispatch();

	const handleCancel = e => {
		e.preventDefault();
		dispatch(push('/backupHDWallet'));
	};

	const handleNext = e => {
		e.preventDefault();
		let newError = null;
		if (seed !== selected.join(' ')) {
			newError = 'Incorrect seed phrase';
		}

		setError(newError);

		if (newError) {
			setSelected([]);
			return;
		}

		dispatch(appOperations.startSeedUnlockOperation(seed));
	};

	const handleClear = () => {
		setSelected([]);
	};

	const handleSelectWord = w => {
		setSelected([...selected, w]);
	};

	return (
		<ConfirmHDPhrase
			selectedSeedPhrase={selected}
			shuffledSeedPhrase={shuffled}
			onSelectWord={handleSelectWord}
			backComponent={goBackConfirmPassword}
			onCancelClick={handleCancel}
			onNextClick={handleNext}
			onClear={handleClear}
			error={error}
		/>
	);
};

export default ConfirmHDWalletContainer;
