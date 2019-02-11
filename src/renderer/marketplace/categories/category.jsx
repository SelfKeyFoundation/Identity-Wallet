import React from 'react';

import { Grid, Button, withStyles, Typography } from '@material-ui/core';

const styles = theme => ({
	root: {
		width: '360px',
		height: '326px',
		marginTop: '30px',
		marginBottom: '30px',
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
		height: '76px'
	},

	svgIcon: {
		height: '44px',
		color: '#23E6FE'
	},

	body: {
		width: '320px',
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
		margin: '20px'
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
						variant="outlined"
						disabled={!active}
						className={classes.button}
						onClick={learnMoreAction}
					>
						{active ? 'Learn More' : 'Coming Soon'}
					</Button>
				</Grid>
			</Grid>
		</Grid>
	)
);

export default MarketplaceCategory;
