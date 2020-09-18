import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Button, Typography } from '@material-ui/core';

const styles = theme => ({
	root: {
		backgroundColor: '#262F39',
		border: 'solid 1px #303c49',
		borderRadius: '4px',
		fontFamily: 'Lato, arial, sans-serif',
		height: '326px',
		marginBottom: theme.spacing(4),
		width: '340px'
	},

	title: {
		margin: theme.spacing(2)
	},

	icon: {
		marginLeft: theme.spacing(2)
	},

	header: {
		backgroundColor: '#2a3540',
		borderRadius: '3px 3px 0 0',
		height: '76px',
		width: '338px'
	},

	svgIcon: {
		color: '#23E6FE',
		height: '44px'
	},

	body: {
		color: '#fff',
		fontFamily: 'Lato, arial, sans-serif',
		fontSize: '16px',
		fontWeight: 400,
		height: '130px',
		lineHeight: 1.5,
		margin: theme.spacing(2),
		textAlign: 'left',
		width: '300px'
	},

	footer: {
		margin: theme.spacing(2),
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
