import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
	DirectorIcon,
	// ChartIcon,
	ProfileIcon
	// CompanyIcon
} from 'selfkey-ui';

const styles = theme => ({
	title: {
		marginTop: '12px'
	},
	icon: {
		marginRight: '15px'
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

const CorporateMemberSelectRoleComponent = withStyles(styles)(props => {
	const { classes, positions } = props;
	return (
		<Grid container direction="column" spacing={8}>
			<Grid item>
				<Typography variant="body1" align="center" className={classes.title}>
					Select one or multiple roles
				</Typography>
			</Grid>
			<Grid item>
				<Grid container justify="center" className={classes.selectionBoxContainer}>
					{positions.map((p, idx) => (
						<div key={`role_${idx}`} className={classes.input}>
							<input
								type="checkbox"
								id={`role_${idx}`}
								name="roles[]"
								value={p.position}
							/>
							<label htmlFor={`role_${idx}`}>
								<div className={classes.selectionBoxHeader}>
									<div>
										<DirectorIcon className={classes.icon} />
										<Typography variant="body2">{p.title}</Typography>
									</div>
									<Typography
										variant="subtitle2"
										color="secondary"
										className={classes.selectionBoxDescription}
									>
										{p.description}
									</Typography>
								</div>
							</label>
						</div>
					))}
				</Grid>
			</Grid>
		</Grid>
	);
});

export const CorporateMemberSelectRole = withStyles(styles)(CorporateMemberSelectRoleComponent);
export default CorporateMemberSelectRole;
