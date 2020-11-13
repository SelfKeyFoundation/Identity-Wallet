import React from 'react';
import { Typography, Input, Select, MenuItem, FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { SelectDropdownIcon } from 'selfkey-ui';
import { InputTitle } from '../../common';

const styles = theme => ({
	inputBox: {
		marginBottom: theme.spacing(4),
		width: '47%',
		'& h6': {
			display: 'inline-block',
			fontWeight: 'bold',
			marginLeft: theme.spacing(1)
		}
	},
	flexColumn: {
		display: 'flex',
		flexDirection: 'column'
	},
	inputContainer: {
		alignItems: 'flex-start',
		justify: 'flex-start'
	},
	parentCompany: {
		marginBottom: theme.spacing(4)
	},
	inputWrap: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%'
	},
	error: {
		marginBottom: theme.spacing(1)
	},
	percentage: {
		marginBottom: theme.spacing(2)
	}
});

const CorporateMemberSharesFormComponent = withStyles(styles)(props => {
	const {
		classes,
		companies = [],
		positions = [],
		positionsWithEquity = [],
		errors = {},
		equity,
		parentId,
		onFieldChange = () => {},
		showParentCompany = true
	} = props;
	return (
		<div className={`${classes.flexColumn} ${classes.inputContainer}`}>
			<div className={classes.inputWrap}>
				{showParentCompany && (
					<div className={`${classes.parentCompany} ${classes.flexColumn}`}>
						<InputTitle title="Parent Company" optional={true} />
						<FormControl variant="filled">
							<Select
								className={classes.select}
								onChange={onFieldChange('parentId')}
								value={parentId}
								name="parentId"
								error={errors.parentId}
								disableUnderline
								IconComponent={SelectDropdownIcon}
								input={<Input disableUnderline />}
							>
								{companies.map(item => (
									<MenuItem key={item.identity.id} value={item.identity.id}>
										{item.entityName}
									</MenuItem>
								))}
							</Select>
							{errors.parentId && (
								<Typography
									variant="subtitle2"
									color="error"
									className={classes.error}
								>
									{errors.parentId}
								</Typography>
							)}
						</FormControl>
					</div>
				)}
				<div className={`${classes.inputBox} ${classes.flexColumn}`}>
					<InputTitle title="Shares Owned" />
					<div>
						<Input
							id="equity"
							required
							error={errors.equity}
							value={equity}
							disabled={!positions.some(p => positionsWithEquity.includes(p))}
							onChange={onFieldChange('equity')}
							placeholder="0"
						/>
						<Typography variant="h6" color="primary" className={classes.percentage}>
							%
						</Typography>
					</div>
					{errors.equity && (
						<Typography variant="subtitle2" color="error" className={classes.error}>
							{errors.equity}
						</Typography>
					)}
				</div>
			</div>
		</div>
	);
});

export const CorporateMemberSharesForm = withStyles(styles)(CorporateMemberSharesFormComponent);
export default CorporateMemberSharesForm;
