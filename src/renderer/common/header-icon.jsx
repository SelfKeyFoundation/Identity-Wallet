import React from 'react';
import { withStyles } from '@material-ui/styles';
import { CheckMaIcon, DeniedIcon, HourGlassIcon } from 'selfkey-ui';

const styles = () => ({});

const HeaderIcon = withStyles(styles)(({ status, classes }) => {
	let icon = null;
	/* Check KYC Status here: https://confluence.kyc-chain.com/display/DEV/KYC+Process+Statuses
	 *	 1 In progress: HourGlassIcon
	 *	 2 Approved: CheckMaIcon
	 *	 3 Rejected: DeniedIcon
	 *	 4 Uploaded: HourGlassIcon
	 *	 5 Invited: HourGlassIcon
	 *	 6 User processing: HourGlassIcon
	 *	 7 User declined: DeniedIcon
	 *	 8 Cancelled: DeniedIcon
	 *	 9 Additional requested: HourGlassIcon
	 *	10 Corporate details: HourGlassIcon
	 *	11 User processing requirement: HourGlassIcon
	 *	12 Partially approved: HourGlassIcon
	 *	13 Send tokens: HourGlassIcon
	 *	14 Manager assigned: HourGlassIcon
	 */
	switch (status) {
		case 2:
			icon = <CheckMaIcon />;
			break;
		case 3:
			icon = <DeniedIcon />;
			break;
		case 7:
			icon = <DeniedIcon />;
			break;
		case 8:
			icon = <DeniedIcon />;
			break;
		default:
			icon = <HourGlassIcon />;
	}
	return icon;
});

export default HeaderIcon;
