import React from 'react';
import {
	FormControl,
	FormControlLabel,
	Checkbox,
	FormHelperText,
	withStyles
} from '@material-ui/core';

const styles = {
	agreementError: {
		marginLeft: '30px'
	}
};

export const KycAgreement = withStyles(styles)(({ text, classes, onChange, value, error }) => {
	return (
		<FormControl>
			<FormControlLabel
				control={
					<Checkbox
						checked={value}
						onChange={(evt, checked) => {
							onChange && onChange(checked);
						}}
					/>
				}
				label={text}
			/>
			{error && !value ? (
				<FormHelperText error={true} className={classes.agreementError}>
					Please confirm you understand what happens with your information
				</FormHelperText>
			) : null}
		</FormControl>
	);
});

export default KycAgreement;
