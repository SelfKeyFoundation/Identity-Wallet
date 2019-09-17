import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { identitySelectors, identityOperations } from 'common/identity';
import { Popup } from '../../../common/popup';
import CreateAttribute from '../components/create-attribute';

export const styles = theme => ({
	disableTransparency: {
		'& > div:first-of-type': {
			background: 'linear-gradient(135deg, rgba(43,53,64,1) 0%, rgba(30,38,46,1) 100%)',
			opacity: '1 !important'
		}
	}
});

class CreateAttributePopupComponent extends Component {
	handleSave = attribute => {
		this.props.dispatch(identityOperations.createIdAttributeOperation(attribute));
	};
	handleCancel = () => {
		if (this.props.onClose) return this.props.onClose();
	};
	render() {
		let {
			classes,
			types,
			open = true,
			text,
			subtitle,
			uiSchemas,
			typeId,
			isDocument
		} = this.props;

		if (!text) {
			if (isDocument) {
				text = 'Add Document';
			} else {
				text = 'Add Information';
			}
		}

		if (!subtitle) {
			if (isDocument) {
				subtitle = 'Document Type *';
			} else {
				subtitle = 'Information Type *';
			}
		}

		return (
			<Popup
				open={open}
				closeAction={this.handleCancel}
				text={text}
				className={classes.disableTransparency}
			>
				<CreateAttribute
					subtitle={subtitle}
					onSave={this.handleSave}
					onCancel={this.handleCancel}
					types={types}
					uiSchemas={uiSchemas}
					isDocument={isDocument}
					typeId={typeId}
				/>
			</Popup>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		types: identitySelectors.selectIdAttributeTypes(state, 'individual'),
		uiSchemas: identitySelectors.selectUiSchemas(state)
	};
};

const styledComponent = withStyles(styles)(CreateAttributePopupComponent);
export const CreateAttributePopup = connect(mapStateToProps)(styledComponent);

export default CreateAttributePopup;
