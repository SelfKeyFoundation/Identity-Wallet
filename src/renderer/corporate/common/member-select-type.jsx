import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ProfileIcon, CompanyIcon } from 'selfkey-ui';

const styles = theme => ({
	title: {
		marginTop: '12px'
	},
	selectionBoxTitle: {
		marginLeft: '15px'
	},
	selectionBoxHeader: {
		backgroundColor: '#293743',
		borderRadius: '4px',
		boxSizing: 'border-box',
		maxWidth: '280px',
		minWidth: '215px',
		padding: '25px',
		'& > div': {
			display: 'flex',
			alignItems: 'center',
			flexWrap: 'nowrap',
			wordBreak: 'break-word'
		}
	},
	selectionBoxContainer: {
		margin: '10px 0 40px'
	},
	input: {
		margin: '0 15px',
		width: '200px',
		minHeight: '158px',
		'& input, & input': {
			opacity: 0
		},
		'& input + label::after': {
			content: 'none'
		},
		'& label::before': {
			content: '',
			display: 'inline-block',
			height: '16px',
			width: '16px',
			border: '1px solid'
		},
		'& label::after': {
			content: '',
			display: 'inline-block',
			height: '6px',
			width: '9px',
			borderLeft: '2px solid',
			borderBottom: '2px solid',
			transform: 'rotate(-45deg)'
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
		marginTop: '15px'
	}
});

const EntityIcon = ({ type }) => {
	if (type === 'corporate') {
		return <CompanyIcon height="35px" width="40px" viewBox="0 0 35 40" />;
	} else {
		return <ProfileIcon height="35px" width="40px" viewBox="0 0 35 40" />;
	}
};

const CorporateMemberSelectTypeComponent = withStyles(styles)(props => {
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
		selected
	} = props;
	return (
		<Grid container direction="column" spacing={8}>
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

export const CorporateMemberSelectType = withStyles(styles)(CorporateMemberSelectTypeComponent);
export default CorporateMemberSelectType;
