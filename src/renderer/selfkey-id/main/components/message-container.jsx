import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import MessageWidget from './message-widget';

const styles = theme => ({});

class MessageContainer extends PureComponent {
	render() {
		const { onBackClick, messages } = this.props;
		return <MessageWidget onBackClick={onBackClick} messages={messages} />;
	}
}

const mapStateToProps = (state, props) => {
	return {};
};

const styledComponent = withStyles(styles)(MessageContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as MessageContainer };
