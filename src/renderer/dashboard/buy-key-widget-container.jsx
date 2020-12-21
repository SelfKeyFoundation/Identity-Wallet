import React, { useState } from 'react';
import BuyKeyWidget from './buy-key-widget';
import { featureIsEnabled } from 'common/feature-flags';
import BuyKeyPopup from './buy-key-popup-container';
import TokenSwap from '../transaction/swap';

export const BuyKeyContainer = props => {
	const [popup, setPopup] = useState(null);

	const handleBuyClick = () => {
		setPopup('buy');
	};

	const handleSwapClick = () => {
		setPopup('swap');
	};

	const handleCloseClick = () => {
		setPopup(null);
	};

	let popupEl = null;

	if (popup === 'buy') {
		popupEl = <BuyKeyPopup closeAction={handleCloseClick} />;
	}

	if (popup === 'swap') {
		popupEl = <TokenSwap closeAction={handleCloseClick} />;
	}

	return (
		<React.Fragment>
			{popupEl}
			<BuyKeyWidget
				{...props}
				onBuyClick={handleBuyClick}
				onSwapClick={featureIsEnabled('swapTokens') ? handleSwapClick : undefined}
			/>
		</React.Fragment>
	);
};

export default BuyKeyContainer;
