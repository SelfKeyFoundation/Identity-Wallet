import React from 'react';
import { withStyles } from '@material-ui/core';

const styles = {
	scrollableContainer: {
		'&::-webkit-scrollbar': {
			width: '5px',
			height: '5px'
		},
		'&::-webkit-scrollbar-button': {
			width: '0px',
			height: '0px'
		},
		'&::-webkit-scrollbar-thumb': {
			background: '#697c95',
			border: '0px none #ffffff',
			borderRadius: '34px'
		},
		'&::-webkit-scrollbar-thumb:hover': {
			background: '#697c95'
		},
		'&&::-webkit-scrollbar-thumb:active': {
			background: '#697c95'
		},
		'&::-webkit-scrollbar-trac': {
			background: '#313d49',
			border: '0px none #00fdff',
			borderRadius: '50px'
		},
		'&::-webkit-scrollbar-track:hover': {
			background: '#313d49'
		},
		'&::-webkit-scrollbar-track:active': {
			background: '#333333'
		},
		'&::-webkit-scrollbar-corner': {
			background: 'transparent'
		},
		overflow: 'auto',
		height: '100%',
		width: '100%'
	}
};

export const Scrollable = withStyles(styles)(({ classes, className = '', style, children }) => (
	<div className={`${classes.scrollableContainer} ${className}`} style={style}>
		{children}
	</div>
));
