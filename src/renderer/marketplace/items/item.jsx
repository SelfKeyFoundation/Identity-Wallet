import React from 'react';

import { Grid, Button, withStyles } from '@material-ui/core';
import { P, H2 } from 'selfkey-ui';

import Truncate from 'react-truncate';

const styles = theme => ({
	root: {
		width: '360px',
		height: '326px',
		marginTop: '30px',
		marginBottom: '30px',
		border: 'solid 1px #303c49',
		borderRadius: '4px',
		fontFamily: 'Lato, arial, sans-serif'
	},

	svgIcon: {
		fontSize: '50px',
		color: '#FFF'
	},

	title: {
		margin: '20px'
	},

	icon: {
		marginLeft: '20px'
	},

	button: {
		color: '#93b0c1',
		borderColor: '#3b4a5a',
		fontFamily: 'Lato, arial, sans-serif',
		'&:disabled': {
			color: '#48565f'
		}
	},

	header: {
		backgroundColor: '#2a3540'
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

export const Item = withStyles(styles)(
	({ classes, children, name, description, status, logoUrl, viewAction }) => (
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
						<img src={logoUrl} />
					</Grid>
					<Grid item id="title" className={classes.title}>
						<H2>{name}</H2>
					</Grid>
				</Grid>
				<Grid item id="body" className={classes.body}>
					<P>
						<Truncate lines={5}>{description}</Truncate>
					</P>
				</Grid>
				<Grid item id="footer" className={classes.footer}>
					<Button
						variant="outlined"
						className={classes.button}
						onClick={() => (viewAction ? viewAction(name) : '')}
					>
						View
					</Button>
				</Grid>
			</Grid>
		</Grid>
	)
);

export default Item;
