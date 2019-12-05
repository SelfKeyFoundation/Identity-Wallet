import React, { PureComponent } from 'react';
import {
	ModalWrap,
	ModalCloseButton,
	ModalCloseIcon,
	ModalHeader,
	ModalBody,
	StyledButton
} from 'selfkey-ui';
import { Grid, Modal, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { CorporateMemberIndividualForm } from './member-individual-form';
import { CorporateMemberCorporateForm } from './member-corporate-form';
import { CorporateMemberSharesForm } from './member-shares-form';
import { CorporateMemberSelectRole } from './member-select-role';
import { CorporateMemberSelectType } from './member-select-type';

const styles = theme => ({
	modalWrap: {
		left: 'calc(50% - 480px)',
		width: '960px'
	},
	closeIcon: {
		'& div:first-of-type': {
			marginLeft: '959px !important'
		}
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
	inputError: {
		borderBottom: '2px solid #FE4B61 !important'
	},
	hr: {
		backgroundColor: '#303C49',
		border: 'none',
		boxSizing: 'border-box',
		height: '1px',
		marginBottom: '0',
		width: '100%'
	},
	hrInternal: {
		marginBottom: '20px'
	},
	memberForm: {
		width: '100%'
	},
	formActionArea: {
		marginTop: '20px',
		'& button': {
			marginRight: '1em'
		}
	},
	buttonErrorText: {
		marginTop: '20px'
	},
	fullWidth: {
		width: '100%'
	}
});

class CorporateMemberFormComponent extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			type: props.selectedType
		};
	}

	onTypeChange = type => {
		this.props.onFieldChange('type')(type);
		this.setState({ type });
	};

	render() {
		const {
			onContinueClick,
			onCancelClick,
			isDisabled,
			classes,
			onFieldChange = () => {},
			availablePositions = [],
			positions = [],
			isEditing = false,
			errors,
			types = [
				{
					title: 'Individual',
					value: 'individual'
				},
				{
					title: 'Legal Entity',
					value: 'corporate'
				}
			]
		} = this.props;

		return (
			<Modal open={true}>
				<ModalWrap className={classes.modalWrap}>
					<ModalCloseButton onClick={onCancelClick} className={classes.closeIcon}>
						<ModalCloseIcon style={{ marginTop: '20px' }} />
					</ModalCloseButton>
					<ModalHeader>
						<Grid container direction="row" justify="flex-start" alignItems="center">
							<Grid item>
								<Typography variant="body1">Add Company Member</Typography>
							</Grid>
						</Grid>
					</ModalHeader>
					<ModalBody>
						<form noValidate>
							<Grid
								container
								direction="column"
								justify="center"
								alignItems="center"
								spacing={0}
								xs={12}
							>
								<CorporateMemberSelectRole
									positions={positions}
									availablePositions={availablePositions}
									onFieldChange={onFieldChange}
									errors={errors}
								/>

								<CorporateMemberSelectType
									types={types}
									onTypeChange={this.onTypeChange}
									selected={this.state.type}
									isEditing={isEditing}
								/>

								<div className={classes.memberForm}>
									{this.state.type === 'individual' && (
										<>
											<hr className={`${classes.hr} ${classes.hrInternal}`} />
											<CorporateMemberIndividualForm {...this.props} />
										</>
									)}
									{this.state.type === 'corporate' && (
										<>
											<hr className={`${classes.hr} ${classes.hrInternal}`} />
											<CorporateMemberCorporateForm {...this.props} />
										</>
									)}
									<hr className={`${classes.hr} ${classes.hrInternal}`} />
									<CorporateMemberSharesForm {...this.props} />
								</div>
								<hr className={classes.hr} />

								{isDisabled && (
									<div className={classes.fullWidth}>
										<Typography
											variant="subtitle2"
											color="error"
											className={classes.buttonErrorText}
										>
											Please fill all the required pieces of information above
										</Typography>
									</div>
								)}

								<div className={`${classes.formActionArea} ${classes.fullWidth}`}>
									<StyledButton
										id="saveButton"
										variant="contained"
										size="large"
										type="submit"
										onClick={onContinueClick}
									>
										Continue
									</StyledButton>
									<StyledButton
										id="cancelButton"
										variant="outlined"
										size="large"
										onClick={onCancelClick}
									>
										Cancel
									</StyledButton>
								</div>
							</Grid>
						</form>
					</ModalBody>
				</ModalWrap>
			</Modal>
		);
	}
}

export const CorporateMemberForm = withStyles(styles)(CorporateMemberFormComponent);

export default CorporateMemberForm;
