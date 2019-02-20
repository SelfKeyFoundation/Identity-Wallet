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
	IconButton,
	FormControl,
	FormHelperText,
	Radio,
	RadioGroup
} from '@material-ui/core';

import {
	SmallTableHeadRow,
	SmallTableCell,
	MuiEditIcon,
	SmallTableRow,
	WarningIcon,
	warning,
	success
} from 'selfkey-ui';

import { CheckOutlined } from '@material-ui/icons';

import { Popup } from '../../common/popup';

const styles = theme => ({
	root: {},
	loading: { textAlign: 'center', paddingTop: '30px' },
	checklist: {},
	rowWarning: {
		color: `${warning} !important;`
	},
	warningIcon: {
		fill: warning
	},
	checkIcon: {
		fill: success
	},
	radioGroup: {
		backgroundColor: 'transparent',
		paddingTop: '30px'
	},
	agreementError: {
		marginLeft: '30px'
	}
});

const KycAgreement = withStyles(styles)(({ agreement, classes }) => {
	return (
		<FormControl>
			<FormControlLabel control={<Checkbox />} label={agreement} />
			<FormHelperText error={true} className={classes.agreementError}>
				Please confirm you understand what happens with your information
			</FormHelperText>
		</FormControl>
	);
});

const KycChecklistItemLabel = withStyles(styles)(({ item, className, classes }) => {
	const { options } = item;
	if (!options || options.length <= 1) {
		return (
			<Typography variant="subtitle1" gutterBottom className={className}>
				{options.length ? options[0].name : '...'}
			</Typography>
		);
	}
	return (
		<RadioGroup className={classes.radioGroup} value={(item.selected || {}).id}>
			{options.map(opt => (
				<FormControlLabel
					key={opt.id}
					value={opt.id}
					control={<Radio />}
					label={opt.name}
				/>
			))}
		</RadioGroup>
	);
});

const KycChecklistItem = withStyles(styles)(({ item, classes }) => {
	const type = item.type && item.type.content ? item.type.content.title : item.schemaId;
	const warning = !item.options || !item.options.length;
	const warningClassname = warning ? classes.rowWarning : '';
	let icon = warning ? <WarningIcon /> : <CheckOutlined className={classes.checkIcon} />;

	return (
		<SmallTableRow>
			<SmallTableCell className={warningClassname}>{icon}</SmallTableCell>
			<SmallTableCell>
				<Typography variant="subtitle1" gutterBottom className={warningClassname}>
					{type}
				</Typography>
			</SmallTableCell>
			<SmallTableCell>
				<KycChecklistItemLabel item={item} className={warningClassname} />
			</SmallTableCell>
			<SmallTableCell>
				<Typography variant="subtitle1" gutterBottom>
					<IconButton aria-label="Edit">
						<MuiEditIcon />
					</IconButton>
				</Typography>
			</SmallTableCell>
		</SmallTableRow>
	);
});

const KycChecklist = withStyles(styles)(({ classes, requirements }) => {
	return (
		<Table classes={{ root: classes.checklist }}>
			<TableHead>
				<SmallTableHeadRow>
					<SmallTableCell> </SmallTableCell>
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
				{requirements.map((item, indx) => {
					return <KycChecklistItem item={item} key={indx} />;
				})}
			</TableBody>
		</Table>
	);
});

export const CurrentApplicationPopup = withStyles(styles)(
	({
		currentApplication,
		classes,
		onClose,
		onSubmit,
		open = true,
		relyingParty,
		requirements
	}) => {
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
					spacing={32}
					direction="column"
					justify="flex-start"
					alignItems="stretch"
				>
					<Grid item>
						<Typography variant="body2">{description}</Typography>
					</Grid>
					<Grid item>
						<KycChecklist requirements={requirements} />
					</Grid>
					{agreement ? (
						<Grid item>
							<KycAgreement agreement={agreement} />
						</Grid>
					) : (
						''
					)}
					<Grid item>
						<Typography variant="body2" color="error">
							Error: You must provide all required information to proceed. Please
							update any missing details.
						</Typography>
					</Grid>
					<Grid item>
						<Grid container spacing={24}>
							<Grid item>
								<Button variant="contained" size="large" onClick={onSubmit}>
									Submit
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
