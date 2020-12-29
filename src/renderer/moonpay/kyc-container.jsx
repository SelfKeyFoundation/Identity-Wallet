import React, { useState, useEffect } from 'react';

import MoonPayKycModal from './kyc-modal';
import { withNavFlow } from '../navigation/with-flow-hoc';
import { useSelector, useDispatch } from 'react-redux';
import { CreateAttributeContainer, EditAttributeContainer } from '../attributes';

import { moonPayOperations, moonPaySelectors } from '../../common/moonpay';
import {
	FIRST_NAME_ATTRIBUTE,
	LAST_NAME_ATTRIBUTE,
	PHONE_ATTRIBUTE,
	ADDRESS_ATTRIBUTE,
	COUNTRY_ATTRIBUTE
} from '../../common/identity/constants';

export const MoonPayKycContainer = withNavFlow(({ onNext, onCancel }) => {
	const [popup, setPopup] = useState(null);
	const [editAttribute, setAttributeToEdit] = useState(null);

	const validRequirements = useSelector(moonPaySelectors.areKycRequirementsValid);
	const requirements = useSelector(moonPaySelectors.getKYCRequirements);
	const loading = useSelector(moonPaySelectors.isKycSubmitting);
	const error = useSelector(moonPayOperations.getKycError);
	const selected = useSelector(moonPaySelectors.getSelectedAttributes);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(moonPayOperations.setSelectedAttributes({}));
	}, []);

	const handleAttributeSelected = async (uiId, item) => {
		const newSelected = { ...selected, [uiId]: item };
		await dispatch(moonPayOperations.setSelectedAttributes(newSelected));
	};

	const handleNext = () => {};

	const handleAddAttribute = () => {
		setPopup('add-attribute');
	};

	const handleEditAttribute = attr => {
		setAttributeToEdit(attr);
		setPopup('edit-attribute');
	};

	const handlePopupClose = () => {
		setPopup(null);
	};

	return (
		<React.Fragment>
			{popup === 'add-attribute' && (
				<CreateAttributeContainer
					open={true}
					onClose={handlePopupClose}
					documentsAndInformation
					attributeTypeUrls={[
						FIRST_NAME_ATTRIBUTE,
						LAST_NAME_ATTRIBUTE,
						PHONE_ATTRIBUTE,
						ADDRESS_ATTRIBUTE,
						COUNTRY_ATTRIBUTE,
						'http://platform.selfkey.org/schema/attribute/passport.json',
						'http://platform.selfkey.org/schema/attribute/national-id-number.json',
						'http://platform.selfkey.org/schema/attribute/drivers-license.json'
					]}
				/>
			)}
			{popup === 'edit-attribute' && (
				<EditAttributeContainer
					open={true}
					onClose={handlePopupClose}
					attribute={editAttribute}
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
				disabled={!validRequirements}
				error={error}
			/>
		</React.Fragment>
	);
});

MoonPayKycContainer.propTypes = {};

MoonPayKycContainer.defaultProps = {};

export default MoonPayKycContainer;
