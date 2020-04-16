import React, { PureComponent } from 'react';
import {
	Table,
	TableBody,
	TableHead,
	TableCell,
	TableRow,
	Typography,
	Grid,
	Button
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { PriceSummary, DeleteIcon, SmallTableHeadRow } from 'selfkey-ui';
import { Popup } from '../common/popup';

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
	},
	pointer: {
		cursor: 'pointer'
	},
	popup: {
		'& > div:nth-child(2)': {
			left: 'calc(50% - 250px)',
			top: '275px',
			width: '500px'
		},
		'& button': {
			'& div': {
				marginLeft: '499px !important'
			}
		}
	},
	cryptoPriceTable: {
		bodySection: {
			maxWidth: '1080px',
			width: '100%'
		},
		'@media screen and (min-width: 1230px)': {
			bodySection: {
				maxWidth: '1140px'
			}
		}
	},
	address: {
		maxWidth: '211px',
		overflow: 'hidden',
		textOverflow: 'ellipsis'
	},
	'@media screen and (min-width: 1230px)': {
		address: {
			maxWidth: 'initial'
		}
	}
});

class CryptoPriceTableComponent extends PureComponent {
	state = {
		showConfirmationModal: false,
		token: null
	};

	handleOpenConfirmationModal = (evt, token) => {
		evt && evt.preventDefault();
		this.setState({ showConfirmationModal: true, token: token });
	};

	handleCloseConfirmationModal = evt => {
		evt && evt.preventDefault();
		this.setState({ showConfirmationModal: false });
	};

	handleAcceptConfirmationModal = evt => {
		const { token } = this.state;
		evt && evt.preventDefault();
		this.setState({ showConfirmationModal: false });
		this.props.toggleAction(evt, token);
	};

	renderConfirmation() {
		const { classes } = this.props;
		return (
			<Popup
				open={true}
				text={'Are you sure?'}
				closeAction={this.handleCloseConfirmationModal}
				className={classes.popup}
			>
				<Grid
					container
					className={classes.root}
					spacing={32}
					direction="column"
					justify="flex-start"
					alignItems="stretch"
				>
					<Grid item>
						<Typography variant="body2">
							Hiding tokens from this list only disables them from the display, and{' '}
							does not impact their status on the Ethereum blockchain.
						</Typography>
					</Grid>
					<Grid item>
						<Grid container spacing={24}>
							<Grid item>
								<Button
									variant="contained"
									size="large"
									onClick={this.handleAcceptConfirmationModal}
								>
									Yes, Remove
								</Button>
							</Grid>
							<Grid item>
								<Button
									variant="outlined"
									size="large"
									onClick={this.handleCloseConfirmationModal}
								>
									Cancel
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	}

	renderVisibilityButton(token) {
		const { classes, alwaysVisible = [] } = this.props;
		if (alwaysVisible.includes(token.address || '')) return;
		let icon;
		if (token.recordState) {
			icon = <DeleteIcon className={classes.iconSize} />;
		}
		return (
			<div
				className={classes.pointer}
				onClick={event => this.handleOpenConfirmationModal(event, token)}
			>
				{icon}
			</div>
		);
	}

	renderRow(token, index) {
		const { locale, fiatCurrency, classes, alwaysVisible = [] } = this.props;
		const visibilityButton = this.renderVisibilityButton(token);
		if (alwaysVisible.includes(token.address || '') || token.recordState) {
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
							fractionDigits={token.decimal}
							value={token.balance}
							className={classes.summary}
						/>
					</TableCell>
					<TableCell numeric>
						<PriceSummary
							locale={locale}
							priceStyle="currency"
							currency={fiatCurrency}
							value={token.price}
							showCurrency={fiatCurrency}
							className={classes.summary}
						/>
					</TableCell>
					<TableCell numeric>
						<PriceSummary
							locale={locale}
							priceStyle="currency"
							currency={fiatCurrency}
							value={token.balanceInFiat}
							showCurrency={fiatCurrency}
							className={classes.summary}
						/>
					</TableCell>
					<TableCell title={token.address}>
						<Typography variant="h6" className={classes.address}>
							{token.address}
						</Typography>
					</TableCell>
					<TableCell>
						<Typography variant="h6">{visibilityButton}</Typography>
					</TableCell>
				</TableRow>
			);
		} else {
			return null;
		}
	}

	render() {
		const { classes, tokens = [] } = this.props;
		const { showConfirmationModal } = this.state;
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

				{showConfirmationModal && this.renderConfirmation()}
			</div>
		);
	}
}

export const CryptoPriceTable = withStyles(styles)(CryptoPriceTableComponent);

export default CryptoPriceTable;
