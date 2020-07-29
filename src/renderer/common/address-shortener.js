import React from 'react';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
	addressContainer: {
		color: '#93B0C1',
		fontSize: '12px',
		lineHeight: '19px'
	}
});

export const AddressShortener = withStyles(styles)(props => {
	const { classes, extraClasses, address, charsFromBeginning = 12, charsFromBack = 10 } = props;
	const shortAddress = `${address.substring(0, charsFromBeginning)}...${address.substring(
		address.length - charsFromBack,
		address.length
	)}`;

	return (
		<p className={`${classes.addressContainer} ${extraClasses}`} title={address}>
			{shortAddress}
		</p>
	);
});
