import React from 'react';
import { withStyles, Typography, CircularProgress, Grid, Button } from '@material-ui/core';
import { KycAgreement } from './kyc-agreement';
import { KycAgreementText } from './kyc-agreement-text';
import { KycChecklist } from './kyc-checklist';

import { Popup } from '../../common/popup';

const styles = theme => ({
	root: {},
	loading: { textAlign: 'center', paddingTop: '30px' },
	link: {
		color: '#00C0D9',
		cursor: 'pointer',
		textDecoration: 'none'
	},
	headCell: {
		paddingLeft: theme.spacing(2)
	},
	popupClass: {
		width: '990px'
	}
});

export const CurrentApplicationPopup = withStyles(styles)(
	({
		currentApplication,
		classes,
		onClose,
		onSubmit,
		open = true,
		relyingParty,
		userData,
		requirements,
		memberRequirements,
		selectedAttributes,
		agreement,
		vendor,
		privacyPolicy,
		termsOfService,
		agreementError,
		onAgreementChange,
		agreementValue,
		error,
		filled,
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
		let agreementText = (
			<KycAgreementText
				vendor={vendor}
				purpose={purpose}
				privacyPolicy={privacyPolicy}
				termsOfService={termsOfService}
			/>
		);
		// Add documents to an existing application
		if (existingApplicationId) {
			title = `${rpName || ''} Checklist: ${currentApplication.title}`;
			description = 'You are required to reupload or provide the missing information:';
			agreement = true;
			agreementText = <KycAgreementText vendor="Far Horizon Capital Inc" purpose={rpName} />;
		}

		const submitDisabled = (agreement && agreementError && !agreementValue) || error || !filled;

		return (
			<Popup
				open={open}
				text={title}
				closeAction={onClose}
				popupClass={classes.popupClass}
				closeButtonClass={classes.closeButtonClass}
			>
				<Grid
					container
					className={classes.root}
					spacing={4}
					direction="column"
					justify="flex-start"
					alignItems="stretch"
				>
					<Grid item>
						<Typography variant="body2">{description}</Typography>
					</Grid>
					<Grid item>
						<KycChecklist
							userData={userData}
							memberRequirements={memberRequirements}
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
									: currentApplication.error &&
									  currentApplication.error.details &&
									  currentApplication.error.details.message
									? currentApplication.error.details.message
									: 'You must provide all required information to proceed. Please update any missing details.'}
							</Typography>
						</Grid>
					) : null}
					<Grid item>
						<Grid container spacing={3}>
							<Grid item>
								<Button
									variant="contained"
									size="large"
									onClick={onSubmit}
									disabled={!!submitDisabled}
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
