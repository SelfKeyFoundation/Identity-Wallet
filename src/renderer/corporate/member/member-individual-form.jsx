import React from 'react';
import { Typography, Input, Select, MenuItem, FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { SelectDropdownIcon } from 'selfkey-ui';
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
	}
});

const onCountryChange = (evt, field, countries, onFieldChange) => {
	let value = evt;
	if (evt && evt.target) {
		value = evt.target.value;
	}
	const selection = countries.find(c => c.country === value);
	onFieldChange(field)(selection);
};

const CorporateMemberIndividualFormComponent = withStyles(styles)(props => {
	const {
		classes,
		countries = [],
		errors = {},
		email,
		did,
		phoneNumber,
		firstName,
		lastName,
		nationality,
		country,
		onFieldChange = () => {},
		showDid = true
	} = props;
	return (
		<div className={`${classes.flexColumn} ${classes.inputContainer}`}>
			<div className={classes.inputWrap}>
				<div className={`${classes.inputBox} ${classes.flexColumn}`}>
					<InputTitle title="First Name" />
					<Input
						id="firstName"
						fullWidth
						required
						error={errors.firstName}
						value={firstName}
						onChange={onFieldChange('firstName')}
						placeholder="First Name"
					/>
					{errors.firstName && (
						<Typography variant="subtitle2" color="error" gutterBottom>
							{errors.firstName}
						</Typography>
					)}
				</div>
				<div className={`${classes.inputBox} ${classes.flexColumn}`}>
					<InputTitle title="Last Name" />
					<Input
						id="lastName"
						fullWidth
						required
						error={errors.lastName}
						value={lastName}
						onChange={onFieldChange('lastName')}
						placeholder="Last Name"
					/>
					{errors.lastName && (
						<Typography variant="subtitle2" color="error" gutterBottom>
							{errors.lastName}
						</Typography>
					)}
				</div>
			</div>

			<div className={classes.inputWrap}>
				<div className={`${classes.inputBox} ${classes.flexColumn}`}>
					<InputTitle title="Citizenship" />
					<FormControl variant="filled">
						<Select
							className={classes.select}
							onChange={e =>
								onCountryChange(e, 'nationality', countries, onFieldChange)
							}
							value={nationality ? nationality.country : null}
							name="nationality"
							error={errors.nationality}
							disableUnderline
							displayEmpty
							IconComponent={SelectDropdownIcon}
							input={<Input disableUnderline />}
						>
							<MenuItem value={null}>
								<Typography
									className="choose"
									variant="subtitle1"
									color="textSecondary"
								>
									Choose...
								</Typography>
							</MenuItem>
							{countries.map(item => (
								<MenuItem key={item} value={item.country}>
									{item.name}
								</MenuItem>
							))}
						</Select>
						{errors.nationality && (
							<Typography variant="subtitle2" color="error" gutterBottom>
								{errors.nationality}
							</Typography>
						)}
					</FormControl>
				</div>
				<div className={`${classes.inputBox} ${classes.flexColumn}`}>
					<InputTitle title="Residency" />
					<FormControl variant="filled">
						<Select
							className={classes.select}
							onChange={e => onCountryChange(e, 'country', countries, onFieldChange)}
							value={country ? country.country : null}
							name="country"
							displayEmpty
							error={errors.country}
							disableUnderline
							IconComponent={SelectDropdownIcon}
							input={<Input disableUnderline />}
						>
							<MenuItem value={null}>
								<Typography
									className="choose"
									variant="subtitle1"
									color="textSecondary"
								>
									Choose...
								</Typography>
							</MenuItem>
							{countries.map(item => (
								<MenuItem key={item.country} value={item.country}>
									{item.name}
								</MenuItem>
							))}
						</Select>
						{errors.country && (
							<Typography variant="subtitle2" color="error" gutterBottom>
								{errors.country}
							</Typography>
						)}
					</FormControl>
				</div>
			</div>

			<div className={classes.inputWrap}>
				<div className={`${classes.inputBox} ${classes.flexColumn}`}>
					<InputTitle title="Email" />
					<Input
						id="email"
						fullWidth
						required
						error={errors.email}
						value={email}
						onChange={onFieldChange('email')}
						placeholder="Email"
					/>
					{errors.email && (
						<Typography variant="subtitle2" color="error" gutterBottom>
							{errors.email}
						</Typography>
					)}
				</div>
				<div className={`${classes.inputBox} ${classes.flexColumn}`}>
					<InputTitle title="Phone" optional={true} />
					<Input
						id="phoneNumber"
						fullWidth
						error={errors.phoneNumber}
						value={phoneNumber}
						onChange={onFieldChange('phoneNumber')}
						placeholder="Phone"
					/>
					{errors.phoneNumber && (
						<Typography variant="subtitle2" color="error" gutterBottom>
							{errors.phoneNumber}
						</Typography>
					)}
				</div>
			</div>

			{featureIsEnabled('did') && showDid && (
				<div className={classes.inputWrap}>
					<div className={`${classes.flexColumn} ${classes.fullColumn}`}>
						<InputTitle title="Selfkey ID (DID)" optional={true} />
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

export const CorporateMemberIndividualForm = withStyles(styles)(
	CorporateMemberIndividualFormComponent
);
export default CorporateMemberIndividualForm;
