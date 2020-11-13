import React from 'react';
import { Typography, Input, Select, MenuItem, FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { KeyPicker, SelectDropdownIcon } from 'selfkey-ui';
import { InputTitle } from '../../common';
import { featureIsEnabled } from 'common/feature-flags';

const styles = theme => ({
	inputBox: {
		marginBottom: theme.spacing(4),
		width: '47%'
	},
	fullColumn: {
		marginBottom: theme.spacing(4),
		width: '100%'
	},
	select: {
		width: '100%'
	},
	flexColumn: {
		display: 'flex',
		flexDirection: 'column'
	},
	inputContainer: {
		alignItems: 'flex-start',
		justify: 'flex-start'
	},
	inputWrap: {
		display: 'flex',
		flexWrap: 'nowrap',
		justifyContent: 'space-between',
		width: '100%'
	},
	errorText: {
		marginBottom: theme.spacing(1)
	}
});

const CorporateMemberCorporateFormComponent = withStyles(styles)(props => {
	const {
		classes,
		jurisdictions = [],
		entityTypes = [],
		errors = {},
		jurisdiction,
		taxId,
		entityType,
		email,
		did,
		entityName,
		creationDate,
		isEditing = false,
		onFieldChange = () => {},
		showDid = true
	} = props;
	return (
		<div className={`${classes.flexColumn} ${classes.inputContainer}`}>
			<div className={classes.inputWrap}>
				<div className={`${classes.inputBox} ${classes.flexColumn}`}>
					<InputTitle title="Legal Jurisdiction" />
					<FormControl variant="filled">
						<Select
							className={classes.select}
							onChange={onFieldChange('jurisdiction')}
							displayEmpty
							error={errors.jurisdiction}
							name="jurisdiction"
							value={jurisdiction}
							disableUnderline
							IconComponent={SelectDropdownIcon}
							input={<Input disableUnderline />}
						>
							<MenuItem>
								<Typography
									className="choose"
									variant="subtitle1"
									color="textSecondary"
								>
									Choose...
								</Typography>
							</MenuItem>
							{jurisdictions.map(item => (
								<MenuItem key={item} value={item.code}>
									{item.name}
								</MenuItem>
							))}
						</Select>
						{errors.jurisdiction && (
							<Typography
								variant="subtitle2"
								color="error"
								className={classes.errorText}
							>
								{errors.jurisdiction}
							</Typography>
						)}
					</FormControl>
				</div>
				<div className={`${classes.inputBox} ${classes.flexColumn}`}>
					<InputTitle title="Legal Entity Name" />
					<Input
						id="entityName"
						fullWidth
						required
						error={errors.entityName}
						value={entityName}
						onChange={onFieldChange('entityName')}
						placeholder="Entity Name"
					/>
					{errors.entityName && (
						<Typography variant="subtitle2" color="error" className={classes.errorText}>
							{errors.entityName}
						</Typography>
					)}
				</div>
			</div>
			<div className={classes.inputWrap}>
				<div className={`${classes.inputBox} ${classes.flexColumn}`}>
					<InputTitle title="Legal Entity Type" />
					<FormControl variant="filled">
						<Select
							className={classes.select}
							onChange={onFieldChange('entityType')}
							displayEmpty
							value={entityType}
							name="entitytype"
							error={errors.entityType}
							disableUnderline
							IconComponent={SelectDropdownIcon}
							input={<Input disableUnderline />}
							disabled={isEditing}
						>
							<MenuItem>
								<Typography
									className="choose"
									variant="subtitle1"
									color="textSecondary"
								>
									Choose...
								</Typography>
							</MenuItem>
							{entityTypes.map(item => (
								<MenuItem key={item} value={item.code}>
									{item.name}
								</MenuItem>
							))}
						</Select>
						{errors.entityType && (
							<Typography
								variant="subtitle2"
								color="error"
								className={classes.errorText}
							>
								{errors.entityType}
							</Typography>
						)}
					</FormControl>
				</div>
				<div className={`${classes.inputBox} ${classes.flexColumn}`}>
					<InputTitle title="Incorporation Date" />
					<KeyPicker
						id="creationDate"
						value={creationDate}
						required
						error={errors.creationDate}
						onChange={onFieldChange('creationDate')}
						className={classes.picker}
						isError={errors.creationDate && 'true'}
						style={{
							'& >div': {
								width: '200px !important'
							}
						}}
					/>
					{errors.creationDate && (
						<Typography variant="subtitle2" color="error" className={classes.errorText}>
							{errors.creationDate}
						</Typography>
					)}
				</div>
			</div>
			<div className={classes.inputWrap}>
				<div className={`${classes.inputBox} ${classes.flexColumn}`}>
					<InputTitle title="Contact Email" />
					<Input
						id="email"
						fullWidth
						required
						type="email"
						error={errors.email}
						value={email}
						onChange={onFieldChange('email')}
						placeholder="Entity Email"
					/>
					{errors.email && (
						<Typography variant="subtitle2" color="error" className={classes.errorText}>
							{errors.email}
						</Typography>
					)}
				</div>
				<div className={`${classes.inputBox} ${classes.flexColumn}`}>
					<InputTitle title="Tax ID" optional={true} />
					<Input
						id="taxId"
						fullWidth
						value={taxId}
						error={errors.taxId}
						type="text"
						onChange={onFieldChange('taxId')}
						placeholder="Tax Payer ID"
					/>
					{errors.taxId && (
						<Typography variant="subtitle2" color="error" className={classes.errorText}>
							{errors.taxId}
						</Typography>
					)}
				</div>
			</div>
			{featureIsEnabled('did') && showDid && (
				<div className={classes.inputWrap}>
					<div className={`${classes.flexColumn} ${classes.fullColumn}`}>
						<InputTitle title="Selfkey ID (DID)" optional="true" />
						<Input
							id="did"
							fullWidth
							error={errors.did}
							value={did}
							onChange={onFieldChange('did')}
							placeholder="did:selfkey:"
						/>
						{errors.did && (
							<Typography
								variant="subtitle2"
								color="error"
								className={classes.errorText}
							>
								{errors.did}
							</Typography>
						)}
					</div>
				</div>
			)}
		</div>
	);
});

export const CorporateMemberCorporateForm = withStyles(styles)(
	CorporateMemberCorporateFormComponent
);
export default CorporateMemberCorporateForm;
