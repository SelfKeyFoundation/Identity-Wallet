import React from 'react';
import { Button, TableRow, TableCell, Typography, withStyles } from '@material-ui/core';

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
	({
		classes,
		children,
		name,
		location,
		fees,
		fiatSupported,
		fiatPayments,
		excludedResidents,
		logoUrl,
		viewAction
	}) => (
		<TableRow key={name}>
			<TableCell className={classes.noRightPadding}>
				<img src={logoUrl} className={classes.icon} />
			</TableCell>
			<TableCell>
				<Typography variant="h6">{name}</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="h6">{location}</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="h6">{fees}</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="h6">{fiatSupported}</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="h6">{fiatPayments}</Typography>
			</TableCell>
			<TableCell>
				<Typography variant="h6">{excludedResidents}</Typography>
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
