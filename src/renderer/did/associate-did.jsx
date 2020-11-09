import React from 'react';
import { Grid, Button, Typography, Input, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { MergeIcon } from 'selfkey-ui';
import { Popup } from '../common';

const styles = theme => ({
	icon: {
		width: '66px',
		height: '71px'
	},
	loading: {
		position: 'relative',
		marginLeft: theme.spacing(1),
		top: '5px'
	},
	searching: {
		height: '19px',
		width: '242px',
		color: '#00C0D9',
		fontFamily: 'Lato',
		fontSize: '13px',
		lineHeight: '19px',
		textTransform: 'none',
		marginLeft: theme.spacing(1)
	},
	errorText: {
		height: '19px',
		width: '242px',
		color: '#FE4B61',
		fontFamily: 'Lato',
		fontSize: '13px',
		lineHeight: '19px'
	},
	errorColor: {
		color: '#FE4B61 !important',
		border: '2px solid #FE4B61 !important',
		backgroundColor: 'rgba(255,46,99,0.09) !important'
	},
	input: {
		width: '100%',
		'&::-webkit-input-placeholder': {
			fontSize: '14px',
			color: '#93B0C1'
		}
	},
	label: {
		marginBottom: theme.spacing(1)
	},
	buttons: {
		marginTop: theme.spacing(4)
	}
});

export const AssociateDid = withStyles(styles)(props => {
	const {
		classes,
		searching,
		associateError,
		did,
		onAssociateDidClick,
		onCancelClick,
		onFieldChange
	} = props;

	const isEmpty = did === '' || did === undefined;
	const hasAssociateError = associateError !== '' && associateError !== 'none' && did !== '';

	const didInputClass = `${classes.input} ${
		hasAssociateError && !searching ? classes.errorColor : ''
	}`;

	return (
		<Popup closeAction={onCancelClick} open text="Associate DID with this wallet">
			<Grid container direction="row" justify="flex-start" alignItems="flex-start">
				<Grid item xs={2}>
					<MergeIcon className={classes.icon} />
				</Grid>
				<Grid item xs={10}>
					<Typography variant="body1" gutterBottom>
						If you already registered on the SelfKey Network, you can associate your
						existing DID number with this wallet. Just copy/paste it below.
					</Typography>
					<br />
					<Typography variant="overline" gutterBottom className={classes.label}>
						DID Number
						{searching && (
							<React.Fragment>
								<span className={classes.loading}>
									<CircularProgress size={20} />
								</span>
								<span id="searching" className={classes.searching}>
									Please wait. Checking the blockchain for DID information.
								</span>
							</React.Fragment>
						)}
					</Typography>
					<Input
						placeholder="did:selfkey:"
						name="did"
						value={did}
						onChange={onFieldChange}
						className={didInputClass}
						disableUnderline
					/>
					{!searching && hasAssociateError && (
						<span id="associateError" className={classes.errorText}>
							{associateError}
						</span>
					)}
					<Grid container spacing={3} className={classes.buttons}>
						<Grid item>
							<Button
								variant="contained"
								disabled={hasAssociateError || isEmpty || searching}
								size="large"
								onClick={onAssociateDidClick}
							>
								Associate DID
							</Button>
						</Grid>

						<Grid item>
							<Button variant="outlined" size="large" onClick={onCancelClick}>
								Cancel
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Popup>
	);
});
