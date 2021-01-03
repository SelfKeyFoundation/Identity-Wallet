import React, { useState, useEffect } from 'react';
import { withNavFlow } from '../navigation/with-flow-hoc';
import { useSelector, useDispatch } from 'react-redux';
import { moonPayOperations, moonPaySelectors } from '../../common/moonpay';
import MoonPayNotAllowedModal from './not-allowed-modal';
import { CreateAttributeContainer } from '../attributes/create-attribute-container';
import { COUNTRY_ATTRIBUTE } from '../../common/identity/constants';
import { selectAttributesByUrl } from '../../common/identity/selectors';

const handleLinkClick = e => {
	window.openExternal(e, e.target.href || e.currentTarget.href);
};

export const MoonPayNotAllowedContainer = withNavFlow(
	props => {
		const { onCancel, onNext } = props;

		const [popup, setPopup] = useState(null);
		const countries = useSelector(state =>
			selectAttributesByUrl(state, {
				attributeTypeUrls: [COUNTRY_ATTRIBUTE]
			})
		);
		const serviceCheck = useSelector(moonPaySelectors.selectServiceCheck);
		const isAllowed = useSelector(moonPaySelectors.isServiceAllowed);

		useEffect(
			() => {
				dispatch(moonPayOperations.checkServiceAllowedOperation());
			},
			[countries]
		);

		useEffect(
			() => {
				if (isAllowed) onNext();
			},
			[isAllowed]
		);

		const dispatch = useDispatch();

		const handleAddCountryClick = () => {
			setPopup('add-country');
		};

		const handlePopupClose = async () => {
			setPopup(null);
		};

		return (
			<React.Fragment>
				{popup === 'add-country' && (
					<CreateAttributeContainer
						open={true}
						onClose={handlePopupClose}
						attributeTypeUrls={[COUNTRY_ATTRIBUTE]}
					/>
				)}
				<MoonPayNotAllowedModal
					{...serviceCheck}
					onAddCountryClick={handleAddCountryClick}
					onCancel={onCancel}
					onLinkClick={handleLinkClick}
				/>
			</React.Fragment>
		);
	},
	{ next: '/main/moonpay/loading' }
);

export default MoonPayNotAllowedContainer;
