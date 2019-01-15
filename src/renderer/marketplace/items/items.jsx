import React from 'react';

import { Grid, Button, withStyles } from '@material-ui/core';
import { H1, ExchangeIcon } from 'selfkey-ui';
import { Item } from './item';

const styles = theme => ({
	wrapper: {
		width: '1140px'
	},

	header: {
		borderBottom: 'solid 1px #475768',
		'& h1': {
			marginLeft: '20px'
		},
		'& svg': {
			marginLeft: '20px'
		},
		width: '100%',
		height: '120px'
	},

	body: {
		marginTop: '20px'
	},

	headerContent: {
		marginTop: '30px'
	},

	button: {
		color: '#93b0c1',
		borderColor: '#3b4a5a',
		'&:disabled': {
			color: '#48565f'
		}
	}
});

const getItems = (items, viewAction) => {
	return items.map(item => {
		return (
			<Item
				key={item.name}
				name={item.name}
				description={item.description}
				status={item.status}
				logoUrl={item.logoUrl}
				viewAction={viewAction}
			/>
		);
	});
};

export const Items = withStyles(styles)(
	({ classes, children, category, items, backAction, viewAction }) => (
		<Grid container>
			<Grid item>
				<Button variant="outlined" className={classes.button} onClick={backAction}>
					&#60; Back
				</Button>
			</Grid>
			<Grid item>
				<Grid
					container
					direction="column"
					justify="center"
					alignItems="center"
					className={classes.wrapper}
				>
					<Grid item id="header" className={classes.header} xs={12}>
						<Grid
							container
							direction="row"
							justify="flex-start"
							alignItems="center"
							className={classes.headerContent}
						>
							<Grid item>
								<ExchangeIcon />
							</Grid>
							<Grid item>
								<H1>{category}</H1>
							</Grid>
						</Grid>
					</Grid>
					<Grid item id="body" xs={12} className={classes.body}>
						<Grid container direction="row" justify="space-between" alignItems="center">
							{getItems(items, viewAction)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
);

export default Items;
