import React from 'react';
import { push } from 'connected-react-router';
import { useSelector, useDispatch } from 'react-redux';
import { COUNTRY_ATTRIBUTE, NATIONALITY_ATTRIBUTE } from '../../common/identity/constants';
import { selectAttributesByUrl } from '../../common/identity/selectors';
import { MoonPayCountryNotAllowedModal } from './country-not-allowed-modal';

export const MoonPayCountryNotAllowedContainer = props => {
	const residencyAndNationalityAttributes = useSelector(state =>
		selectAttributesByUrl(state, {
			attributeTypeUrls: [COUNTRY_ATTRIBUTE, NATIONALITY_ATTRIBUTE]
		})
	);

	const missingProfileAttributes = residencyAndNationalityAttributes.length !== 2;

	const dispatch = useDispatch();

	const handleCancelClick = () => {
		dispatch(push('/main/dashboard'));
	};

	const handleSelfkeyProfileClick = () => {
		dispatch(push('/main/selfkeyId'));
	};

	return (
		<MoonPayCountryNotAllowedModal
			onCancel={handleCancelClick}
			isMissingProfileAttributes={missingProfileAttributes}
			onSelfkeyProfile={handleSelfkeyProfileClick}
		/>
	);
};

export default MoonPayCountryNotAllowedContainer;
