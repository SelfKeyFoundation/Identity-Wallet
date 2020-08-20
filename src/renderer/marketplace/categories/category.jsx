import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Button, Typography } from '@material-ui/core';

const styles = theme => ({
	root: {
		width: '340px',
		height: '326px',
		marginTop: '16px',
		marginBottom: '16px',
		border: 'solid 1px #303c49',
		borderRadius: '4px',
		fontFamily: 'Lato, arial, sans-serif',
		backgroundColor: '#262F39'
	},
	title: {
		margin: '20px'
	},
	icon: {
		marginLeft: '20px'
	},
	header: {
		backgroundColor: '#2a3540',
		borderRadius: '3px 3px 0 0',
		height: '76px',
		width: '338px'
	},
	svgIcon: {
		height: '44px',
		color: '#23E6FE'
	},
	body: {
		width: '300px',
		textAlign: 'left',
		margin: '20px',
		color: '#fff',
		fontFamily: 'Lato, arial, sans-serif',
		fontSize: '16px',
		fontWeight: 400,
		lineHeight: 1.5,
		height: '130px'
	},
	footer: {
		margin: '20px',
		'& button': {
			fontSize: '10px'
		}
	},
	'@media screen and (min-width: 1230px)': {
		root: {
			width: '360px'
		},
		header: {
			width: '358px'
		}
	}
});

export const MarketplaceCategory = withStyles(styles)(
	({ classes, children, title, description, active, svgIcon, learnMoreAction }) => (
		<Grid container className={classes.root}>
			<Grid item>
				<Grid
					container
					id="header"
					direction="row"
					justify="flex-start"
					alignItems="center"
					className={classes.header}
				>
					<Grid item id="icon" className={classes.icon}>
						{svgIcon && <img src={svgIcon} className={classes.svgIcon} />}
					</Grid>
					<Grid item id="title" className={classes.title}>
						<Typography variant="h2">{title}</Typography>
					</Grid>
				</Grid>
				<Grid item id="body" className={classes.body}>
					<Typography variant="body2">{description}</Typography>
				</Grid>
				<Grid item id="footer" className={classes.footer}>
					<Button
						id={`#marketplace${title.replace(/\s+/g, '')}Button`}
						variant="outlined"
						disabled={!active}
						onClick={learnMoreAction}
					>
						{active ? 'Access Marketplace' : 'Coming Soon'}
					</Button>
				</Grid>
			</Grid>
		</Grid>
	)
);

const newStyles = theme => ({
	rootRightMargin: {
		marginRight: 'calc((100% - (257px * 4))/3)'
	},
	root: {
		backgroundColor: '#293743',
		border: '1px solid #1D505F',
		borderRadius: '4px',
		boxSizing: 'border-box',
		cursor: 'pointer',
		height: '243px',
		padding: '32px 20px 40px 20px',
		marginBottom: '16px',
		marginTop: '16px',
		textAlign: 'center',
		transition: 'all 0.2s',
		// width: '340px',
		width: '257px',
		'&:hover': {
			backgroundColor: '#293743a1',
			border: '2px solid #1CA9BA',
			padding: '31px 19px 39px 19px'
		}
	},
	icon: {
		marginBottom: '16px'
	},
	svgIcon: {
		height: '44px'
	},
	'@media screen and (min-width: 1230px)': {
		root: {
			width: '257px'
		}
	}
});

export const NewMarketplaceCategory = withStyles(newStyles)(
	({ classes, children, title, description, active, svgIcon, learnMoreAction, index }) => {
		const isThe4thElement = (index + 1) % 4 !== 0;
		const containerClass = `${classes.root} ${isThe4thElement ? classes.rootRightMargin : ''}`;
		return (
			<Grid container className={containerClass} onClick={learnMoreAction} id={index}>
				<Grid container justify="center" className={classes.icon} id={index}>
					{svgIcon && <img src={svgIcon} className={classes.svgIcon} />}
				</Grid>
				<Grid container justify="center">
					<Typography variant="h2" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
						{title}
					</Typography>
				</Grid>
				<Grid item>
					<Typography variant="subtitle2">{description}</Typography>
				</Grid>
			</Grid>
		);
	}
);

export default MarketplaceCategory;
