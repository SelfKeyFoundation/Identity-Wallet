import React from 'react';
import { TableRow, TableCell, Typography, withStyles } from '@material-ui/core';
import { Tag } from 'selfkey-ui';

const styles = theme => ({
	// root: {
	// 	width: '360px',
	// 	height: '326px',
	// 	border: 'solid 1px #303c49',
	// 	borderRadius: '4px',
	// 	fontFamily: 'Lato, arial, sans-serif'
	// },

	// svgIcon: {
	// 	fontSize: '50px',
	// 	color: '#FFF'
	// },

	// title: {
	// 	margin: '20px'
	// },

	icon: {
		// marginLeft: '20px'
		height: '30px',
		width: '30px'
	},

	// header: {
	// 	backgroundColor: '#2a3540'
	// },

	// body: {
	// 	width: '320px',
	// 	textAlign: 'left',
	// 	margin: '20px',
	// 	color: '#fff',
	// 	fontFamily: 'Lato, arial, sans-serif',
	// 	fontSize: '16px',
	// 	fontWeight: 400,
	// 	lineHeight: 1.5,
	// 	height: '130px'
	// },
	noRightPadding: {
		paddingRight: 0
	},

	link: {
		cursor: 'pointer'
	},

	footer: {
		margin: '20px'
	}
});

export const MarketplaceServicesListItem = withStyles(styles)(
	({ classes, children, name, description, status, logoUrl, viewAction }) => (
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
				<Typography
					variant="h6"
					color="primary"
					disabled
					onClick={() => (viewAction ? viewAction(name) : '')}
					className={classes.link}
				>
					Coming Soon
				</Typography>
			</TableCell>
		</TableRow>
	)
);

export default MarketplaceServicesListItem;
