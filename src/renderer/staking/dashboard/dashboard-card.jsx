import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { NumberFormat, primaryTint } from 'selfkey-ui';
import { CardContent, Grid, Divider, Typography } from '@material-ui/core';
import AccentedCard from '../../common/accented-card';

const useStyles = makeStyles({
	dashboardCard: {
		width: 257,
		height: 437
	},
	content: {
		height: '100%'
	}
});

export const StakingCardHeader = ({ title, icon }) => {
	return (
		<Grid container direction="row" justify="space-between" spacing={0}>
			<Grid item>
				<Typography variant="subtitle2" color="secondary">
					{title}
				</Typography>
			</Grid>
			{icon && <Grid item>{icon}</Grid>}
		</Grid>
	);
};

export const StakingCardTokenBalance = ({ token, locale, balance }) => {
	return (
		<Grid container direction="column" spacing={3}>
			<Grid item>
				<Grid
					container
					direction="row"
					justify="flex-end"
					alignItems="flex-end"
					spacing={1}
				>
					<Grid item>
						<Typography variant="body1">
							<NumberFormat
								locale={locale}
								fractionDigits={token.decimals}
								value={balance}
								priceStyle="decimal"
								currency={token.symbol}
							/>
						</Typography>
					</Grid>
					<Grid item>
						<Typography variant="subtitle1" color="secondary">
							{token.symbol}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			<Grid item>
				<Divider />
			</Grid>
		</Grid>
	);
};

export const StakingDashboardCard = ({
	accentColor = primaryTint,
	token,
	title,
	icon,
	children,
	backgroundImage,
	balance,
	locale = 'en'
}) => {
	const classes = useStyles();
	return (
		<AccentedCard
			className={classes.dashboardCard}
			elevation={5}
			accentColor={accentColor}
			gradient
			backgroundImage={backgroundImage}
		>
			<CardContent className={classes.content}>
				<Grid container direction="column" spacing={2} className={classes.content}>
					{title && (
						<Grid item>
							<StakingCardHeader title={title} icon={icon} />
						</Grid>
					)}
					{token && (
						<Grid item>
							<StakingCardTokenBalance
								token={token}
								balance={balance}
								locale={locale}
							/>
						</Grid>
					)}
					{children && (
						<Grid item xs>
							{children}
						</Grid>
					)}
				</Grid>
			</CardContent>
		</AccentedCard>
	);
};

export default StakingDashboardCard;
