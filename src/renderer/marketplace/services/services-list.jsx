import React from 'react';

import {
	Grid,
	Button,
	withStyles,
	Typography,
	Table,
	TableHead,
	TableBody,
	TableCell
} from '@material-ui/core';
import { LargeTableHeadRow, UnlockIcon } from 'selfkey-ui';
import { MarketplaceServicesListItem } from './services-list-item';

const styles = theme => ({
	wrapper: {
		width: '1140px'
	},

	header: {
		borderBottom: 'solid 1px #475768',
		'& h1': {
			marginLeft: '20px'
		},
		width: '100%',
		height: '120px'
	},

	headerContent: {
		marginTop: '50px',
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'nowrap'
	},

	content: {
		marginTop: '30px',
		margin: 0,
		width: '100%'
	},

	button: {
		color: '#93b0c1',
		borderColor: '#3b4a5a',
		'&:disabled': {
			color: '#48565f'
		}
	},

	bold: {
		fontWeight: 600
	},

	backButtonContainer: {
		left: '15px',
		position: 'absolute',
		top: '120px'
	},

	listContent: {
		margin: 0,
		width: '100%'
	},

	icon: {
		padding: 0
	},

	unlockIcon: {
		marginRight: '10px'
	}
});

const getServices = (items, viewAction) => {
	return items.map(item => {
		return (
			<React.Fragment key={item.id || item.name}>
				<MarketplaceServicesListItem
					id={item.id || item.name}
					name={item.name}
					location={item.location || '-'}
					fees={item.fees || '-'}
					fiatSupported={item.fiatSupported || '-'}
					fiatPayments={item.fiatPayments || '-'}
					excludedResidents={item.excludedResidents || '-'}
					logoUrl={item.logoUrl}
					status={item.status}
					viewAction={viewAction}
				/>
			</React.Fragment>
		);
	});
};

export const MarketplaceServicesList = withStyles(styles)(
	({ classes, children, category, items, backAction, viewAction }) => (
		<Grid container>
			<Grid item>
				<div className={classes.backButtonContainer}>
					<Button variant="outlined" color="secondary" size="small" onClick={backAction}>
						<Typography variant="subtitle2" color="secondary" className={classes.bold}>
							‹ Back
						</Typography>
					</Button>
				</div>
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
							justify="space-between"
							alignItems="center"
							className={classes.headerContent}
						>
							<Grid container>
								<Grid item>{category.icon}</Grid>
								<Grid item>
									<Typography variant="h1">{category.title}</Typography>
								</Grid>
							</Grid>
							<Grid container justify="flex-end">
								<Grid item>
									<Button variant="contained" size="large">
										<UnlockIcon className={classes.unlockIcon} />
										Unlock Marketplace
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					<Grid item className={classes.listContent} xs={12}>
						<Grid
							container
							direction="row"
							justify="start"
							alignItems="center"
							spacing={24}
							className={classes.content}
						>
							<Table>
								<TableHead>
									<LargeTableHeadRow>
										<TableCell className={classes.icon}>&nbsp;</TableCell>
										<TableCell>
											<Typography variant="overline">Exchange</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">Location</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">Fees</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">
												Fiat Supported
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">
												Fiat Payments
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">
												Excluded Residents
											</Typography>
										</TableCell>
										<TableCell>&nbsp;</TableCell>
									</LargeTableHeadRow>
								</TableHead>

								<TableBody>{getServices(items, viewAction)}</TableBody>
							</Table>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
);

export default MarketplaceServicesList;
