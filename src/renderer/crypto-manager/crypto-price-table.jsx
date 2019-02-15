import React, { Component } from 'react';
import { withStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { PriceSummary, VisibilityOnIcon, VisibilityOffIcon } from 'selfkey-ui';

export const styles = theme => ({
	cryptoPriceTable: {
		fontFamily: 'Lato, arial, sans-serif',
		width: '1140px',
		'& td, & th': {
			fontFamily: 'Lato, arial, sans-serif!important'
		}
	},
	table: {
		borderSpacing: '0px',
		width: '100%',
		'& tbody tr:nth-child(odd)': {
			background: '#262f39'
		}
	},

	headerTableRow: {
		height: '38px',
		'& th': {
			fontSize: '12px',
			fontWeight: 600,
			textAlign: 'left',
			color: '#7f8fa4',
			textTransform: 'uppercase',
			borderBottom: '0px',
			paddingLeft: '0px'
		},
		'& th:first-child': {
			paddingLeft: '24px !important'
		}
	},

	bodyTableRow: {
		height: '74px',
		cursor: 'pointer',
		'& td': {
			padding: '0px',
			fontSize: '15px',
			textAlign: 'left',
			color: '#ffffff',
			borderBottom: '0px',
			'& svg g': {
				fill: '#ffffff'
			}
		},
		'& td:first-child': {
			paddingLeft: '24px !important'
		}
	},

	iconSize: {
		width: '19.6px !important',
		height: '23.1px !important'
	}
});

class CryptoPriceTableComponent extends Component {
	renderVisibilityButton(token) {
		const { classes, toggleAction, alwaysVisible = [] } = this.props;
		if (alwaysVisible.includes(token.address || '')) return;
		let icon;
		if (!token.recordState) {
			icon = <VisibilityOffIcon className={classes.iconSize} />;
		} else {
			icon = <VisibilityOnIcon className={classes.iconSize} />;
		}
		return <div onClick={event => toggleAction && toggleAction(event, token)}>{icon}</div>;
	}

	renderRow(token, index) {
		const { locale, fiatCurrency, classes } = this.props;
		const visibilityButton = this.renderVisibilityButton(token);
		return (
			<TableRow key={index} className={classes.bodyTableRow}>
				<TableCell>{token.name}</TableCell>
				<TableCell>{token.symbol}</TableCell>
				<TableCell numeric>
					<PriceSummary
						className={classes.test}
						locale={locale}
						style="decimal"
						currency={token.symbol}
						value={token.balance}
					/>
				</TableCell>
				<TableCell numeric>
					<PriceSummary
						locale={locale}
						style="currency"
						currency={fiatCurrency}
						value={token.price}
					/>
				</TableCell>
				<TableCell numeric>
					<PriceSummary
						locale={locale}
						style="currency"
						currency={fiatCurrency}
						value={token.balanceInFiat}
					/>
				</TableCell>
				<TableCell>{token.address}</TableCell>
				<TableCell>{visibilityButton}</TableCell>
			</TableRow>
		);
	}

	render() {
		const { classes, tokens = [] } = this.props;

		const tokenRows = tokens.map(this.renderRow.bind(this));

		return (
			<div className={classes.cryptoPriceTable}>
				<Table className={classes.table}>
					<TableHead>
						<TableRow className={classes.headerTableRow}>
							<TableCell>NAME</TableCell>
							<TableCell numeric>TOKEN SYMBOL</TableCell>
							<TableCell numeric>BALANCE</TableCell>
							<TableCell numeric>LAST PRICE</TableCell>
							<TableCell numeric>TOTAL VALUE</TableCell>
							<TableCell numeric>TOKEN CONTRACT ADDRESS</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>{tokenRows}</TableBody>
				</Table>
			</div>
		);
	}
}

export const CryptoPriceTable = withStyles(styles)(CryptoPriceTableComponent);

export default CryptoPriceTable;
