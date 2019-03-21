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
	RadioGroup,
	TableCell
} from '@material-ui/core';

import {
	SmallTableHeadRow,
	SmallTableCell,
	MuiEditIcon,
	SmallTableRow,
	AttributeAlertIcon,
	warning,
	success
} from 'selfkey-ui';

import { CheckOutlined } from '@material-ui/icons';

import { Popup } from '../../common/popup';

const styles = theme => ({
	root: {},
	loading: { textAlign: 'center', paddingTop: '30px' },
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
		marginBottom: 0,
		paddingTop: '10px'
	},
	agreementError: {
		marginLeft: '30px'
	},
	labelColumn: {
		whiteSpace: 'normal',
		wordBreak: 'break-all'
	},
	editColumn: {
		textAlign: 'right'
	},
	formControlLabel: {
		'& span': {
			fontSize: '14px',
			lineHeight: '17px'
		}
	},
	link: {
		color: '#00C0D9',
		cursor: 'pointer',
		textDecoration: 'none'
	},
	headCell: {
		paddingLeft: '15px'
	}
});

const KycAgreement = withStyles(styles)(({ text, classes, onChange, value, error }) => {
	return (
		<FormControl>
			<FormControlLabel
				control={
					<Checkbox
						value={value}
						onChange={(evt, checked) => {
							onChange && onChange(checked);
						}}
					/>
				}
				label={text}
			/>
			{error && !value ? (
				<FormHelperText error={true} className={classes.agreementError}>
					Please confirm you understand what happens with your information
				</FormHelperText>
			) : null}
		</FormControl>
	);
});

const KycChecklistItemLabel = withStyles(styles)(
	({ item, className, classes, selectedAttributes, onSelected }) => {
		const { options } = item;
		if (!options || options.length <= 1) {
			return (
				<Typography variant="subtitle1" gutterBottom className={className}>
					{options.length ? options[0].name : '...'}
				</Typography>
			);
		}
		const selectedAttr = selectedAttributes[item.uiId] || options[0];
		onSelected(item.uiId, selectedAttr);
		return (
			<RadioGroup
				className={classes.radioGroup}
				value={selectedAttr.id}
				onChange={evt =>
					onSelected(
						item.uiId,
						options.find(itm => '' + itm.id === '' + evt.target.value)
					)
				}
			>
				{options.map(opt => (
					<FormControlLabel
						key={opt.id}
						value={opt.id}
						control={<Radio />}
						label={opt.name}
						className={classes.formControlLabel}
					/>
				))}
			</RadioGroup>
		);
	}
);

const KycChecklistItem = withStyles(styles)(
	({ item, classes, selectedAttributes, onSelected, editItem }) => {
		const type = item.title
			? item.title
			: item.type && item.type.content
			? item.type.content.title
			: item.schemaId;
		const warning = !item.options || !item.options.length;
		const warningClassname = warning ? classes.rowWarning : '';
		let icon = warning ? (
			<AttributeAlertIcon />
		) : (
			<CheckOutlined className={classes.checkIcon} />
		);

		return (
			<SmallTableRow>
				<SmallTableCell className={warningClassname}>{icon}</SmallTableCell>
				<SmallTableCell>
					<Typography variant="subtitle1" gutterBottom className={warningClassname}>
						{type}
					</Typography>
				</SmallTableCell>
				<SmallTableCell className={classes.labelColumn}>
					<KycChecklistItemLabel
						item={item}
						className={warningClassname}
						selectedAttributes={selectedAttributes}
						onSelected={onSelected}
					/>
				</SmallTableCell>
				<SmallTableCell className={classes.editColumn}>
					<Typography variant="subtitle1" gutterBottom>
						<IconButton aria-label="Edit" onClick={event => editItem(item)}>
							<MuiEditIcon />
						</IconButton>
					</Typography>
				</SmallTableCell>
			</SmallTableRow>
		);
	}
);

const KycChecklist = withStyles(styles)(
	({ classes, requirements, selectedAttributes, onSelected, editItem }) => {
		return (
			<Table>
				<TableHead>
					<SmallTableHeadRow>
						<TableCell className={classes.headCell}> </TableCell>
						<TableCell className={classes.headCell}>
							<Typography variant="overline" gutterBottom>
								Information
							</Typography>
						</TableCell>
						<TableCell className={classes.headCell}>
							<Typography variant="overline" gutterBottom>
								Label
							</Typography>
						</TableCell>
						<TableCell className={classes.editColumn}>
							<Typography variant="overline" gutterBottom>
								Actions
							</Typography>
						</TableCell>
					</SmallTableHeadRow>
				</TableHead>

				<TableBody>
					{requirements.map((item, indx) => {
						return (
							<KycChecklistItem
								item={item}
								key={indx}
								selectedAttributes={selectedAttributes}
								onSelected={onSelected}
								editItem={editItem}
							/>
						);
					})}
				</TableBody>
			</Table>
		);
	}
);

const renderPrivacyPolicyText = ({ classes, vendor, purpose, privacyURL, termsURL }) => (
	<Typography variant="h3">
		I consent to share my information with {vendor}, for the purposes of {purpose} and that they
		may further share this information with partners and affiliates in accordance with their{' '}
		<a
			className={classes.link}
			onClick={e => {
				window.openExternal(e, privacyURL);
			}}
		>
			privacy policy
		</a>{' '}
		and{' '}
		<a
			className={classes.link}
			onClick={e => {
				window.openExternal(e, termsURL);
			}}
		>
			terms and conditions
		</a>
		, and by clicking the box, hereby agree to.
	</Typography>
);

export const CurrentApplicationPopup = withStyles(styles)(
	({
		currentApplication,
		classes,
		onClose,
		onSubmit,
		open = true,
		relyingParty,
		requirements,
		selectedAttributes,
		agreement,
		agreementError,
		onAgreementChange,
		agreementValue,
		error,
		onSelected,
		editItem
	}) => {
		if (!relyingParty || !currentApplication || !requirements)
			return (
				<Popup open={open} text="KYC Checklist" closeAction={onClose}>
					<div className={classes.loading}>
						<CircularProgress />
					</div>
				</Popup>
			);
		const title = currentApplication.title || `KYC checklist: ${relyingParty.name || ''}`;
		// const description = currentApplication.description || `${relyingParty.description || ''}`;
		const submitDisabled = (agreement && agreementError && !agreementValue) || error;

		// FIXME: TBD if this info should be stored on Airtable
		const vendor = 'Far Horizon Capital Inc';
		const privacyURL = 'https://flagtheory.com/privacy-policy';
		const termsURL = 'http://flagtheory.com/terms-and-conditions';

		const purpose = agreement;
		const description = currentApplication.description;

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
						<KycChecklist
							requirements={requirements}
							selectedAttributes={selectedAttributes}
							onSelected={onSelected}
							editItem={editItem}
						/>
					</Grid>
					{agreement ? (
						<Grid item>
							<KycAgreement
								text={renderPrivacyPolicyText({
									classes,
									vendor,
									purpose,
									privacyURL,
									termsURL
								})}
								value={agreementValue}
								error={agreementError}
								onChange={onAgreementChange}
							/>
						</Grid>
					) : (
						''
					)}
					{error || currentApplication.error ? (
						<Grid item>
							<Typography variant="body2" color="error">
								Error:{' '}
								{error && error.message
									? error.message
									: currentApplication.error && currentApplication.error.message
									? currentApplication.error.message
									: 'You must provide all required information to proceed. Please update any missing details.'}
							</Typography>
						</Grid>
					) : null}
					<Grid item>
						<Grid container spacing={24}>
							<Grid item>
								<Button
									variant="contained"
									size="large"
									onClick={onSubmit}
									disabled={submitDisabled}
								>
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
