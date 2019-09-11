import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { walletOperations, walletSelectors } from 'common/wallet';
import { identityOperations, identitySelectors } from 'common/identity';
import {
	Grid,
	Button,
	Typography,
	withStyles,
	Input,
	CircularProgress,
	Paper
} from '@material-ui/core';
import { MergeIcon, ModalWrap, ModalHeader, ModalBody, CloseButtonIcon } from 'selfkey-ui';

const styles = theme => ({
	icon: {
		width: '66px',
		height: '71px'
	},
	modalPosition: {
		position: 'static',
		marginTop: '30px'
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

class AssociateDIDComponent extends Component {
	state = {
		did: '',
		searching: false
	};

	componentDidMount() {
		this.resetErrors();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.associateError !== this.props.associateError) {
			if (this.state.searching) {
				if (this.props.associateError === 'none') {
					this.handleBackClick();
				}
				this.setState({ searching: false });
			}
		}
	}

	resetErrors = () => {
		this.props.dispatch(walletOperations.resetAssociateDID());
	};

	handleBackClick = evt => {
		evt && evt.preventDefault();
		this.props.dispatch(push(this.props.didOriginUrl));
	};

	handleFieldChange = async event => {
		let value = event.target.value;
		await this.resetErrors();
		this.setState({ did: value });
	};

	associateDID = async () => {
		await this.resetErrors();
		let did = this.state.did;
		if (did !== '') {
			await this.props.dispatch(identityOperations.updateDID(this.props.identity.id, did));
		} else {
			this.setState({ searching: false });
		}
	};

	handleSubmit = () => {
		this.setState({ searching: true }, async () => {
			await this.associateDID();
		});
	};

	render() {
		const { classes, associateError } = this.props;
		const { did, searching } = this.state;
		const isEmpty = did === '' || did === undefined;
		const hasAssociateError = associateError !== '' && associateError !== 'none' && did !== '';
		const didInputClass = `${classes.input} ${
			hasAssociateError && !searching ? classes.errorColor : ''
		}`;

		return (
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="center"
				spacing={32}
			>
				<ModalWrap className={classes.modalPosition}>
					<Paper>
						<CloseButtonIcon
							onClick={this.handleBackClick}
							className={classes.closeIcon}
						/>
						<ModalHeader>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="flex-start"
							>
								<Grid item>
									<Typography variant="body1">
										Associate DID with this wallet
									</Typography>
								</Grid>
							</Grid>
						</ModalHeader>
						<ModalBody>
							<Grid
								container
								direction="row"
								justify="flex-start"
								alignItems="flex-start"
							>
								<Grid item xs={2}>
									<MergeIcon className={classes.icon} />
								</Grid>
								<Grid item xs={10}>
									<Typography variant="body1" gutterBottom>
										If you already registered on the SelfKey Network, you can
										associate your existing DID number with this wallet. Just
										copy/paste it below.
									</Typography>
									<br />
									<Typography
										variant="overline"
										gutterBottom
										className={classes.label}
									>
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
										onChange={this.handleFieldChange}
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
												onClick={this.handleSubmit}
											>
												Associate DID
											</Button>
										</Grid>

										<Grid item>
											<Button
												variant="outlined"
												size="large"
												onClick={this.handleBackClick}
											>
												Cancel
											</Button>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</ModalBody>
					</Paper>
				</ModalWrap>
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		identity: identitySelectors.selectCurrentIdentity(state),
		associateError: walletSelectors.getAssociateError(state),
		didOriginUrl: walletSelectors.getDidOriginUrl(state)
	};
};

export const AssociateDID = connect(mapStateToProps)(withStyles(styles)(AssociateDIDComponent));

export default AssociateDID;
