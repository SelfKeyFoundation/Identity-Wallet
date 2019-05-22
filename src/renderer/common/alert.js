import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import classNames from 'classnames';
import { CheckOutlined } from '@material-ui/icons';
import { primary, success, secondary, warning, error, AttributeAlertIcon } from 'selfkey-ui';

const styles = theme => ({
	alert: {
		border: `1px solid ${secondary}`,
		height: '50px',
		width: '100%',
		borderRadius: '4px',
		padding: '15px',
		boxSizing: 'border-box',
		color: secondary,
		'& svg': {
			fill: secondary
		}
	},
	success: {
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
		marginRight: '15px'
	}
});

export const AlertIcon = withStyles(styles)(({ classes, type = 'success' }) => (
	<React.Fragment>
		{type === 'success' && <CheckOutlined className={classes.icon} />}
		{['danger', 'warning'].includes(type) && <AttributeAlertIcon className={classes.icon} />}
	</React.Fragment>
));

export const Alert = withStyles(styles)(
	({ classes, type = 'success', children, icon, className }) => (
		<div className={classNames(classes.alert, classes[type], className)}>
			<Grid container>
				<Grid item>{icon || <AlertIcon type={type} />}</Grid>
				<Grid item>{children}</Grid>
			</Grid>
		</div>
	)
);
