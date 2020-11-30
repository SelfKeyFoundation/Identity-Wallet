import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { handlePassword } from './password-util';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { createWalletOperations } from 'common/create-wallet';
import { Password } from './password-component';
const gotBackHome = React.forwardRef((props, ref) => <Link to="/home" {...props} ref={ref} />);

class PasswordContainerComponent extends PureComponent {
	state = {
		password: '',
		passwordScore: 0,
		strength: '',
		error: ''
	};

	handleNext = e => {
		e && e.preventDefault();
		this.props.dispatch(createWalletOperations.setPasswordAction(this.state.password));
		this.props.dispatch(push('/createPasswordConfirmation'));
	};

	handlePasswordChange = e => {
		e && e.preventDefault();
		this.setState(handlePassword(e, this.state));
	};

	render() {
		return (
			<Password
				onNextClick={this.handleNext}
				backComponent={gotBackHome}
				{...this.state}
				onPasswordChange={this.handlePasswordChange}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {};
};

export default connect(mapStateToProps)(PasswordContainerComponent);
