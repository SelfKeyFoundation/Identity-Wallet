import React, { useState } from 'react';
import { withNavFlow } from '../navigation/with-flow-hoc';
import MoonPaySelectCardModal from './select-card-modal';
import AddPaymentMethodModal from './add-payment-method-modal';
import { useSelector, useDispatch } from 'react-redux';
import { moonPayOperations, moonPaySelectors } from '../../common/moonpay';

export const MoonPaySelectCardContainer = withNavFlow(
	props => {
		const { onNext, onCancel, onStepUpdate, ...otherProps } = props;
		const cards = useSelector(moonPaySelectors.getCards);
		const dispatch = useDispatch();

		const [selectedCard, setSelectedCard] = useState();
		const [addNewCard, setAddNewCard] = useState(cards.length === 0);
		const [cardNumber, setCardNumber] = useState();
		const [expiryDate, setExpiryDate] = useState();
		const [cvc, setCvc] = useState();
		const [error, setError] = useState(false);

		const handleSelectedCardChange = card => setSelectedCard(card);

		const handleChangetoAddNewCard = evt => setAddNewCard(true);

		const handleCardNumberChange = evt => setCardNumber(evt.target.value);

		const handleExpiryDateChange = evt => setExpiryDate(evt.target.value);

		const handleCvcChange = evt => setCvc(evt.target.value);

		const validate = () => {
			let error = false;
			if (
				!cardNumber ||
				!cardNumber.match(
					/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11})|(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$/
				)
			) {
				error = 'Pease correct missing or invalid credit card number';
			}
			if (!cvc) {
				if (!error) {
					error = 'Pease fill in missing credit CVC';
				} else {
					error += ', CVC';
				}
			}
			if (!expiryDate) {
				if (!error) {
					error = 'Pease fill in missing credit expiry date';
				} else {
					error += ', expiry date';
				}
			}
			if (error) {
				error = `Error: ${error}.`;
			}
			return error;
		};

		const handleAddNewCard = async () => {
			const error = validate();
			setError(error);

			if (!error) {
				onNext();
				dispatch(
					moonPayOperations.addPaymentMethod({
						cardNumber,
						expiryDate,
						cvc
					})
				);
			}
		};

		const handleSelectCard = async () => {
			onNext();
			dispatch(
				moonPayOperations.selectCard({
					card: selectedCard
				})
			);
		};

		console.log(cards);

		if (addNewCard) {
			return (
				<AddPaymentMethodModal
					{...otherProps}
					onContinueClick={handleAddNewCard}
					onCloseClick={onCancel}
					cardNumber={cardNumber}
					onCardNumberChange={handleCardNumberChange}
					expiryDate={expiryDate}
					onExpiryDateChange={handleExpiryDateChange}
					onCvcChange={handleCvcChange}
					cvc={cvc}
					error={error}
				/>
			);
		} else {
			return (
				<MoonPaySelectCardModal
					{...otherProps}
					onContinueClick={handleSelectCard}
					onCloseClick={onCancel}
					cards={cards}
					onCardSelected={handleSelectedCardChange}
					onAddNewCard={handleChangetoAddNewCard}
					selectedCard={selectedCard}
				/>
			);
		}
	},
	{
		next: '/main/moonpay/loading/payment-flow'
	}
);

export default MoonPaySelectCardContainer;
