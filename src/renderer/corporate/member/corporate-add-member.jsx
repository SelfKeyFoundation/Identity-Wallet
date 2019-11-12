import React, { PureComponent } from 'react';
import {
	ModalWrap,
	ModalCloseButton,
	ModalCloseIcon,
	ModalHeader,
	ModalBody,
	StyledButton,
	DirectorIcon,
	// ChartIcon,
	ProfileIcon
	// CompanyIcon
} from 'selfkey-ui';
import { Grid, Modal, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { CorporateMemberIndividualForm } from '../common/member-individual-form';
import { CorporateMemberEntityForm } from '../common/member-entity-form';
import { CorporateMemberSharesForm } from '../common/member-shares-form';
import { CorporateMemberSelectRole } from '../common/member-select-role';
import { CorporateMemberSelectType } from '../common/member-select-type';

const styles = theme => ({
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
	label: {
		color: '#93A4AF',
		fontSize: '12px',
		fontWeight: 'bold',
		lineHeight: '15px'
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
	title: {
		marginTop: '12px'
	},
	icon: {
		marginRight: '15px'
	},
	selectionBoxHeader: {
		backgroundColor: '#293743',
		borderRadius: '4px',
		boxSizing: 'border-box',
		maxWidth: '280px',
		minWidth: '215px',
		padding: '25px',
		'& > div': {
			display: 'flex',
			alignItems: 'center',
			flexWrap: 'nowrap',
			wordBreak: 'break-word'
		}
	},
	selectionBoxContainer: {
		margin: '10px 0 40px'
	},
	input: {
		margin: '0 15px',
		width: '200px',
		minHeight: '158px',
		'& input, & input': {
			opacity: 0
		},
		'& input + label::after': {
			content: 'none'
		},
		'& label::before': {
			content: '',
			display: 'inline-block',
			height: '16px',
			width: '16px',
			border: '1px solid'
		},
		'& label::after': {
			content: '',
			display: 'inline-block',
			height: '6px',
			width: '9px',
			borderLeft: '2px solid',
			borderBottom: '2px solid',
			transform: 'rotate(-45deg)'
		},
		'& input + label': {
			'& > div': {
				border: '2px solid #1D505F',
				cursor: 'pointer'
			}
		},
		'& input:checked + label': {
			'& > div': {
				border: '2px solid #1CA9BA',
				cursor: 'pointer'
			}
		}
	},
	selectionBoxDescription: {
		marginTop: '15px'
	},
	memberForm: {
		width: '100%'
	},
	formActionArea: {
		marginTop: '20px',
		'& button': {
			marginRight: '1em'
		}
	}
});

class CorporateAddMemberComponent extends PureComponent {
	state = {
		type: false
	};

	render() {
		const {
			classes,
			jurisdictions,
			positions = [],
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
				<ModalWrap>
					<ModalCloseButton onClick={this.closeAction}>
						<ModalCloseIcon style={{ marginTop: '20px' }} />
					</ModalCloseButton>
					<ModalHeader>
						<Grid container direction="row" justify="space-between" alignItems="center">
							<Grid item>
								<Typography variant="body1">Add Company Member</Typography>
							</Grid>
						</Grid>
					</ModalHeader>
					<ModalBody>
						<form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
							<Grid
								container
								direction="column"
								justify="center"
								alignItems="center"
								spacing={0}
								xs={12}
							>
								<CorporateMemberSelectRole positions={positions} />

								<CorporateMemberSelectType
									types={types}
									onTypeChange={type => this.setState({ type })}
								/>

								<div className={classes.memberForm}>
									{this.state.type === 'individual' && (
										<>
											<hr className={`${classes.hr} ${classes.hrInternal}`} />
											<CorporateMemberIndividualForm
												jurisdictions={jurisdictions}
											/>
											<hr className={`${classes.hr} ${classes.hrInternal}`} />
											<CorporateMemberSharesForm />
										</>
									)}
									{this.state.type === 'corporate' && (
										<>
											<hr className={`${classes.hr} ${classes.hrInternal}`} />
											<CorporateMemberEntityForm
												jurisdictions={jurisdictions}
											/>
											<hr className={`${classes.hr} ${classes.hrInternal}`} />
											<CorporateMemberSharesForm />
										</>
									)}
								</div>
								<hr className={classes.hr} />

								<div className={classes.formActionArea}>
									<StyledButton
										id="saveButton"
										variant="contained"
										size="large"
										type="submit"
										disabled={
											!this.state.label ||
											!this.state.address ||
											hasAddressError ||
											hasLabelError
										}
									>
										Continue
									</StyledButton>
									<StyledButton
										id="cancelButton"
										variant="outlined"
										size="large"
										onClick={this.closeAction}
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

export const CorporateAddMember = withStyles(styles)(CorporateAddMemberComponent);

export default CorporateAddMember;
