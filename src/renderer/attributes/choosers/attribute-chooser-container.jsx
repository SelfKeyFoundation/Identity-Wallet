import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { useSelector } from 'react-redux';
import { identitySelectors } from 'common/identity';
import CreateAttributeContainer from '../create-attribute-container';
import EditAttributeContainer from '../edit-attribute-container';

const attributeTypesSelector = identitySelectors.selectAttributeTypesByUrlsMappedFactory();

export const AttributeChooserContainer = props => {
	const {
		attributeTypeUrls,
		defaultSelection,
		onSelectOption,
		children,
		createAllowed,
		editAllowed,
		...passThrough
	} = props;

	const attributes = useSelector(state =>
		identitySelectors.selectAttributesByUrl(state, { attributeTypeUrls })
	);

	const typesByTypeId = useSelector(state =>
		attributeTypesSelector(state, { attributeTypeUrls })
	);

	const [selected, setSelected] = useState(defaultSelection);
	const [popup, setPopup] = useState(null);
	const [editAttribute, setAttributeToEdit] = useState(null);

	const handleSelectOption = evt => {
		if (!evt) {
			return;
		}
		evt.preventDefault();

		setSelected(+evt.target.value);
		if (onSelectOption) {
			const attribute = attributes.find(attr => attr.id);
			onSelectOption(attribute);
		}
	};

	const handleEditAttribute = attr => {
		setAttributeToEdit(attr);
		setPopup('edit-attribute');
	};

	const handleCreateAttribute = () => {
		setPopup('create-attribute');
	};

	const handlePopupClose = () => {
		setPopup(null);
		setAttributeToEdit(null);
	};

	return (
		<React.Fragment>
			{createAllowed && popup === 'create-attribute' && (
				<CreateAttributeContainer
					open={true}
					onClose={handlePopupClose}
					documentsAndInformation
					attributeTypeUrls={attributeTypeUrls}
				/>
			)}
			{editAllowed && popup === 'edit-attribute' && (
				<EditAttributeContainer
					open={true}
					onClose={handlePopupClose}
					attribute={editAttribute}
				/>
			)}
			{children({
				...passThrough,
				typesByTypeId,
				attributes,
				selected,
				onEditAttribute: editAllowed ? handleEditAttribute : undefined,
				onAddAttribute: createAllowed ? handleCreateAttribute : undefined,
				onSelectOption: handleSelectOption
			})}
		</React.Fragment>
	);
};

AttributeChooserContainer.propTypes = {
	attributeTypeUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
	defaultSelection: PropTypes.number,
	children: PropTypes.func.isRequired,
	createAllowed: PropTypes.bool,
	editAllowed: PropTypes.bool,
	onSelectOption: PropTypes.func
};

AttributeChooserContainer.defaultProps = {
	createAllowed: true,
	editAllowed: true,
	defaultSelection: 0
};

export default AttributeChooserContainer;
