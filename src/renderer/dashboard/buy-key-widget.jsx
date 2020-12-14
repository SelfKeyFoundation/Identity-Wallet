import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { CustomIcon, CoinsIcon, ExchangeSmallIcon } from 'selfkey-ui';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles(theme => ({
	bgIcon: {
		top: '-60px',
		marginTop: '-112px',
		opacity: '0.5',
		position: 'relative',
		right: '-250px',
		zIndex: 0
	},
	buyKey: {
		backgroundColor: '#1E262E',
		border: '1px solid #43505B',
		borderRadius: '4px',
		boxSizing: 'border-box',
		flexGrow: 1,
		height: '236px',
		marginBottom: '15px',
		maxHeight: '236px',
		overflow: 'hidden',
		padding: '20px 30px 30px'
	},
	ctabutton: {
		backgroundColor: '#1E262E',
		display: 'flex',
		justifyContent: 'space-between',
		maxWidth: '100%',
		marginLeft: 'auto',
		marginRight: '0',
		marginBottom: '1em',
		position: 'relative',
		width: '100%',
		zIndex: 1,
		'& span': {
			flexGrow: 1
		},
		'& svg': {
			width: '24px !important',
			height: '24px !important'
		}
	},
	title: {
		fontSize: '20px',
		marginBottom: '30px'
	},
	'@media screen and (min-width: 1230px)': {
		bgIcon: {
			right: '-269px'
		}
	}
}));

export const BuyKeyWidget = props => {
	const { onBuyClick, onSwapClick } = props;
	const classes = useStyles();
	return (
		<Grid item className={classes.buyKey}>
			<Typography variant="h1" className={classes.title}>
				Buy KEY tokens, to use in the SelfKey Marketplace.
			</Typography>
			<Button
				variant="outlined"
				size="large"
				className={classes.ctabutton}
				onClick={onBuyClick}
			>
				<CustomIcon width="24px" height="24px" />
				<span>Buy KEY</span>
			</Button>

			{onSwapClick && (
				<Button
					variant="outlined"
					size="large"
					className={classes.ctabutton}
					onClick={onSwapClick}
				>
					<ExchangeSmallIcon width="24px" height="24px" />
					<span>Swap Tokens</span>
				</Button>
			)}
			<div className={classes.bgIcon}>
				<CoinsIcon width="76px" height="79px" fill="#313B49" />
			</div>
		</Grid>
	);
};

BuyKeyWidget.propTypes = {
	onBuyClick: PropTypes.func.isRequired,
	onSwapClick: PropTypes.func
};

export default BuyKeyWidget;
