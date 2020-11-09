import React from 'react';
import { Grid, Button, Typography, Input, IconButton, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
	MyCryptoLargeIcon,
	ModalWrap,
	ModalHeader,
	ModalBody,
	KeyTooltip,
	InfoTooltip,
	BackButton
} from 'selfkey-ui';
import { PropTypes } from 'prop-types';

const withStyles = makeStyles({
	wrap: {
		margin: 0,
		width: '100%'
	},
	back: {
		position: 'absolute',
		top: '100px',
		left: '20px'
	},
	form: {
		width: '400px'
	},
	textAlignCenter: {
		textAlign: 'center'
	},
	modalPosition: {
		position: 'static'
	},
	label: {
		marginBottom: '8px'
	},
	tooltip: {
		position: 'relative',
		top: '-2px'
	},
	loading: {
		position: 'relative',
		marginLeft: '8px',
		top: '5px'
	},
	searching: {
		height: '19px',
		width: '242px',
		color: '#00C0D9',
		fontFamily: 'Lato',
		fontSize: '13px',
		lineHeight: '19px',
		textTransform: 'none',
		marginLeft: '8px'
	},
	errorText: {
		height: '19px',
		width: '242px',
		color: '#FE4B61',
		fontFamily: 'Lato',
		fontSize: '13px',
		lineHeight: '19px'
	},
	errorColor: {
		color: '#FE4B61 !important',
		border: '2px solid #FE4B61 !important',
		backgroundColor: 'rgba(255,46,99,0.09) !important'
	},
	input: {
		width: '100%',
		'&::-webkit-input-placeholder': {
			fontSize: '14px',
			color: '#93B0C1'
		}
	},
	inputError: {
		borderBottom: '2px solid #FE4B61 !important'
	},
	bottomSpace: {
		marginBottom: '24px'
	},
	link: {
		color: '#00C0D9',
		cursor: 'pointer',
		textDecoration: 'none'
	},
	topSpace: {
		marginTop: '24px'
	}
});

export const AddToken = React.memo(
	({
		addressError,
		tokenError,
		address,
		symbol,
		decimal,
		found,
		duplicate,
		searching,
		onFieldChange,
		onSubmit,
		onBackClick,
		onHelpClick
	}) => {
		const classes = withStyles();
		const hasAddressError =
			(addressError !== '' && addressError !== undefined && address !== '') ||
			(tokenError !== '' && tokenError !== undefined && address !== '');
		const notFound = !found && address !== '' && !hasAddressError && !duplicate;
		const addressInputClass = `${classes.input} ${
			(hasAddressError || notFound || duplicate) && !searching ? classes.errorColor : ''
		}`;

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
					<Typography variant="h1">Add Custom Token</Typography>
				</Grid>
				<Grid item xs={6} className={classes.textAlignCenter}>
					<Typography
						variant="body1"
						color="secondary"
						className={classes.bottomSpace}
						gutterBottom
					>
						Add ERC20 tokens to be displayed in the dashboard. After entering the token
						address, the wallet will verify it exists on the blockchain and auto-fill
						the remaining information of ticker and decimals.
					</Typography>
				</Grid>
				<ModalWrap className={classes.modalPosition}>
					<ModalHeader>
						<Typography variant="body1">Add Token</Typography>
					</ModalHeader>
					<ModalBody>
						<Grid
							container
							direction="column"
							justify="center"
							alignItems="stretch"
							spacing={4}
						>
							<Grid item>
								<Typography variant="overline" gutterBottom>
									Token Address
									<KeyTooltip
										interactive
										placement="top-start"
										className={classes.tooltip}
										TransitionProps={{ timeout: 0 }}
										title={
											<React.Fragment>
												<span>
													Every ERC-20 token has its own smart contract
													address. To learn more,{' '}
													<a
														className={classes.link}
														onClick={onHelpClick}
													>
														click here.
													</a>
												</span>
											</React.Fragment>
										}
									>
										<IconButton aria-label="Info">
											<InfoTooltip />
										</IconButton>
									</KeyTooltip>
									{searching && (
										<React.Fragment>
											<span className={classes.loading}>
												<CircularProgress size={20} />
											</span>
											<span id="searching" className={classes.searching}>
												Please wait. Checking the blockchain for ERC-20
												token information.
											</span>
										</React.Fragment>
									)}
								</Typography>
								<Input
									name="address"
									value={address}
									onChange={onFieldChange}
									className={addressInputClass}
									disableUnderline
								/>
								{!searching && hasAddressError && (
									<span id="addressError" className={classes.errorText}>
										{addressError || tokenError}
									</span>
								)}
								{!searching && notFound && (
									<span id="notFound" className={classes.errorText}>
										{`Token contract does not exist or not supported. Please double check and try again.`}
									</span>
								)}
								{!searching && duplicate && (
									<span id="duplicate" className={classes.errorText}>
										{`Address is already being used.`}
									</span>
								)}
							</Grid>
							<Grid item>
								<Typography variant="overline" className={classes.label}>
									Token Symbol
								</Typography>
								<Input
									name="symbol"
									value={symbol}
									className={classes.input}
									disabled
									disableUnderline
								/>
							</Grid>
							<Grid item>
								<Typography variant="overline" className={classes.label}>
									Decimal Places
								</Typography>
								<Input
									name="decimal"
									value={decimal}
									className={classes.input}
									disabled
									disableUnderline
								/>
							</Grid>
							<Grid item>
								<Grid container spacing={3}>
									<Grid item>
										<Button
											variant="contained"
											disabled={!found || duplicate || hasAddressError}
											size="large"
											onClick={onSubmit}
										>
											Add Custom Token
										</Button>
									</Grid>

									<Grid item>
										<Button
											variant="outlined"
											color="secondary"
											size="large"
											onClick={onBackClick}
										>
											Cancel
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</ModalBody>
				</ModalWrap>
			</Grid>
		);
	}
);

AddToken.propTypes = {
	addressError: PropTypes.string,
	tokenError: PropTypes.string,
	address: PropTypes.string,
	symbol: PropTypes.string,
	decimal: PropTypes.integer,
	found: PropTypes.bool,
	duplicate: PropTypes.bool,
	searching: PropTypes.bool,
	onFieldChange: PropTypes.func,
	onSubmit: PropTypes.func,
	onBackClick: PropTypes.func,
	onHelpClick: PropTypes.func
};
