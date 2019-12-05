import React from 'react';
import { Typography, Input, Select, MenuItem } from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { KeyPicker } from 'selfkey-ui';

const styles = theme => ({
	regularText: {
		padding: '24px 30px',
		'& span': {
			fontWeight: 400
		}
	},
	cancel: {
		paddingLeft: '20px'
	},
	footer: {
		alignItems: 'flex-start',
		display: 'flex',
		justifyContent: 'flex-start',
		paddingTop: '60px'
	},
	inputBox: {
		marginBottom: '35px',
		width: '47%'
	},
	fullColumn: {
		marginBottom: '35px',
		width: '100%'
	},
	lastInputBox: {
		marginBottom: '26px',
		width: '47%'
	},
	keyBox: {
		marginBottom: '35px',
		marginRight: 'calc(47% - 200px)',
		width: '200px',
		'& .rdt': {
			width: '180px'
		}
	},
	optional: {
		display: 'inline',
		fontStyle: 'italic',
		marginLeft: '5px',
		textTransform: 'lowercase'
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
	}
});

const InputTitle = withStyles(styles)(({ classes, title, optional = false }) => {
	return (
		<div>
			<Typography variant="overline" gutterBottom>
				{title}
				{optional ? (
					<Typography variant="overline" className={classes.optional}>
						(optional)
					</Typography>
				) : (
					'*'
				)}
			</Typography>
		</div>
	);
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
		onFieldChange = () => {},
		showDid = true
	} = props;
	return (
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
							<MenuItem key={item} value={item}>
								{item}
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
							<MenuItem key={item} value={item}>
								{item}
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
					<InputTitle title="Creation Date" />
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
			{showDid && (
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
							<Typography variant="subtitle2" color="error" gutterBottom>
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
