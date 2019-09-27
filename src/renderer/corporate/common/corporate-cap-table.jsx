import React from 'react';
import {
	Grid,
	CardHeader,
	Card,
	CardContent,
	Typography,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	withStyles
} from '@material-ui/core';
import { EditTransparentIcon, SmallTableHeadRow } from 'selfkey-ui';

const styles = theme => ({
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		margin: '5px 16px'
	},
	card: {},
	cardHeader: {
		whiteSpace: 'normal',
		wordBreak: 'break-all'
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
	const { classes, cap = [], onEdit } = props;
	return (
		<Grid container direction="column" spacing={32}>
			<Grid item>
				<Card>
					<CardHeader
						title="Cap Table"
						className={classes.regularText}
						action={editAction(onEdit)}
					/>
					<hr className={classes.hr} />
					<CardContent>
						<Grid
							container
							direction="column"
							justify="center"
							alignItems="flex-start"
							spacing={24}
						>
							<Table>
								<TableHead>
									<SmallTableHeadRow>
										<TableCell>
											<Typography variant="overline">Type</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">Role</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">Name</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">Email</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">
												Citizenship / Incorporation
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">
												Residency / Domicile
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="overline">Shares</Typography>
										</TableCell>
									</SmallTableHeadRow>
								</TableHead>
								<TableBody>
									{cap &&
										cap.map((c, idx) => (
											<TableRow key={`cap-${idx}`}>
												<TableCell>
													<Typography variant="h6">{c.type}</Typography>
												</TableCell>
												<TableCell>
													<Typography variant="h6">{c.role}</Typography>
												</TableCell>
												<TableCell>
													<Typography variant="h6">{c.name}</Typography>
												</TableCell>
												<TableCell>
													<Typography variant="h6">
														{c.email ? c.email : '-'}
													</Typography>
												</TableCell>
												<TableCell>
													<Typography variant="h6">
														{c.citizenship}
													</Typography>
												</TableCell>
												<TableCell>
													<Typography variant="h6">
														{c.residency}
													</Typography>
												</TableCell>
												<TableCell>
													<Typography variant="h6">{c.shares}</Typography>
												</TableCell>
											</TableRow>
										))}
								</TableBody>
							</Table>
						</Grid>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
});

export { CorporateCapTable };
export default CorporateCapTable;
