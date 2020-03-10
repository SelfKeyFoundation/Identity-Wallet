import React from 'react';
import { Grid, Button, Typography, withStyles, Input, CircularProgress } from '@material-ui/core';
import { MergeIcon, ModalWrap, ModalHeader, ModalBody, CloseButtonIcon } from 'selfkey-ui';

const styles = theme => ({
	icon: {
		width: '66px',
		height: '71px'
	},
	modalPosition: {
		boxShadow: '0 7px 15px 0 rgba(0, 0, 0, 0.2)',
		marginTop: '30px',
		position: 'static'
	},
	loading: {
		position: 'relative',
		marginLeft: '10px',
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
		marginLeft: '10px'
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
	bold: {
		fontWeight: 600
	},
	closeIcon: {
		cursor: 'pointer',
		position: 'absolute',
		marginLeft: '759px',
		marginTop: '-20px'
	},
	label: {
		marginBottom: '10px'
	},
	buttoms: {
		marginTop: '30px'
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
		<Grid container direction="column" justify="flex-start" alignItems="center" spacing={32}>
			<ModalWrap className={classes.modalPosition}>
				<CloseButtonIcon onClick={onCancelClick} className={classes.closeIcon} />
				<ModalHeader>
					<Grid container direction="row" justify="flex-start" alignItems="flex-start">
						<Grid item>
							<Typography variant="body1">Associate DID with this wallet</Typography>
						</Grid>
					</Grid>
				</ModalHeader>
				<ModalBody>
					<Grid container direction="row" justify="flex-start" alignItems="flex-start">
						<Grid item xs={2}>
							<MergeIcon className={classes.icon} />
						</Grid>
						<Grid item xs={10}>
							<Typography variant="body1" gutterBottom>
								If you already registered on the SelfKey Network, you can associate
								your existing DID number with this wallet. Just copy/paste it below.
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
											Please wait. Checking the blockchain for DID{' '}
											information.
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
							<Grid container spacing={24} className={classes.buttoms}>
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
				</ModalBody>
			</ModalWrap>
		</Grid>
	);
});
