import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyledButton, ModalBox } from 'selfkey-ui';
import { addressBookSelectors, addressBookOperations } from 'common/address-book';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

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

	input: {
		boxSizing: 'border-box',
		height: '46px',
		width: '722px',
		border: '1px solid #384656',
		borderRadius: '4px',
		backgroundColor: '#1E262E',
		color: '#a9c5d6',
		fontSize: '14px',
		boxShadow:
			'inset -1px 0 0 0 rgba(0,0,0,0.24), 1px 0 0 0 rgba(118,128,147,0.2), 2px 0 2px 0 rgba(0,0,0,0.2)',
		paddingLeft: '10px',
		'&::-webkit-input-placeholder': {
			fontSize: '14px',
			color: '#93B0C1'
		}
	},

	inputError: {
		borderBottom: '2px solid #FE4B61 !important'
	},

	label: {
		color: '#93A4AF',
		fontSize: '12px',
		fontWeight: 'bold',
		lineHeight: '15px'
	}
});

class AddressBookEditContainer extends Component {
	state = {
		id: undefined,
		label: ''
	};

	componentDidMount() {
		const id = this.props.id;
		const label = this.props.label;
		this.setState({
			...this.state,
			id: id,
			label: label
		});
		this.props.dispatch(addressBookOperations.resetEdit());
	}

	handleLabelChange = event => {
		event.preventDefault();
		const label = event.target.value;
		this.setState({
			...this.state,
			label
		});
		this.props.dispatch(addressBookOperations.validateLabel(label));
	};

	handleSubmit = event => {
		event.preventDefault();
		return this.handleEdit(this.state.label);
	};

	handleEdit = async label => {
		const id = this.props.id;
		await this.props.dispatch(addressBookOperations.editAddressBookEntry({ id, label }));
		this.props.confirmAction({ id, label });
		this.props.closeAction();
	};

	render() {
		const { classes, labelError } = this.props;
		const hasLabelError = labelError !== '' && labelError !== undefined;
		const labelInputClass = `${classes.input} ${hasLabelError ? classes.errorColor : ''}`;

		return (
			<ModalBox closeAction={this.props.closeAction} headerText="Edit Label">
				<form
					className={classes.container}
					noValidate
					autoComplete="off"
					onSubmit={this.handleSubmit}
				>
					<Grid container direction="column" spacing={32}>
						<Grid item>
							<Grid container direction="column" spacing={8}>
								<Grid item>
									<label className={classes.label}>LABEL</label>
								</Grid>
								<Grid item>
									<input
										type="text"
										id="labelInput"
										onChange={this.handleLabelChange}
										value={this.state.label}
										className={labelInputClass}
										placeholder="Address label"
									/>
									{hasLabelError && (
										<span id="labelError" className={classes.errorText}>
											{labelError}
										</span>
									)}
								</Grid>
							</Grid>
						</Grid>
						<Grid item>
							<Grid container direction="row" spacing={24}>
								<Grid item>
									<StyledButton
										id="saveButton"
										variant="contained"
										size="medium"
										type="submit"
										disabled={!this.state.label || hasLabelError}
									>
										Save
									</StyledButton>
								</Grid>
								<Grid item>
									<StyledButton
										id="cancelButton"
										variant="outlined"
										size="medium"
										onClick={this.props.closeAction}
									>
										Cancel
									</StyledButton>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</form>
			</ModalBox>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		labelError: addressBookSelectors.getLabelError(state),
		label: addressBookSelectors.getLabel(state, props.id)
	};
};

const styledComponent = withStyles(styles)(AddressBookEditContainer);
export default connect(mapStateToProps)(styledComponent);
