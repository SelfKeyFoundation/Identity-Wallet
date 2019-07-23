import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import 'flag-icon-css/css/flag-icon.css';

const styles = theme => ({
	container: {
		display: 'block',
		'& .flag-icon-default': {
			width: '44px',
			display: 'block',
			fontSize: '32px'
		},
		'& .flag-icon-small': {
			width: '28px',
			display: 'block',
			fontSize: '20px'
		}
	}
});

export const FlagCountryName = withStyles(styles)(({ classes, size, code, name }) => (
	<div className={classes.container}>
		<span
			className={`${
				size === 'small' ? 'flag-icon-small' : 'flag-icon-default'
			} flag-icon flag-icon-${code ? code.toLowerCase() : ''}`}
		/>
		<span>{name}</span>
	</div>
));

export default FlagCountryName;
