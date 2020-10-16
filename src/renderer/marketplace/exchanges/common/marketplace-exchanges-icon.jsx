import React from 'react';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	defaultIcon: {
		alignItems: 'center',
		borderRadius: '5px',
		display: 'flex',
		justifyContent: 'center',
		maxWidth: '30px'
	},
	generatedIcon: {
		height: '30px',
		width: '30px'
	}
});

export const GetExchangeIcon = withStyles(styles)(({ classes, logoUrl, name }) => {
	const getColors = () => ['#46dfba', '#46b7df', '#238db4', '#25a788', '#0e4b61'];
	let random = Math.floor(Math.random() * 4);

	const icon = logoUrl ? (
		<img src={logoUrl} className={classes.defaultIcon} />
	) : (
		<div
			className={`${classes.defaultIcon} ${classes.generatedIcon}`}
			style={{
				backgroundColor: getColors()[random]
			}}
		>
			{name.charAt(0)}
		</div>
	);
	return icon;
});

export default GetExchangeIcon;
