import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmHDPhrase from './confirm-hd';
import { useDispatch /*, useSelector */ } from 'react-redux';
import { push } from 'connected-react-router';
// import { appSelectors } from 'common/app';

const goBackConfirmPassword = React.forwardRef((props, ref) => (
	<Link to="/backupHDWallet" {...props} ref={ref} />
));

export const ConfirmHDWalletContainer = () => {
	const [selected, setSelected] = useState([]);
	const [shuffled] = useState([]);
	const [error] = useState(null);

	// const seed = useSelector(appSelectors.selectSeedPhrase);

	const dispatch = useDispatch();

	const handleCancel = e => {
		e.preventDefault();
		dispatch(push('/backupHDWallet'));
	};

	const handleNext = e => {
		e.preventDefault();

		// dispatch(push('/main/dashboard"'))
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
