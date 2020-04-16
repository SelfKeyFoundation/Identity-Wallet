import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { addressBookSelectors, addressBookOperations } from 'common/address-book';
import { Grid, Input, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { push } from 'connected-react-router';
import { Popup } from '../../common';

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
		height: '46px',
		width: '722px',
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

class AddressBookEditContainer extends PureComponent {
	state = {
		id: undefined,
		label: ''
	};

	componentDidMount() {
		const id = parseInt(this.props.match.params.id);
		this.setState({
			...this.state,
			id: id,
			label: this.props.label
		});
		this.props.dispatch(addressBookOperations.resetEdit());
	}

	componentDidUpdate(prevProps) {
		if (prevProps.label !== this.props.label) {
			this.setState({ label: this.props.label });
		}
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
		const id = this.state.id;
		await this.props.dispatch(addressBookOperations.editAddressBookEntry({ id, label }));
		this.closeAction();
	};

	closeAction = () => {
		this.props.dispatch(push('/main/addressBook'));
	};

	render() {
		const { classes, labelError } = this.props;
		const hasLabelError = labelError !== '' && labelError !== undefined;
		const labelInputClass = `${classes.input} ${hasLabelError ? classes.errorColor : ''}`;

		return (
			<Popup closeAction={this.closeAction} open text="Edit Label">
				<form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
					<Grid container direction="column" spacing={4}>
						<Grid item>
							<Grid container direction="column" spacing={1}>
								<Grid item>
									<label className={classes.label}>LABEL</label>
								</Grid>
								<Grid item>
									<Input
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
							<Grid container direction="row" spacing={3}>
								<Grid item>
									<Button
										id="saveButton"
										variant="contained"
										size="large"
										type="submit"
										disabled={!this.state.label || hasLabelError}
									>
										Save
									</Button>
								</Grid>
								<Grid item>
									<Button
										id="cancelButton"
										variant="outlined"
										size="large"
										onClick={this.closeAction}
									>
										Cancel
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</form>
			</Popup>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		labelError: addressBookSelectors.getLabelError(state),
		label: addressBookSelectors.getLabel(state, parseInt(props.match.params.id))
	};
};

const styledComponent = withStyles(styles)(AddressBookEditContainer);
export default connect(mapStateToProps)(styledComponent);
