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
