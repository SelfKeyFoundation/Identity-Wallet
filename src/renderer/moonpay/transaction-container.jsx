import config from 'common/config';
import React, { useState, useEffect, useCallback } from 'react';
import { withNavFlow } from '../navigation/with-flow-hoc';
import MoonPayTransactionModal from './transaction-modal';
import { useSelector, useDispatch } from 'react-redux';
import { moonPayOperations, moonPaySelectors } from '../../common/moonpay';
import { getLocale } from 'common/locale/selectors';

export const useDebouncedEffect = (effect, delay, deps) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const callback = useCallback(effect, deps);

	useEffect(
		() => {
			const handler = setTimeout(() => {
				callback();
			}, delay);

			return () => {
				clearTimeout(handler);
			};
		},
		[callback, delay]
	);
};

export const MoonPayTransactionContainer = withNavFlow(
	props => {
		const { onNext, onCancel, onStepUpdate, ...otherProps } = props;

		const dispatch = useDispatch();

		const locale = useSelector(getLocale);
		const quote = useSelector(moonPaySelectors.getQuote);
		const error = useSelector(moonPaySelectors.getQuoteError);
		const transaction = useSelector(moonPaySelectors.getTransaction);
		const currencies = useSelector(moonPaySelectors.getSupportedFiat);
		const currencyCode = config.dev ? 'ETH' : 'KEY';

		// console.log('quote', quote);
		// console.log('error', error);
		// console.log('transaction', transaction);

		const [baseCurrencyCode, setBaseCurrencyCode] = useState(
			useSelector(moonPaySelectors.getBaseCurrencyCode)
		);
		const [baseAmount, setBaseAmount] = useState();

		const handleCurrencyChange = evt => setBaseCurrencyCode(evt.target.value);

		const handleAmountChange = evt => setBaseAmount(evt.target.value);

		useDebouncedEffect(
			() => {
				if (baseAmount > 0) {
					dispatch(
						moonPayOperations.calculateQuote({
							baseAmount,
							baseCurrencyCode,
							currencyCode
						})
					);
				}
			},
			500,
			[baseAmount]
		);
		useEffect(
			() =>
				dispatch(
					moonPayOperations.calculateQuote({ baseAmount, baseCurrencyCode, currencyCode })
				),
			[baseCurrencyCode]
		);

		const handleBuyClick = async () => {
			onNext();
			dispatch(
				moonPayOperations.transactionOperation({
					baseAmount,
					baseCurrencyCode,
					currencyCode
				})
			);
		};

		const handleLinkClick = e => {
			window.openExternal(e, e.target.href || e.currentTarget.href);
		};

		return (
			<MoonPayTransactionModal
				{...otherProps}
				locale={locale}
				quote={quote}
				baseCurrencyCode={baseCurrencyCode}
				onCurrencyChange={handleCurrencyChange}
				baseAmount={baseAmount}
				onAmountChange={handleAmountChange}
				onBuyClick={handleBuyClick}
				onLinkClick={handleLinkClick}
				currencyCode={currencyCode}
				currencies={currencies}
				error={error}
			/>
		);
	},
	{
		next: '/main/moonpay/loading/payment-flow'
	}
);

export default MoonPayTransactionContainer;
