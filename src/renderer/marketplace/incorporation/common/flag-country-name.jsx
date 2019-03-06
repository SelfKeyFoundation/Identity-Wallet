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

const FlagCountryName = props => (
	<div className={props.classes.container}>
		<span
			className={`${
				props.size === 'small' ? 'flag-icon-small' : 'flag-icon-default'
			} flag-icon flag-icon-${props.code ? props.code.toLowerCase() : ''}`}
		/>
		<span>{props.name}</span>
	</div>
);

export default withStyles(styles)(FlagCountryName);
