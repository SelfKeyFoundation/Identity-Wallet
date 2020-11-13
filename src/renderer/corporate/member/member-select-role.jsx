import React, { PureComponent } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import {
	DirectorIcon,
	ObserverIcon,
	MemberIcon,
	SignatureIcon,
	ProtectionIcon,
	ChartIcon
} from 'selfkey-ui';

const styles = theme => ({
	title: {
		marginTop: theme.spacing(1)
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
		'& input': {
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
				cursor: 'pointer',
				height: '90%'
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
	},
	error: {
		marginBottom: theme.spacing(1),
		marginTop: theme.spacing(2),
		textAlign: 'center',
		width: '100%'
	},
	withError: {
		border: '1px solid red'
	}
});

const RoleIcon = ({ role }) => {
	switch (role) {
		case 'director-ltd':
		case 'director-fnd':
		case 'manager':
		case 'grantor':
		case 'founder':
		case 'general-partner':
			return <DirectorIcon />;
		case 'member':
			return <MemberIcon />;
		case 'observer':
			return <ObserverIcon />;
		case 'protector':
			return <ProtectionIcon />;
		case 'authorizedSignatory':
			return <SignatureIcon />;
		case 'shareholder':
			return <ChartIcon />;
		default:
			return <MemberIcon />;
	}
};

class CorporateMemberSelectRoleComponent extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			positions: props.positions
		};
	}

	handleChange = e => {
		const value = e.target.value;
		this.setState(
			state => {
				const positions = state.positions.includes(value)
					? state.positions.filter(p => p !== value) // remove item
					: [...state.positions, value]; // add item
				return { positions };
			},
			() => this.props.onFieldChange('positions')(this.state.positions)
		);
	};

	render() {
		const { classes, availablePositions, errors } = this.props;
		return (
			<Grid container direction="column" spacing={1}>
				<Grid item>
					<Typography variant="body1" align="center" className={classes.title}>
						Select one or multiple roles
					</Typography>
				</Grid>
				<Grid item>
					<Grid container justify="center" className={classes.selectionBoxContainer}>
						{availablePositions.map((p, idx) => (
							<div key={`role_${idx}`} className={classes.input}>
								<input
									type="checkbox"
									id={`role_${idx}`}
									name="roles[]"
									value={p.position}
									checked={this.state.positions.includes(p.position)}
									onChange={this.handleChange}
								/>
								<label htmlFor={`role_${idx}`}>
									<div className={classes.selectionBoxHeader}>
										<div>
											<RoleIcon role={p.position} />
											<Typography
												variant="body2"
												className={classes.selectionBoxTitle}
											>
												{p.title}
											</Typography>
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
						{errors.positions && (
							<Typography variant="subtitle2" color="error" className={classes.error}>
								{errors.positions}
							</Typography>
						)}
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export const CorporateMemberSelectRole = withStyles(styles)(CorporateMemberSelectRoleComponent);
export default CorporateMemberSelectRole;
