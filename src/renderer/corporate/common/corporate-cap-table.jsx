import React from 'react';
import {
	CardHeader,
	Card,
	CardContent,
	Typography,
	Table,
	TableHead,
	TableBody
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { SmallTableRow, SmallTableCell, EditTransparentIcon, SmallTableHeadRow } from 'selfkey-ui';
import {
	getEntityType,
	getProfileName,
	getProfileEmail,
	getMemberPositions,
	getProfileJurisdiction,
	getProfileResidency,
	getMemberEquity
} from './common-helpers.jsx';

const styles = theme => ({
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 16px'
	},
	cardHeader: {
		height: '100%'
	},
	cardContent: {
		alignItems: 'flex-item',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center'
	},
	cardAction: {
		padding: '1em 1em 0'
	},
	regularText: {
		'& span': {
			fontWeight: 400
		}
	},
	capitalize: {
		textTransform: 'capitalize'
	}
});

const editAction = onEdit => (
	<div onClick={onEdit}>
		<EditTransparentIcon />
	</div>
);

const CorporateCapTable = withStyles(styles)(props => {
	const { classes, members = [], onEdit } = props;
	const shareholders = members.filter(m => m.identity.equity);
	if (shareholders.length === 0) {
		return null;
	}
	return (
		<Card>
			<CardHeader
				title="Cap Table"
				classes={{
					root: classes.regularText,
					action: classes.cardAction
				}}
				className={classes.cardHeader}
				action={editAction(onEdit)}
			/>
			<hr className={classes.hr} />
			<CardContent>
				<div className={classes.cardContent}>
					<Table>
						<TableHead>
							<SmallTableHeadRow>
								<SmallTableCell>
									<Typography variant="overline">Type</Typography>
								</SmallTableCell>
								<SmallTableCell>
									<Typography variant="overline">Role</Typography>
								</SmallTableCell>
								<SmallTableCell>
									<Typography variant="overline">Name</Typography>
								</SmallTableCell>
								<SmallTableCell>
									<Typography variant="overline">Email</Typography>
								</SmallTableCell>
								<SmallTableCell>
									<Typography variant="overline">
										Citizenship / Incorporation
									</Typography>
								</SmallTableCell>
								<SmallTableCell>
									<Typography variant="overline">Residency / Domicile</Typography>
								</SmallTableCell>
								<SmallTableCell>
									<Typography variant="overline">Shares</Typography>
								</SmallTableCell>
							</SmallTableHeadRow>
						</TableHead>
						<TableBody>
							{shareholders.map((s, idx) => (
								<SmallTableRow key={`cap-${idx}`}>
									<SmallTableCell>
										<Typography
											variant="subtitle1"
											className={classes.capitalize}
										>
											{getEntityType(s)}
										</Typography>
									</SmallTableCell>
									<SmallTableCell>
										<Typography
											variant="subtitle1"
											className={classes.capitalize}
										>
											{getMemberPositions(s)}
										</Typography>
									</SmallTableCell>
									<SmallTableCell>
										<Typography
											variant="subtitle1"
											className={classes.capitalize}
										>
											{getProfileName(s)}
										</Typography>
									</SmallTableCell>
									<SmallTableCell>
										<Typography variant="subtitle1">
											{getProfileEmail(s)}
										</Typography>
									</SmallTableCell>
									<SmallTableCell>
										<Typography
											variant="subtitle1"
											className={classes.capitalize}
										>
											{getProfileJurisdiction(s)}
										</Typography>
									</SmallTableCell>
									<SmallTableCell>
										<Typography
											variant="subtitle1"
											className={classes.capitalize}
										>
											{getProfileResidency(s)}
										</Typography>
									</SmallTableCell>
									<SmallTableCell>
										<Typography variant="subtitle1">
											{getMemberEquity(s)}%
										</Typography>
									</SmallTableCell>
								</SmallTableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
});

export { CorporateCapTable };
export default CorporateCapTable;
