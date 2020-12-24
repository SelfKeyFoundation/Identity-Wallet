import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { moonPayOperations } from '../../common/moonpay';
import AttributeChooserContainer from '../attributes/choosers/attribute-chooser-container';
import { withNavFlow } from '../navigation/with-flow-hoc';
import MoonpayChooseLoginEmailModal from './choose-login-email-modal';

export const MoonpayChooseLoginEmailContainer = withNavFlow(
	({ onNext, onCancel }) => {
		const [selectedAttribute, setSelectedAttribute] = useState();

		const dispatch = useDispatch();

		const handleNext = async () => {
			if (!selectedAttribute) return;

			await dispatch(
				moonPayOperations.loginEmailChosenOperation({
					loginEmail: selectedAttribute.data.value
				})
			);
			if (onNext) {
				onNext();
			}
		};

		const handleSelect = attr => {
			setSelectedAttribute(attr);
		};

		return (
			<AttributeChooserContainer
				attributeTypeUrls={['http://platform.selfkey.org/schema/attribute/email.json']}
				onSelectOption={handleSelect}
			>
				{props => (
					<MoonpayChooseLoginEmailModal
						{...props}
						onNext={handleNext}
						onCancel={onCancel}
					/>
				)}
			</AttributeChooserContainer>
		);
	},
	{ next: '/main/moonpay/auth' }
);

export default MoonpayChooseLoginEmailContainer;
