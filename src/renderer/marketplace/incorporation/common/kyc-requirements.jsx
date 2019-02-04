import React from 'react';
import injectSheet from 'react-jss';
import { Grid, Typography, List, ListItem } from '@material-ui/core';
import { CheckedIcon } from 'selfkey-ui';
// import { HourGlassIcon } from 'selfkey-ui';

const styles = {
	kyc: {
		width: '100%',
		paddingTop: '40px',
		borderTop: '2px solid #475768',
		marginTop: '40px'
	},
	kycRequirements: {
		'& > div': {
			width: '30%'
		}
	}
};

const IncorporationsKYC = props => {
	const { classes } = props;

	return (
		<div className={classes.kyc}>
			<Typography variant="h2" gutterBottom>
				KYC Requirements and Forms
			</Typography>
			<Grid container justify="left" alignItems="left" className={classes.kycRequirements}>
				<div>
					<div>
						<List>
							<ListItem>
								<CheckedIcon item="verified" />
								<Typography variant="body2" color="textSecondary" gutterBottom>
									Full Legal Name
								</Typography>
							</ListItem>
							<ListItem>
								<CheckedIcon item="verified" />
								<Typography variant="body2" color="textSecondary" gutterBottom>
									Email address
								</Typography>
							</ListItem>
							<ListItem>
								<CheckedIcon item="unverfied" />
								<Typography variant="body2" color="textSecondary" gutterBottom>
									Country of Residence
								</Typography>
							</ListItem>
						</List>
					</div>
				</div>
				<div>
					<List>
						<ListItem>
							<CheckedIcon item="unverfied" />
							<Typography variant="body2" color="textSecondary" gutterBottom>
								Passport
							</Typography>
						</ListItem>
						<ListItem>
							<CheckedIcon item="unverfied" />
							<Typography variant="body2" color="textSecondary" gutterBottom>
								Utility Bill (proof of residence)
							</Typography>
						</ListItem>
					</List>
				</div>
			</Grid>
		</div>
	);
};

export default injectSheet(styles)(IncorporationsKYC);
