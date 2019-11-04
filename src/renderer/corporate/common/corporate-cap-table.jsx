import React from 'react';
import {
	CardHeader,
	Card,
	CardContent,
	Typography,
	Table,
	TableHead,
	TableBody,
	withStyles
} from '@material-ui/core';
import { SmallTableRow, SmallTableCell, EditTransparentIcon, SmallTableHeadRow } from 'selfkey-ui';
import {
	getEntityName,
	getEntityEmail,
	getEntityRoles,
	getEntityJurisdiction,
	getEntityResidency,
	getEntityEquity
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
	}
});

const editAction = onEdit => (
	<div onClick={onEdit}>
		<EditTransparentIcon />
	</div>
);

const CorporateCapTable = withStyles(styles)(props => {
	const { classes, members = [], onEdit } = props;

	const shareholders = members.filter(m => m.positions.find(p => p.position === 'shareholder'));

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
										<Typography variant="subtitle1">{s.entity.type}</Typography>
									</SmallTableCell>
									<SmallTableCell>
										<Typography variant="subtitle1">
											{getEntityRoles(s)}
										</Typography>
									</SmallTableCell>
									<SmallTableCell>
										<Typography variant="subtitle1">
											{getEntityName(s)}
										</Typography>
									</SmallTableCell>
									<SmallTableCell>
										<Typography variant="subtitle1">
											{getEntityEmail(s)}
										</Typography>
									</SmallTableCell>
									<SmallTableCell>
										<Typography variant="subtitle1">
											{getEntityJurisdiction(s)}
										</Typography>
									</SmallTableCell>
									<SmallTableCell>
										<Typography variant="subtitle1">
											{getEntityResidency(s)}
										</Typography>
									</SmallTableCell>
									<SmallTableCell>
										<Typography variant="subtitle1">
											{getEntityEquity(s)}
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
