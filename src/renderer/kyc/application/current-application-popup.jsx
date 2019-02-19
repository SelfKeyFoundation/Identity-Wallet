import React from 'react';
import {
	withStyles,
	Typography,
	CircularProgress,
	FormControlLabel,
	Checkbox,
	Grid,
	Button,
	Table,
	TableHead,
	TableBody,
	IconButton
} from '@material-ui/core';

import {
	SmallTableHeadRow,
	SmallTableCell,
	MuiEditIcon,
	MuiDeleteIcon,
	SmallTableRow
} from 'selfkey-ui';
import { Popup } from '../../common/popup';

const styles = theme => ({
	root: {},
	loading: { textAlign: 'center', paddingTop: '30px' },
	checklist: {}
});

const KycAgreement = withStyles(styles)(({ agreement }) => {
	return <FormControlLabel control={<Checkbox />} label={agreement} />;
});

const KycChecklist = withStyles(styles)(({ classes }) => {
	return (
		<Table classes={{ root: classes.checklist }}>
			<TableHead>
				<SmallTableHeadRow>
					<SmallTableCell>
						<Typography variant="overline" gutterBottom>
							Information
						</Typography>
					</SmallTableCell>
					<SmallTableCell>
						<Typography variant="overline" gutterBottom>
							Label
						</Typography>
					</SmallTableCell>
					<SmallTableCell>
						<Typography variant="overline" gutterBottom>
							Actions
						</Typography>
					</SmallTableCell>
				</SmallTableHeadRow>
			</TableHead>

			<TableBody>
				{[
					{
						type: 'Person',
						role: 'Director, Shareholder',
						name: 'Giacomo Guilizzoni',
						email: 'giacomo.guilizzoni@mail.com',
						citizensip: 'Singapore',
						residency: 'Singapore',
						shares: '45%',
						user: 'invite',
						icons: 'icon, icon'
					},
					{
						type: 'Corporate',
						role: 'Shareholder',
						name: 'Marco Botton Ltd',
						email: 'giacomo.guilizzoni@mail.com',
						citizensip: 'Hong Kong',
						residency: 'Hong Kong',
						shares: '9%',
						user: 'logo',
						icons: 'icon, icon',
						disabled: true
					},
					{
						type: 'Corporate',
						role: 'Shareholder',
						name: 'Big Things Limited2',
						email: 'giacomo.guilizzoni@mail.com',
						citizensip: 'Hong Kong',
						residency: 'Hong Kong',
						shares: '53%',
						user: 'resend',
						icons: 'icon, icon'
					},
					{
						type: 'Corporate',
						role: 'Shareholder',
						name: 'Big Things Limited3',
						email: 'giacomo.guilizzoni@mail.com',
						citizensip: 'Hong Kong',
						residency: 'Hong Kong',
						shares: '53%',
						user: 'resend',
						icons: 'icon, icon',
						disabled: true
					}
				].map(row => {
					return (
						<SmallTableRow key={row.name}>
							<SmallTableCell>
								{row.disabled ? (
									<Typography variant="subtitle1" color="secondary" gutterBottom>
										{row.type}
									</Typography>
								) : (
									<Typography variant="subtitle1" gutterBottom>
										{row.type}
									</Typography>
								)}
							</SmallTableCell>
							<SmallTableCell>
								{row.disabled ? (
									<Typography variant="subtitle1" color="secondary" gutterBottom>
										{row.role}
									</Typography>
								) : (
									<Typography variant="subtitle1" gutterBottom>
										{row.role}
									</Typography>
								)}
							</SmallTableCell>
							<SmallTableCell>
								<Typography variant="subtitle1" gutterBottom>
									{row.disabled ? (
										<IconButton aria-label="Edit" disabled>
											<MuiEditIcon />
										</IconButton>
									) : (
										<IconButton aria-label="Edit">
											<MuiEditIcon />
										</IconButton>
									)}

									{row.disabled ? (
										<IconButton aria-label="Delete" disabled>
											<MuiDeleteIcon />
										</IconButton>
									) : (
										<IconButton aria-label="Delete">
											<MuiDeleteIcon />
										</IconButton>
									)}
								</Typography>
							</SmallTableCell>
						</SmallTableRow>
					);
				})}
			</TableBody>
		</Table>
	);
});

export const CurrentApplicationPopup = withStyles(styles)(
	({ currentApplication, classes, onClose, onSubmit, open = true, relyingParty }) => {
		if (!relyingParty || !currentApplication)
			return (
				<Popup open={open} text="KYC Checklist" closeAction={onClose}>
					<div className={classes.loading}>
						<CircularProgress />
					</div>
				</Popup>
			);
		const title = currentApplication.title || `KYC checklist: ${relyingParty.name || ''}`;
		const description = currentApplication.description || `${relyingParty.description || ''}`;
		const agreement = currentApplication.agreement;
		return (
			<Popup open={open} text={title} closeAction={onClose}>
				<Grid
					container
					className={classes.root}
					spacing={16}
					direction="column"
					justify="flex-start"
					alignItems="stretch"
				>
					<Grid item>
						<Typography variant="body2">{description}</Typography>
					</Grid>
					<Grid item>
						<KycChecklist />
					</Grid>
					{agreement ? (
						<Grid item>
							<KycAgreement agreement={agreement} />
						</Grid>
					) : (
						''
					)}
					<Grid item>
						<Grid container spacing={24}>
							<Grid item>
								<Button variant="contained" size="large" onClick={onSubmit}>
									Save
								</Button>
							</Grid>

							<Grid item>
								<Button variant="outlined" size="large" onClick={onClose}>
									Cancel
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Popup>
		);
	}
);

export default CurrentApplicationPopup;
