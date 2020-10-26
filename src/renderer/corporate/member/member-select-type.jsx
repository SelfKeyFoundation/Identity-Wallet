import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { ProfileIcon, CompanyIcon } from 'selfkey-ui';

const styles = theme => ({
	title: {
		marginTop: '12px'
	},
	selectionBoxTitle: {
		marginLeft: theme.spacing(2)
	},
	selectionBoxHeader: {
		backgroundColor: '#293743',
		borderRadius: '4px',
		boxSizing: 'border-box',
		maxWidth: '280px',
		minWidth: '200px',
		padding: theme.spacing(3),
		'& > div': {
			display: 'flex',
			alignItems: 'center',
			flexWrap: 'nowrap',
			wordBreak: 'break-word'
		}
	},
	selectionBoxContainer: {
		margin: theme.spacing(1, 0, 5)
	},
	input: {
		margin: theme.spacing(0, 1),
		minHeight: '158px',
		width: '200px',
		'& input, & input': {
			opacity: 0
		},
		'& input + label::after': {
			content: 'none'
		},
		'& label::before': {
			border: '1px solid',
			content: '',
			display: 'inline-block',
			height: '16px',
			width: '16px'
		},
		'& label::after': {
			borderBottom: '2px solid',
			borderLeft: '2px solid',
			content: '',
			display: 'inline-block',
			height: '6px',
			transform: 'rotate(-45deg)',
			width: '9px'
		},
		'& input + label': {
			'& > div': {
				border: '2px solid #1D505F',
				cursor: 'pointer'
			}
		},
		'& input:checked + label': {
			'& > div': {
				border: '2px solid #1CA9BA',
				cursor: 'pointer'
			}
		}
	},
	selectionBoxDescription: {
		marginTop: theme.spacing(2)
	}
});

const EntityIcon = ({ type }) => {
	if (type === 'corporate') {
		return <CompanyIcon height="35px" width="40px" viewBox="0 0 35 40" />;
	} else {
		return <ProfileIcon height="35px" width="40px" viewBox="0 0 35 40" />;
	}
};

const CorporateMemberSelectType = withStyles(styles)(props => {
	const {
		classes,
		types = [
			{
				title: 'Individual',
				value: 'individual'
			},
			{
				title: 'Legal Entity',
				value: 'corporate'
			}
		],
		onTypeChange,
		isEditing,
		selected
	} = props;
	return (
		<Grid container direction="column" spacing={1}>
			<Grid item>
				<Typography variant="body1" align="center" className={classes.title}>
					Select Entity Type
				</Typography>
			</Grid>
			<Grid item>
				<Grid container justify="center" className={classes.selectionBoxContainer}>
					{types.map((t, idx) => (
						<div key={`type_${idx}`} className={classes.input}>
							<input
								type="radio"
								id={`type_${idx}`}
								name="type"
								value={t.value}
								onChange={() => onTypeChange(t.value)}
								defaultChecked={selected === t.value}
								disabled={isEditing}
							/>
							<label htmlFor={`type_${idx}`}>
								<div className={classes.selectionBoxHeader}>
									<div>
										<EntityIcon type={`${t.value}`} />
										<Typography
											variant="body2"
											className={classes.selectionBoxTitle}
										>
											{t.title}
										</Typography>
									</div>
								</div>
							</label>
						</div>
					))}
				</Grid>
			</Grid>
		</Grid>
	);
});

export { CorporateMemberSelectType };
export default CorporateMemberSelectType;
