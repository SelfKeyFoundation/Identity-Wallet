import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Button, Typography, List } from '@material-ui/core';
import { Popup } from '../common/popup';
import { MyCryptoLargeIcon, PriceSummary, BackButton } from 'selfkey-ui';
import { PropTypes } from 'prop-types';

const withStyles = makeStyles({
	wrap: {
		margin: 0,
		width: '100%'
	},
	bottomSpace: {
		marginBottom: '15px'
	},
	topSpace: {
		marginTop: '30px'
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
	label: {
		width: '100px'
	},
	listBottomSpace: {
		marginBottom: '30px',
		paddingLeft: '16px'
	},
	listContainer: {
		marginBottom: '10px'
	},
	summary: {
		marginTop: 0
	}
});

const TokenRemovedModal = ({ onCloseTokenRemovedModal }) => {
	const classes = withStyles();

	return (
		<Popup
			open={true}
			text={'Token Removed'}
			closeAction={onCloseTokenRemovedModal}
			className={classes.popup}
		>
			<Grid
				container
				className={classes.root}
				spacing={4}
				direction="column"
				justify="flex-start"
				alignItems="stretch"
			>
				<Grid item>
					<Typography variant="body2">
						Removing tokens from this list only disables them from the display, and does
						not impact their status on the Ethereum blockchain.
					</Typography>
				</Grid>
				<Grid item>
					<Grid container spacing={3}>
						<Grid item>
							<Button
								variant="outlined"
								size="large"
								color="secondary"
								onClick={onCloseTokenRemovedModal}
							>
								Close
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	);
};

const TokenAddedModal = ({ locale, tokenAdded, onCloseTokenAddedModal }) => {
	const classes = withStyles();

	return (
		<Popup
			open={true}
			text={'New ERC-20 Token Added'}
			closeAction={onCloseTokenAddedModal}
			className={classes.popup}
		>
			<Grid
				container
				className={classes.root}
				spacing={4}
				direction="column"
				justify="flex-start"
				alignItems="stretch"
			>
				<List component="dl" className={classes.listBottomSpace}>
					<Grid container className={classes.listContainer} wrap="nowrap">
						<dt className={classes.label}>
							<Typography variant="body2" color="secondary">
								Name
							</Typography>
						</dt>
						<dd data-akarmi={tokenAdded.name}>
							<Typography variant="body2" className={classes.bold}>
								{tokenAdded.name}
							</Typography>
						</dd>
					</Grid>
					<Grid container className={classes.listContainer} wrap="nowrap">
						<dt className={classes.label}>
							<Typography variant="body2" color="secondary">
								Symbol
							</Typography>
						</dt>
						<dd>
							<Typography variant="body2" className={classes.bold}>
								{tokenAdded.symbol}
							</Typography>
						</dd>
					</Grid>
					<Grid container className={classes.listContainer} wrap="nowrap">
						<dt className={classes.label}>
							<Typography variant="body2" color="secondary">
								Balance
							</Typography>
						</dt>
						<dd>
							<PriceSummary
								locale={locale}
								style="decimal"
								currency={tokenAdded.symbol}
								fractionDigits={tokenAdded.decimal}
								value={tokenAdded.balance}
								className={`${classes.summary} ${classes.bold}`}
							/>
						</dd>
					</Grid>
				</List>
				<Grid item>
					<Grid container spacing={3}>
						<Grid item>
							<Button
								variant="outlined"
								size="large"
								color="secondary"
								onClick={onCloseTokenAddedModal}
							>
								Close
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	);
};

export const CryptoManager = React.memo(
	({
		cryptoPriceTableComponent,
		locale,
		tokenAdded,
		showAddedModal,
		showRemovedModal,
		onCloseTokenAddedModal,
		onCloseTokenRemovedModal,
		onBackClick,
		onAddTokenClick,
		onManageAllowanceClick
	}) => {
		const classes = withStyles();

		return (
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="center"
				spacing={4}
				className={classes.wrap}
			>
				<BackButton onclick={onBackClick} />
				<Grid item className={classes.topSpace}>
					<MyCryptoLargeIcon />
				</Grid>
				<Grid item>
					<Typography variant="h1">Manage My Crypto</Typography>
				</Grid>
				<Grid item>
					<Typography variant="body1" color="secondary">
						Manage your ERC20 tokens displayed in the SelfKey Identity Wallet dashboard.
					</Typography>
				</Grid>
				<Grid item className={classes.bottomSpace}>
					<Grid container direction="row" spacing={2}>
						<Grid item>
							<Button variant="outlined" size="large" onClick={onAddTokenClick}>
								Add token
							</Button>
						</Grid>
						{onManageAllowanceClick && (
							<Grid item>
								<Button
									variant="outlined"
									size="large"
									onClick={onManageAllowanceClick}
								>
									Manage Allowance
								</Button>
							</Grid>
						)}
					</Grid>
				</Grid>
				<Grid item>{cryptoPriceTableComponent}</Grid>

				{showAddedModal && (
					<TokenAddedModal
						locale={locale}
						tokenAdded={tokenAdded}
						onCloseTokenAddedModal={onCloseTokenAddedModal}
					/>
				)}
				{showRemovedModal && (
					<TokenRemovedModal onCloseTokenRemovedModal={onCloseTokenRemovedModal} />
				)}
			</Grid>
		);
	}
);

CryptoManager.propTypes = {
	cryptoPriceTableComponent: PropTypes.element,
	locale: PropTypes.string,
	tokenAdded: PropTypes.object,
	showAddedModal: PropTypes.bool,
	showRemovedModal: PropTypes.bool,
	onCloseTokenAddedModal: PropTypes.func,
	onCloseTokenRemovedModal: PropTypes.func,
	onBackClick: PropTypes.func,
	onAddTokenClick: PropTypes.func,
	onManageAllowanceClick: PropTypes.func
};
