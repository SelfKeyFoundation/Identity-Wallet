import React from 'react';
import { Grid, Typography, Button, Divider } from '@material-ui/core';
import { Popup } from '../common';
import { PropTypes } from 'prop-types';
import ListAttributeChooser from '../attributes/choosers/list-attribute-chooser';

export const MoonpayChooseLoginEmailModal = ({ onCancel, onNext, selected, ...chooserProps }) => {
	return (
		<Popup closeAction={onCancel} text="Connecting with MoonPay">
			<Grid container direction="column" spacing={4}>
				<Grid item>
					<Typography variant="body1">
						Choose which email address to use with MoonPay
					</Typography>
				</Grid>
				<Grid item>
					<Divider />
				</Grid>
				<Grid item>
					<ListAttributeChooser {...chooserProps} selected={selected} />
				</Grid>
				<Grid item>
					<Divider />
				</Grid>
				<Grid item>
					<Grid container direction="row" spacing={2}>
						<Grid item>
							<Button
								variant="contained"
								size="large"
								onClick={onNext}
								disabled={!selected}
							>
								Select Email
							</Button>
						</Grid>
						<Grid item>
							<Button variant="outlined" size="large" onClick={onCancel}>
								Cancel
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	);
};

MoonpayChooseLoginEmailModal.propTypes = {
	attributes: PropTypes.arrayOf(PropTypes.object),
	typesByTypeId: PropTypes.object,
	selected: PropTypes.number,
	onSelectOption: PropTypes.func.isRequired,
	onEditAttribute: PropTypes.func,
	onAddAttribute: PropTypes.func,

	onNext: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired
};

MoonpayChooseLoginEmailModal.defaultProps = {};

export default MoonpayChooseLoginEmailModal;
