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

// 	{
// 		id: 809598767582156,
// 		name: 'John Paul',
// 		type: 'person',
// 		date: 1569504593,
// 		message:
// 			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum ullamcorper purus sit amet convallis. Quisque congue augue quam, dignissim aliquam lorem dignissim ac.'
// 	},
// 	{
// 		id: 2348767582156,
// 		name: 'Smith Jhonson Certifier',
// 		type: 'certifier',
// 		date: 2234104593,
// 		message:
// 			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum ullamcorper purus sit amet convallis. Quisque congue augue quam, dignissim aliquam lorem dignissim ac.  '
// 	},
