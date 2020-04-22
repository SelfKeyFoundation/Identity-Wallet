import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Button, Typography } from '@material-ui/core';

const styles = theme => ({
	root: {
		width: '340px',
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

export default MarketplaceCategory;
