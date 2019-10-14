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
	MuiAddIcon,
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
		wordBreak: 'break-all',
		padding: '5px'
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
	},
	duplicateAddItemBtn: {
		width: '100px'
	},
	duplicateAddItemBtnSmall: {
		width: '86px',
		marginTop: '5px',
		padding: 0
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
	({ item, className, classes, selectedAttributes, onSelected, addItem }) => {
		const { options } = item;
		if (!options || options.length <= 1) {
			return (
				<Typography variant="subtitle1" gutterBottom className={className}>
					{options.length ? options[0].name : '...'}
					{item.duplicateType && <br />}
					{item.duplicateType && (
						<Button
							color="primary"
							size="small"
							onClick={() => addItem(item)}
							className={classes.duplicateAddItemBtnSmall}
						>
							+ Add Item
						</Button>
					)}
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
				{item.duplicateType && (
					<Button
						color="primary"
						size="small"
						onClick={() => addItem(item)}
						className={classes.duplicateAddItemBtnSmall}
					>
						+ Add Item
					</Button>
				)}
			</RadioGroup>
		);
	}
);

const KycChecklistItem = withStyles(styles)(
	({ item, classes, selectedAttributes, onSelected, editItem, addItem }) => {
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
						addItem={addItem}
					/>
				</SmallTableCell>
				<SmallTableCell className={classes.editColumn}>
					<Typography variant="subtitle1" gutterBottom>
						<IconButton aria-label="Add" onClick={event => addItem(item)}>
							<MuiAddIcon />
						</IconButton>
						{!warning ? (
							<IconButton aria-label="Edit" onClick={event => editItem(item)}>
								<MuiEditIcon />
							</IconButton>
						) : null}
					</Typography>
				</SmallTableCell>
			</SmallTableRow>
		);
	}
);

const KycChecklist = withStyles(styles)(
	({ classes, requirements, selectedAttributes, onSelected, editItem, addItem }) => {
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
								addItem={addItem}
							/>
						);
					})}
				</TableBody>
			</Table>
		);
	}
);

const renderPrivacyPolicyText = ({ classes, vendor, purpose, privacyPolicy, termsOfService }) => (
	<Typography variant="h3">
		I consent to share my information with {vendor}, for the purposes of {purpose} and that they
		may further share this information with partners and affiliates in accordance with their{' '}
		<a
			className={classes.link}
			onClick={e => {
				window.openExternal(e, privacyPolicy);
			}}
		>
			privacy policy
		</a>{' '}
		and{' '}
		<a
			className={classes.link}
			onClick={e => {
				window.openExternal(e, termsOfService);
			}}
		>
			terms and conditions
		</a>
		, and by clicking the box, hereby agree to.
	</Typography>
);

const renderAgreementText = ({ classes, rpName }) => (
	<Typography variant="h3">
		I understand SelfKey Vault will pass this information for <b>Far Horizon Capital Inc</b>,{' '}
		that will provide {rpName} services in Singapore at my request and will communicate with me{' '}
		at my submitted email address abore.
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
		vendor,
		privacyPolicy,
		termsOfService,
		agreementError,
		onAgreementChange,
		agreementValue,
		error,
		onSelected,
		editItem,
		addItem,
		existingApplicationId
	}) => {
		if (!relyingParty || !currentApplication || !requirements)
			return (
				<Popup open={open} text="KYC Checklist" closeAction={onClose}>
					<div className={classes.loading}>
						<CircularProgress />
					</div>
				</Popup>
			);
		let rpName = relyingParty.name.charAt(0).toUpperCase() + relyingParty.name.slice(1);
		let title = currentApplication.title || `KYC checklist: ${rpName || ''}`;
		// const description = currentApplication.description || `${relyingParty.description || ''}`;

		const purpose = agreement;
		let description = currentApplication.description;
		let agreementText = renderPrivacyPolicyText({
			classes,
			vendor,
			purpose,
			privacyPolicy,
			termsOfService
		});
		// Add documents to an existing application
		if (existingApplicationId) {
			title = `${rpName || ''} Checklist: ${currentApplication.title}`;
			description = 'You are required to reupload or provide the missing information:';
			agreement = true;
			agreementText = renderAgreementText({ classes, rpName });
		}

		const submitDisabled = (agreement && agreementError && !agreementValue) || error;

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
							addItem={addItem}
						/>
					</Grid>
					{agreement ? (
						<Grid item>
							<KycAgreement
								text={agreementText}
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
