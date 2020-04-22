import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { getLocale } from 'common/locale/selectors';
import { PriceSummary } from 'selfkey-ui';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getCryptoValue, getToValue } from './price-utils';

const styles = theme => ({
	cryptoCurrencyValue: {
		fontFamily: 'Lato, arial, sans-serif',
		fontSize: '40px',
		fontWeight: 300,
		color: '#ffffff'
	},

	currency: {
		fontFamily: 'Lato, arial, sans-serif',
		fontSize: '14px',
		color: '#93b0c1'
	}
});

export const TokenPrice = withStyles(styles)(
	({ classes, children, locale, cryptoCurrency, cryptoValue, toCurrency, toValue }) => (
		<div>
			<PriceSummary
				locale={locale}
				style="decimal"
				currency={cryptoCurrency}
				value={cryptoValue}
				valueClass={classes.cryptoCurrencyValue}
			/>
			<PriceSummary
				locale={locale}
				style="currency"
				currency={toCurrency}
				currencyClass={classes.currency}
				value={toValue}
				valueClass={classes.currency}
				prependCurrency
			/>
		</div>
	)
);

const mapStateToProps = (state, props) => {
	return {
		...getLocale(state),
		toCurrency: getFiatCurrency(state).fiatCurrency,
		cryptoValue: getCryptoValue(state, props),
		toValue: getToValue(state, props)
	};
};

export default connect(mapStateToProps)(TokenPrice);
