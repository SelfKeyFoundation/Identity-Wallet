import React from 'react';
import { Typography, Input, MenuItem, Select, withStyles } from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import { KeyPicker } from 'selfkey-ui';

const CorporateEditFormComponent = withStyles(styles)(props => {
	const {
		classes,
		jurisdictions = [],
		entityTypes = [],
		errors = {},
		jurisdiction,
		taxId,
		entityType,
		email,
		entityName,
		creationDate,
		onFieldChange = () => {}
	} = props;
	return (
		<form noValidate>
			<div className={`${classes.flexColumn} ${classes.inputContainer}`}>
				<div className={classes.inputWrap}>
					<div className={`${classes.inputBox} ${classes.flexColumn}`}>
						<InputTitle title="Legal Jurisdiction" />
						<Select
							className={classes.select}
							onChange={onFieldChange('jurisdiction')}
							displayEmpty
							error={errors.jurisdiction}
							name="jurisdiction"
							value={jurisdiction}
							disableUnderline
							IconComponent={KeyboardArrowDown}
							input={<Input disableUnderline placeholder="Choose..." />}
						>
							<MenuItem value="">
								<em>Choose...</em>
							</MenuItem>
							{jurisdictions.map(item => (
								<MenuItem key={item} value={item.code}>
									{item.name}
								</MenuItem>
							))}
						</Select>
						{errors.jurisdiction && (
							<Typography variant="subtitle2" color="error" gutterBottom>
								{errors.jurisdiction}
							</Typography>
						)}
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
							<Typography variant="subtitle2" color="error" gutterBottom>
								{errors.entityName}
							</Typography>
						)}
					</div>
				</div>
				<div className={classes.inputWrap}>
					<div className={`${classes.inputBox} ${classes.flexColumn}`}>
						<InputTitle title="Legal Entity Type" />
						<Select
							className={classes.select}
							onChange={onFieldChange('entityType')}
							displayEmpty
							value={entityType}
							name="entitytype"
							error={errors.entityType}
							disableUnderline
							IconComponent={KeyboardArrowDown}
							input={<Input disableUnderline />}
						>
							<MenuItem value="">
								<em>Choose...</em>
							</MenuItem>
							{entityTypes.map(item => (
								<MenuItem key={item} value={item.code}>
									{item.name}
								</MenuItem>
							))}
						</Select>
						{errors.entityType && (
							<Typography variant="subtitle2" color="error" gutterBottom>
								{errors.entityType}
							</Typography>
						)}
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
							<Typography variant="subtitle2" color="error" gutterBottom>
								{errors.creationDate}
							</Typography>
						)}
					</div>
				</div>
				<div className={classes.inputWrap}>
					<div className={`${classes.lastInputBox} ${classes.flexColumn}`}>
						<InputTitle title="Contact Email" optional={true} />
						<Input
							id="email"
							fullWidth
							type="email"
							error={errors.email}
							value={email}
							onChange={onFieldChange('email')}
							placeholder="Entity Email"
						/>
						{errors.email && (
							<Typography variant="subtitle2" color="error" gutterBottom>
								{errors.email}
							</Typography>
						)}
					</div>
					<div className={`${classes.lastInputBox} ${classes.flexColumn}`}>
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
							<Typography variant="subtitle2" color="error" gutterBottom>
								{errors.taxId}
							</Typography>
						)}
					</div>
				</div>
			</div>
		</form>
	);
});

export const CorporateEditForm = withStyles(styles)(CorporateEditFormComponent);

export default CorporateEditForm;
