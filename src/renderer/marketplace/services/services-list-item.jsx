import React from 'react';
import { Button, TableRow, TableCell, Typography, withStyles } from '@material-ui/core';
import { Tag } from 'selfkey-ui';

const styles = theme => ({
	icon: {
		height: '30px',
		width: '30px'
	},

	noRightPadding: {
		paddingRight: 0
	},

	link: {
		cursor: 'pointer'
	},

	footer: {
		margin: '20px'
	},

	button: {
		minWidth: 0,
		textTransform: 'capitalize'
	}
});

export const MarketplaceServicesListItem = withStyles(styles)(
	({ classes, children, name, logoUrl, viewAction }) => (
		<TableRow key={name}>
			<TableCell className={classes.noRightPadding}>
				<img src={logoUrl} className={classes.icon} />
			</TableCell>
			<TableCell>
				<Typography variant="h6">{name}</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="h6">Location</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="h6">Fees</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="h6">
					<Tag>EUR</Tag> <Tag>USD</Tag> <Tag>GBP</Tag>
				</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="h6">Fiat Payments</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="h6">Excluded Residents</Typography>
			</TableCell>
			<TableCell>
				<Button
					disabled
					variant="text"
					color="secondary"
					className={classes.button}
					onClick={() => (viewAction ? viewAction(name) : '')}
				>
					Coming Soon
				</Button>
			</TableCell>
		</TableRow>
	)
);

export default MarketplaceServicesListItem;
