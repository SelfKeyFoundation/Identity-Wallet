import React from 'react';
import { Grid, Typography, Button, CircularProgress } from '@material-ui/core';
import { Popup } from '../common';
import { PropTypes } from 'prop-types';
import KycChecklist from '../kyc/application/kyc-checklist';

export const MoonPayKycModal = ({
	onCancel,
	onNext,
	onAttributeSelected,
	selectedAttributes,
	editAttribute,
	addAttribute,
	requirements,
	loading,
	disabled,
	error
}) => {
	return (
		<Popup closeAction={onCancel} text="MoonPay Identity Verification">
			<Grid container direction="column" spacing={4}>
				<Grid item>
					<Typography variant="body1">Verify your identity with MoonPay</Typography>
				</Grid>
				{loading && (
					<Grid item>
						<CircularProgress />
					</Grid>
				)}
				{!loading && (
					<Grid item>
						<KycChecklist
							requirements={requirements}
							selectedAttributes={selectedAttributes}
							onSelected={onAttributeSelected}
							editItem={editAttribute}
							addItem={addAttribute}
						/>
					</Grid>
				)}
				{error && (
					<Grid item>
						<Typography variant="subtitle2" color="error" gutterBottom>
							{error}
						</Typography>
					</Grid>
				)}
				<Grid item>
					<Grid container direction="row" spacing={2}>
						<Grid item>
							<Button
								variant="outlined"
								size="large"
								onClick={onNext}
								disabled={disabled || loading}
							>
								Submit
							</Button>
						</Grid>
						<Grid item>
							<Button variant="contained" size="large" onClick={onCancel}>
								Cancel
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	);
};

MoonPayKycModal.propTypes = {
	onNext: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	onAttributeSelected: PropTypes.func.isRequired,
	editAttribute: PropTypes.func.isRequired,
	addAttribute: PropTypes.func.isRequired,
	disabled: PropTypes.boolean,
	requirements: PropTypes.arrayOf(PropTypes.object),
	selectedAttributes: PropTypes.array,
	loading: PropTypes.boolean
};

MoonPayKycModal.defaultProps = {
	disabled: false,
	loading: false,
	requirements: [],
	selectedAttributes: []
};

export default MoonPayKycModal;
