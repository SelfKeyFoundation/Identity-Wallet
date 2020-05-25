import React from 'react';
import { Typography, Input, Select, MenuItem, FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { SelectDropdownIcon } from 'selfkey-ui';

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
	parentCompany: {
		marginBottom: '35px'
	},
	inputWrap: {
		display: 'flex',
		flexDirection: 'column',
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
								<Typography variant="subtitle2" color="error" gutterBottom>
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
						<Typography variant="title" color="primary" gutterBottom>
							%
						</Typography>
					</div>
					{errors.equity && (
						<Typography variant="subtitle2" color="error" gutterBottom>
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
