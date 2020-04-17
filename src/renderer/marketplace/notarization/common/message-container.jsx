import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import NotarizationMessageWidget from './message-widget';

const styles = theme => ({});

class NotarizationMessageContainer extends PureComponent {
	render() {
		const { onBackClick, messages } = this.props;
		return <NotarizationMessageWidget onBackClick={onBackClick} messages={messages} />;
	}
}

const mapStateToProps = (state, props) => {
	return {};
};

const styledComponent = withStyles(styles)(NotarizationMessageContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as NotarizationMessageContainer };
