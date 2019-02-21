import React, { Component } from 'react';
import {
	withStyles,
	Table,
	TableBody,
	TableHead,
	TableCell,
	TableRow,
	Typography
} from '@material-ui/core';
import { PriceSummary, VisibilityOnIcon, VisibilityOffIcon, SmallTableHeadRow } from 'selfkey-ui';

export const styles = theme => ({
	iconSize: {
		width: '19.6px !important',
		height: '23.1px !important'
	},
	summary: {
		fontSize: '15px',
		fontWeight: 500,
		lineHeight: '18px',
		'& >div': {
			fontSize: '15px !important',
			fontWeight: '500 !important',
			lineHeight: '18px !important'
		}
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
				<TableCell>
					<Typography variant="h6">{token.name}</Typography>
				</TableCell>
				<TableCell>
					<Typography variant="h6">{token.symbol}</Typography>
				</TableCell>
				<TableCell numeric>
					<PriceSummary
						locale={locale}
						style="decimal"
						currency={token.symbol}
						value={token.balance}
						className={classes.summary}
					/>
				</TableCell>
				<TableCell numeric>
					<PriceSummary
						locale={locale}
						style="currency"
						currency={fiatCurrency}
						value={token.price}
						className={classes.summary}
					/>
				</TableCell>
				<TableCell numeric>
					<PriceSummary
						locale={locale}
						style="currency"
						currency={fiatCurrency}
						value={token.balanceInFiat}
						className={classes.summary}
					/>
				</TableCell>
				<TableCell>
					<Typography variant="h6">{token.address}</Typography>
				</TableCell>
				<TableCell>
					<Typography variant="h6">{visibilityButton}</Typography>
				</TableCell>
			</TableRow>
		);
	}

	render() {
		const { classes, tokens = [] } = this.props;

		const tokenRows = tokens.map(this.renderRow.bind(this));

		return (
			<div className={classes.cryptoPriceTable}>
				<Table>
					<TableHead>
						<SmallTableHeadRow>
							<TableCell>
								<Typography variant="overline">Name</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Token Symbol</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Balance</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Last Price</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Total Value</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="overline">Token Contract Address</Typography>
							</TableCell>
							<TableCell>&nbsp;</TableCell>
						</SmallTableHeadRow>
					</TableHead>
					<TableBody>{tokenRows}</TableBody>
				</Table>
			</div>
		);
	}
}

export const CryptoPriceTable = withStyles(styles)(CryptoPriceTableComponent);

export default CryptoPriceTable;
