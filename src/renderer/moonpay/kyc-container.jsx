import React, { useState, useEffect } from 'react';

import MoonPayKycModal from './kyc-modal';
import { withNavFlow } from '../navigation/with-flow-hoc';
import { useSelector, useDispatch } from 'react-redux';
import { CreateAttributeContainer, EditAttributeContainer } from '../attributes';

import { moonPayOperations, moonPaySelectors } from '../../common/moonpay';

export const MoonPayKycContainer = withNavFlow(
	({ onNext, onCancel }) => {
		const [popup, setPopup] = useState(null);
		const [attr, setAttribute] = useState(null);

		const validRequirements = useSelector(moonPaySelectors.areKycRequirementsValid);
		const requirements = useSelector(moonPaySelectors.getKYCRequirements);
		const loading = useSelector(moonPaySelectors.isKycSubmitting);
		let error = useSelector(moonPaySelectors.getKycError);
		const selected = useSelector(moonPaySelectors.getSelectedAttributes);
		const country = useSelector(moonPaySelectors.getSelectedCountry);
		let countryError = null;
		if (country && !country.isAllowed) {
			countryError = 'MoonPay does not provide service is selected country';
		}

		const dispatch = useDispatch();

		useEffect(() => {
			dispatch(moonPayOperations.setSelectedAttributes({}));
		}, []);

		const handleAttributeSelected = async (uiId, item) => {
			const prev = selected[uiId];
			if (!prev && !item) return;
			if (prev && item && item.id === prev.id) return;

			const newSelected = { ...selected, [uiId]: item };
			await dispatch(moonPayOperations.setSelectedAttributes(newSelected));
		};

		const handleNext = () => {
			onNext();
			dispatch(moonPayOperations.submitKycDocumentsOperation());
		};

		const handleAddAttribute = attr => {
			setAttribute(attr);
			setPopup('add-attribute');
		};

		const handleEditAttribute = attr => {
			const selectedAttribute =
				selected[`_${attr.uiId}`] || (attr.options.length ? attr.options[0] : null);
			if (!selectedAttribute) return;
			setAttribute(selectedAttribute);
			setPopup('edit-attribute');
		};

		const handlePopupClose = () => {
			setPopup(null);
			setAttribute(null);
		};

		return (
			<React.Fragment>
				{popup === 'add-attribute' && (
					<CreateAttributeContainer
						open={true}
						onClose={handlePopupClose}
						documentsAndInformation
						onNext={() => {
							dispatch(moonPayOperations.checkServiceAllowedOperation());
						}}
						attributeTypeUrls={
							Array.isArray(attr.type) ? attr.type.map(t => t.url) : [attr.type.url]
						}
					/>
				)}
				{popup === 'edit-attribute' && (
					<EditAttributeContainer
						open={true}
						onClose={handlePopupClose}
						attribute={attr}
					/>
				)}
				<MoonPayKycModal
					requirements={requirements}
					onNext={handleNext}
					onCancel={onCancel}
					onAttributeSelected={handleAttributeSelected}
					selectedAttributes={selected}
					editAttribute={handleEditAttribute}
					addAttribute={handleAddAttribute}
					loading={loading}
					disabled={!validRequirements || countryError}
					error={error || countryError}
				/>
			</React.Fragment>
		);
	},
	{
		next: '/main/moonpay/loading'
	}
);

MoonPayKycContainer.propTypes = {};

MoonPayKycContainer.defaultProps = {};

export default MoonPayKycContainer;
