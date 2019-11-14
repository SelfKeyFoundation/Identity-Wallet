import React from 'react';
import { Typography, Input, Select, MenuItem } from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

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
		width: '47%',
		'& h6': {
			display: 'inline-block',
			marginLeft: '5px',
			fontWeight: 'bold'
		}
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
					''
				)}
			</Typography>
		</div>
	);
});

const CorporateMemberSharesFormComponent = withStyles(styles)(props => {
	const {
		classes,
		// companies = [],
		errors = {},
		shares,
		parentIdentity,
		parentCompany,
		onFieldChange = () => {},
		showParentCompany = true
	} = props;
	return (
		<div className={`${classes.flexColumn} ${classes.inputContainer}`}>
			<div className={classes.inputWrap}>
				{console.log(parentIdentity)}
				{showParentCompany && (
					<div className={`${classes.inputBox} ${classes.flexColumn}`}>
						<InputTitle title="Parent Company" />
						<Select
							className={classes.select}
							onChange={onFieldChange('parentCompany')}
							name="parentCompany"
							error={errors.parentCompany}
							disableUnderline
							IconComponent={KeyboardArrowDown}
							input={<Input disableUnderline />}
						>
							<MenuItem value="">
								<em>Choose...</em>
							</MenuItem>
							<MenuItem key={parentIdentity.id} value={parentIdentity.id}>
								{parentIdentity.entityName}
							</MenuItem>

							{/*companies.map(item => (
								<MenuItem key={item} value={item}>
									{item}
								</MenuItem>
							)) */}
						</Select>
						{errors.parentCompany && (
							<Typography variant="subtitle2" color="error" gutterBottom>
								{errors.parentCompany}
							</Typography>
						)}
					</div>
				)}
				<div className={`${classes.inputBox} ${classes.flexColumn}`}>
					<InputTitle title="Shares Owned" />
					<div>
						<Input
							id="shares"
							required
							error={errors.shares}
							value={shares}
							onChange={onFieldChange('shares')}
							placeholder="0"
						/>
						<Typography variant="title" color="primary" gutterBottom>
							%
						</Typography>
					</div>
					{errors.email && (
						<Typography variant="subtitle2" color="error" gutterBottom>
							{errors.shares}
						</Typography>
					)}
				</div>
			</div>
		</div>
	);
});

export const CorporateMemberSharesForm = withStyles(styles)(CorporateMemberSharesFormComponent);
export default CorporateMemberSharesForm;
