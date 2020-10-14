import React from 'react';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import classNames from 'classnames';
import { CheckOutlined } from '@material-ui/icons';
import { primary, success, typography, warning, error, AttributeAlertIcon } from 'selfkey-ui';

const styles = theme => ({
	alert: {
		border: `1px solid ${typography}`,
		borderRadius: '4px',
		boxSizing: 'border-box',
		color: typography,
		minHeight: '50px',
		padding: theme.spacing(2),
		width: '100%',
		'& svg': {
			fill: typography
		}
	},
	success: {
		backgroundColor: '#313D49',
		border: `1px solid ${success}`,
		color: success,
		'& svg': {
			fill: success,
			'& g': {
				fill: success
			}
		}
	},
	warning: {
		backgroundColor: '#313D49',
		border: `1px solid ${warning}`,
		color: warning,
		'& svg': {
			fill: warning,
			'& g': {
				fill: warning
			}
		}
	},
	danger: {
		border: `1px solid ${error}`,
		color: error,
		'& svg': {
			fill: error,
			'& g': {
				fill: error
			}
		}
	},
	info: {
		border: `1px solid ${primary}`,
		color: primary,
		'& svg': {
			fill: primary,
			'& g': {
				fill: primary
			}
		}
	},
	icon: {
		height: '20px',
		marginRight: theme.spacing(2)
	},
	iconWrap: {
		alignItems: 'center',
		display: 'flex',
		maxHeight: '34px',
		minHeight: '34px'
	},
	children: {
		alignItems: 'center',
		display: 'flex',
		minHeight: '34px'
	},
	alertWrap: {
		display: 'flex',
		minHeight: '36px'
	}
});

export const AlertIcon = withStyles(styles)(({ classes, type = 'success' }) => (
	<React.Fragment>
		{type === 'success' && <CheckOutlined className={classes.icon} />}
		{['danger', 'warning'].includes(type) && <AttributeAlertIcon className={classes.icon} />}
	</React.Fragment>
));

export const Alert = withStyles(styles)(
	({ classes, type = 'success', children, icon, className, xtraClass }) => (
		<div className={classNames(classes.alert, classes[type], className)}>
			<div className={classes.alertWrap}>
				<Grid item className={classes.iconWrap}>
					{icon || <AlertIcon type={type} />}
				</Grid>
				<Grid item xs className={`${classes.children} ${xtraClass}`}>
					{children}
				</Grid>
			</div>
		</div>
	)
);
